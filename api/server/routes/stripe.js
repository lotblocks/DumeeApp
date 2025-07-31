const express = require('express');
const router = express.Router();
const { requireJwtAuth } = require('~/server/middleware');
const StripeService = require('~/server/services/StripeService');
const logger = require('~/config/winston');

/**
 * Create a payment intent
 */
router.post('/create-payment-intent', requireJwtAuth, async (req, res) => {
  try {
    const { amount, currency = 'usd', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const paymentIntent = await StripeService.createPaymentIntent(
      amount,
      currency,
      {
        ...metadata,
        userId: req.user._id.toString(),
      }
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    logger.error('Failed to create payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

/**
 * Create a subscription
 */
router.post('/create-subscription', requireJwtAuth, async (req, res) => {
  try {
    const { priceId, paymentMethodId } = req.body;

    if (!priceId || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const subscription = await StripeService.createSubscription(
      req.user,
      priceId,
      paymentMethodId
    );

    res.json({
      subscriptionId: subscription.id,
      status: subscription.status,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    logger.error('Failed to create subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

/**
 * Cancel a subscription
 */
router.post('/cancel-subscription', requireJwtAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
    }

    // Verify user owns this subscription
    if (req.user.subscription?.stripeSubscriptionId !== subscriptionId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const subscription = await StripeService.cancelSubscription(subscriptionId);

    res.json({
      status: 'canceled',
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (error) {
    logger.error('Failed to cancel subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

/**
 * Resume a canceled subscription
 */
router.post('/resume-subscription', requireJwtAuth, async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ error: 'Subscription ID required' });
    }

    // Verify user owns this subscription
    if (req.user.subscription?.stripeSubscriptionId !== subscriptionId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const subscription = await StripeService.resumeSubscription(subscriptionId);

    res.json({
      status: 'active',
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  } catch (error) {
    logger.error('Failed to resume subscription:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

/**
 * Get subscription details
 */
router.get('/subscription', requireJwtAuth, async (req, res) => {
  try {
    const subscriptionId = req.user.subscription?.stripeSubscriptionId;

    if (!subscriptionId) {
      return res.json({ subscription: null });
    }

    const subscription = await StripeService.getSubscription(subscriptionId);

    res.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: {
          id: subscription.items.data[0].price.id,
          amount: subscription.items.data[0].price.unit_amount,
          currency: subscription.items.data[0].price.currency,
          interval: subscription.items.data[0].price.recurring.interval,
        },
      },
    });
  } catch (error) {
    logger.error('Failed to get subscription:', error);
    res.status(500).json({ error: 'Failed to get subscription details' });
  }
});

/**
 * Create checkout session
 */
router.post('/create-checkout-session', requireJwtAuth, async (req, res) => {
  try {
    const { priceId } = req.body;
    const baseUrl = process.env.DOMAIN_CLIENT || 'http://localhost:3090';

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID required' });
    }

    const session = await StripeService.createCheckoutSession(
      req.user,
      priceId,
      `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      `${baseUrl}/payment/canceled`
    );

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    logger.error('Failed to create checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

/**
 * Create portal session for subscription management
 */
router.post('/create-portal-session', requireJwtAuth, async (req, res) => {
  try {
    const baseUrl = process.env.DOMAIN_CLIENT || 'http://localhost:3090';

    const session = await StripeService.createPortalSession(
      req.user,
      `${baseUrl}/account/billing`
    );

    res.json({
      portalUrl: session.url,
    });
  } catch (error) {
    logger.error('Failed to create portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

/**
 * Stripe webhook endpoint
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logger.error('Stripe webhook secret not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  try {
    // Verify webhook signature
    const event = StripeService.stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );

    // Handle the event
    await StripeService.handleWebhook(event);

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

module.exports = router;