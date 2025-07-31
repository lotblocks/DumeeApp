const stripeService = require('~/server/services/payments/stripeService');
const { Agent } = require('~/db/models');
const { logger } = require('@dumee/data-schemas');

/**
 * Initialize Stripe Connect account for creator
 * @route POST /api/payments/connect/setup
 */
const setupCreatorAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { returnUrl, refreshUrl } = req.body;

    if (!stripeService.isEnabled()) {
      return res.status(503).json({ error: 'Payment processing not available' });
    }

    // Check if user already has a Stripe account
    if (req.user.stripeAccountId) {
      // Create account link for existing account
      const accountLink = await stripeService.createAccountLink(
        req.user.stripeAccountId,
        returnUrl,
        refreshUrl
      );
      return res.json({ accountLink });
    }

    // Create new Stripe Connect account
    const accountId = await stripeService.createConnectAccount({
      id: userId,
      email: req.user.email,
      name: req.user.name,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      country: req.user.country || 'US',
    });

    // Save account ID to user
    // Note: This would need to be implemented in your User model
    // await User.findByIdAndUpdate(userId, { stripeAccountId: accountId });

    // Create onboarding link
    const accountLink = await stripeService.createAccountLink(accountId, returnUrl, refreshUrl);

    res.json({ accountId, accountLink });
  } catch (error) {
    logger.error('[payments] Error setting up creator account:', error);
    res.status(500).json({ error: 'Failed to setup creator account' });
  }
};

/**
 * Purchase a premium agent
 * @route POST /api/payments/purchase/:agentId
 */
const purchaseAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user.id;

    if (!stripeService.isEnabled()) {
      return res.status(503).json({ error: 'Payment processing not available' });
    }

    // Get agent details
    const agent = await Agent.findOne({ id: agentId, isPublished: true }).populate('author');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.price.type !== 'premium') {
      return res.status(400).json({ error: 'Agent is not available for purchase' });
    }

    // Get or create customer
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      customerId = await stripeService.createCustomer({
        id: userId,
        email: req.user.email,
        name: req.user.name,
      });
      // Save customer ID to user
      // await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId });
    }

    // Create payment intent
    const paymentIntent = await stripeService.createPaymentIntent({
      customerId,
      agentId,
      amount: agent.price.amount,
      currency: agent.price.currency || 'usd',
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: agent.price.amount,
      currency: agent.price.currency || 'usd',
    });
  } catch (error) {
    logger.error('[payments] Error creating purchase:', error);
    res.status(500).json({ error: 'Failed to create purchase' });
  }
};

/**
 * Subscribe to a premium agent
 * @route POST /api/payments/subscribe/:agentId
 */
const subscribeToAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user.id;

    if (!stripeService.isEnabled()) {
      return res.status(503).json({ error: 'Payment processing not available' });
    }

    // Get agent details
    const agent = await Agent.findOne({ id: agentId, isPublished: true }).populate('author');
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (agent.price.type !== 'subscription') {
      return res.status(400).json({ error: 'Agent is not available for subscription' });
    }

    // Get or create customer
    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      customerId = await stripeService.createCustomer({
        id: userId,
        email: req.user.email,
        name: req.user.name,
      });
    }

    // Create or get price ID
    let priceId = agent.stripePriceId;
    if (!priceId) {
      priceId = await stripeService.createPrice({
        amount: agent.price.amount,
        currency: agent.price.currency || 'usd',
        interval: agent.price.subscriptionPlan === 'yearly' ? 'year' : 'month',
        agentId,
        agentName: agent.name,
      });
      // Save price ID to agent
      await Agent.findOneAndUpdate({ id: agentId }, { stripePriceId: priceId });
    }

    // Create subscription
    const subscription = await stripeService.createSubscription({
      customerId,
      agentId,
      priceId,
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      status: subscription.status,
    });
  } catch (error) {
    logger.error('[payments] Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

/**
 * Get user's purchases and subscriptions
 * @route GET /api/payments/my/purchases
 */
const getMyPurchases = async (req, res) => {
  try {
    const userId = req.user.id;

    // This would need to be implemented with a Purchases model
    // const purchases = await Purchase.find({ userId }).populate('agent');
    
    res.json({ purchases: [] }); // Placeholder
  } catch (error) {
    logger.error('[payments] Error getting purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

/**
 * Get creator's earnings and analytics
 * @route GET /api/payments/creator/earnings
 */
const getCreatorEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all published agents by this creator
    const agents = await Agent.find({ author: userId, isPublished: true })
      .select('id name revenue popularity createdAt');

    const totalEarnings = agents.reduce((sum, agent) => 
      sum + (agent.revenue?.totalEarnings || 0), 0);
    
    const monthlyEarnings = agents.reduce((sum, agent) => 
      sum + (agent.revenue?.monthlyEarnings || 0), 0);

    const totalSubscriptions = agents.reduce((sum, agent) => 
      sum + (agent.revenue?.subscriptionCount || 0), 0);

    res.json({
      summary: {
        totalEarnings,
        monthlyEarnings,
        totalSubscriptions,
        agentCount: agents.length,
      },
      agents: agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        earnings: agent.revenue?.totalEarnings || 0,
        monthlyEarnings: agent.revenue?.monthlyEarnings || 0,
        subscriptions: agent.revenue?.subscriptionCount || 0,
        downloads: agent.popularity?.downloads || 0,
        rating: agent.popularity?.rating || 0,
        createdAt: agent.createdAt,
      })),
    });
  } catch (error) {
    logger.error('[payments] Error getting creator earnings:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

/**
 * Stripe webhook handler
 * @route POST /api/payments/webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' });
    }

    await stripeService.handleWebhook(req.body, signature);
    
    res.json({ received: true });
  } catch (error) {
    logger.error('[payments] Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
};

module.exports = {
  setupCreatorAccount,
  purchaseAgent,
  subscribeToAgent,
  getMyPurchases,
  getCreatorEarnings,
  handleWebhook,
};

