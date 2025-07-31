const Stripe = require('stripe');
const { User, Transaction } = require('~/db/models');
const logger = require('~/config/winston');

class StripeService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a new customer in Stripe
   */
  async createCustomer(user) {
    try {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username,
        metadata: {
          userId: user._id.toString(),
          username: user.username,
        },
      });

      // Update user with Stripe customer ID
      await User.findByIdAndUpdate(user._id, {
        stripeCustomerId: customer.id,
      });

      return customer;
    } catch (error) {
      logger.error('Failed to create Stripe customer:', error);
      throw error;
    }
  }

  /**
   * Get or create a Stripe customer for a user
   */
  async getOrCreateCustomer(user) {
    if (user.stripeCustomerId) {
      try {
        const customer = await this.stripe.customers.retrieve(user.stripeCustomerId);
        if (!customer.deleted) {
          return customer;
        }
      } catch (error) {
        logger.warn('Failed to retrieve existing customer, creating new one:', error);
      }
    }
    return this.createCustomer(user);
  }

  /**
   * Create a payment intent for one-time payments
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Create a subscription for a user
   */
  async createSubscription(user, priceId, paymentMethodId) {
    try {
      const customer = await this.getOrCreateCustomer(user);

      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId: user._id.toString(),
        },
      });

      // Update user subscription status
      await User.findByIdAndUpdate(user._id, {
        subscription: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });

      // Log transaction
      await Transaction.create({
        user: user._id,
        type: 'subscription',
        amount: subscription.items.data[0].price.unit_amount / 100,
        description: `Subscription to ${subscription.items.data[0].price.nickname || 'plan'}`,
        metadata: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
        },
      });

      return subscription;
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      // Update user subscription status
      const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          'subscription.status': 'canceling',
          'subscription.cancelAtPeriodEnd': true,
        });
      }

      return subscription;
    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  /**
   * Resume a canceled subscription
   */
  async resumeSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      // Update user subscription status
      const user = await User.findOne({ 'subscription.stripeSubscriptionId': subscriptionId });
      if (user) {
        await User.findByIdAndUpdate(user._id, {
          'subscription.status': 'active',
          'subscription.cancelAtPeriodEnd': false,
        });
      }

      return subscription;
    } catch (error) {
      logger.error('Failed to resume subscription:', error);
      throw error;
    }
  }

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice', 'customer'],
      });
      return subscription;
    } catch (error) {
      logger.error('Failed to get subscription:', error);
      throw error;
    }
  }

  /**
   * Create a checkout session for subscription
   */
  async createCheckoutSession(user, priceId, successUrl, cancelUrl) {
    try {
      const customer = await this.getOrCreateCustomer(user);

      const session = await this.stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: user._id.toString(),
        },
        subscription_data: {
          metadata: {
            userId: user._id.toString(),
          },
        },
      });

      return session;
    } catch (error) {
      logger.error('Failed to create checkout session:', error);
      throw error;
    }
  }

  /**
   * Create a portal session for managing subscriptions
   */
  async createPortalSession(user, returnUrl) {
    try {
      const customer = await this.getOrCreateCustomer(user);

      const session = await this.stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: returnUrl,
      });

      return session;
    } catch (error) {
      logger.error('Failed to create portal session:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        default:
          logger.info(`Unhandled webhook event type: ${event.type}`);
      }
    } catch (error) {
      logger.error('Failed to handle webhook:', error);
      throw error;
    }
  }

  /**
   * Handle subscription update webhook
   */
  async handleSubscriptionUpdate(subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await User.findByIdAndUpdate(userId, {
      subscription: {
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  }

  /**
   * Handle subscription deleted webhook
   */
  async handleSubscriptionDeleted(subscription) {
    const userId = subscription.metadata.userId;
    if (!userId) return;

    await User.findByIdAndUpdate(userId, {
      subscription: {
        stripeSubscriptionId: null,
        stripePriceId: null,
        status: 'canceled',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      },
    });
  }

  /**
   * Handle successful payment webhook
   */
  async handlePaymentSucceeded(invoice) {
    const userId = invoice.subscription_details?.metadata?.userId;
    if (!userId) return;

    await Transaction.create({
      user: userId,
      type: 'payment',
      amount: invoice.amount_paid / 100,
      description: `Payment for subscription`,
      metadata: {
        stripeInvoiceId: invoice.id,
        stripeSubscriptionId: invoice.subscription,
      },
    });
  }

  /**
   * Handle failed payment webhook
   */
  async handlePaymentFailed(invoice) {
    const userId = invoice.subscription_details?.metadata?.userId;
    if (!userId) return;

    logger.warn(`Payment failed for user ${userId}:`, invoice.id);
    
    // You can implement additional logic here like sending emails
    // or updating user status
  }
}

module.exports = new StripeService();