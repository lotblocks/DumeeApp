const Stripe = require('stripe');
const { logger } = require('@dumee/data-schemas');
const { Agent } = require('~/db/models');

class StripeService {
  constructor() {
    this.stripe = null;
    this.initialize();
  }

  initialize() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      logger.warn('Stripe secret key not configured. Payment features will be disabled.');
      return;
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    });

    logger.info('Stripe service initialized successfully');
  }

  isEnabled() {
    return !!this.stripe;
  }

  /**
   * Create a Stripe Connect account for a creator
   * @param {Object} creator - Creator user object
   * @returns {Promise<string>} - Stripe account ID
   */
  async createConnectAccount(creator) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      const account = await this.stripe.accounts.create({
        type: 'express',
        country: creator.country || 'US',
        email: creator.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
          email: creator.email,
          first_name: creator.firstName,
          last_name: creator.lastName,
        },
        metadata: {
          dumee_user_id: creator.id,
          dumee_user_name: creator.name,
        },
      });

      logger.info(`Created Stripe Connect account for creator ${creator.id}: ${account.id}`);
      return account.id;
    } catch (error) {
      logger.error('Failed to create Stripe Connect account:', error);
      throw error;
    }
  }

  /**
   * Create an account onboarding link
   * @param {string} accountId - Stripe account ID
   * @param {string} returnUrl - URL to return after onboarding
   * @param {string} refreshUrl - URL to refresh if onboarding needs to restart
   * @returns {Promise<string>} - Onboarding URL
   */
  async createAccountLink(accountId, returnUrl, refreshUrl) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return accountLink.url;
    } catch (error) {
      logger.error('Failed to create account link:', error);
      throw error;
    }
  }

  /**
   * Create a subscription for a premium agent
   * @param {Object} params - Subscription parameters
   * @returns {Promise<Object>} - Subscription object
   */
  async createSubscription({ customerId, agentId, priceId, applicationFeePercent = 30 }) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      // Get agent and creator info
      const agent = await Agent.findOne({ id: agentId }).populate('author');
      if (!agent) {
        throw new Error('Agent not found');
      }

      const creatorAccountId = agent.author.stripeAccountId;
      if (!creatorAccountId) {
        throw new Error('Creator has not set up payments');
      }

      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        application_fee_percent: applicationFeePercent,
        transfer_data: {
          destination: creatorAccountId,
        },
        metadata: {
          dumee_agent_id: agentId,
          dumee_agent_name: agent.name,
          dumee_creator_id: agent.author.id,
        },
      });

      logger.info(`Created subscription for agent ${agentId}: ${subscription.id}`);
      return subscription;
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Create a one-time payment for a premium agent
   * @param {Object} params - Payment parameters
   * @returns {Promise<Object>} - Payment intent object
   */
  async createPaymentIntent({ customerId, agentId, amount, currency = 'usd', applicationFeePercent = 30 }) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      // Get agent and creator info
      const agent = await Agent.findOne({ id: agentId }).populate('author');
      if (!agent) {
        throw new Error('Agent not found');
      }

      const creatorAccountId = agent.author.stripeAccountId;
      if (!creatorAccountId) {
        throw new Error('Creator has not set up payments');
      }

      const applicationFeeAmount = Math.round(amount * (applicationFeePercent / 100));

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: creatorAccountId,
        },
        metadata: {
          dumee_agent_id: agentId,
          dumee_agent_name: agent.name,
          dumee_creator_id: agent.author.id,
          dumee_purchase_type: 'one_time',
        },
      });

      logger.info(`Created payment intent for agent ${agentId}: ${paymentIntent.id}`);
      return paymentIntent;
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Create a customer in Stripe
   * @param {Object} user - User object
   * @returns {Promise<string>} - Customer ID
   */
  async createCustomer(user) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          dumee_user_id: user.id,
        },
      });

      logger.info(`Created Stripe customer for user ${user.id}: ${customer.id}`);
      return customer.id;
    } catch (error) {
      logger.error('Failed to create customer:', error);
      throw error;
    }
  }

  /**
   * Create a price for an agent
   * @param {Object} params - Price parameters
   * @returns {Promise<string>} - Price ID
   */
  async createPrice({ amount, currency = 'usd', interval = 'month', agentId, agentName }) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    try {
      // First create a product
      const product = await this.stripe.products.create({
        name: `${agentName} - Dumee Agent`,
        description: `Premium access to ${agentName} AI agent on Dumee`,
        metadata: {
          dumee_agent_id: agentId,
        },
      });

      // Then create a price
      const price = await this.stripe.prices.create({
        unit_amount: amount,
        currency,
        recurring: interval ? { interval } : undefined,
        product: product.id,
        metadata: {
          dumee_agent_id: agentId,
        },
      });

      logger.info(`Created price for agent ${agentId}: ${price.id}`);
      return price.id;
    } catch (error) {
      logger.error('Failed to create price:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events from Stripe
   * @param {string} body - Raw request body
   * @param {string} signature - Stripe signature header
   * @returns {Promise<Object>} - Processed event
   */
  async handleWebhook(body, signature) {
    if (!this.isEnabled()) {
      throw new Error('Stripe not configured');
    }

    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new Error('Stripe webhook secret not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(body, signature, endpointSecret);
      
      logger.info(`Processing Stripe webhook: ${event.type}`);

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'subscription.created':
        case 'subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;
        case 'subscription.deleted':
          await this.handleSubscriptionCanceled(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSuccess(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        default:
          logger.info(`Unhandled event type: ${event.type}`);
      }

      return event;
    } catch (error) {
      logger.error('Webhook signature verification failed:', error);
      throw error;
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    // Implement payment success logic
    logger.info(`Payment succeeded: ${paymentIntent.id}`);
    // Update database, send confirmation emails, etc.
  }

  async handleSubscriptionUpdate(subscription) {
    // Implement subscription update logic
    logger.info(`Subscription updated: ${subscription.id}`);
    // Update database with new subscription status
  }

  async handleSubscriptionCanceled(subscription) {
    // Implement subscription cancellation logic
    logger.info(`Subscription canceled: ${subscription.id}`);
    // Update database, handle access revocation
  }

  async handleInvoicePaymentSuccess(invoice) {
    // Implement successful invoice payment logic
    logger.info(`Invoice payment succeeded: ${invoice.id}`);
    // Update database, handle revenue sharing
  }

  async handleInvoicePaymentFailed(invoice) {
    // Implement failed invoice payment logic
    logger.error(`Invoice payment failed: ${invoice.id}`);
    // Update database, send notification to user
  }
}

module.exports = new StripeService();

