const rateLimit = require('express-rate-limit');
const { User, Transaction } = require('~/db/models');
const logger = require('~/config/winston');

// Create different rate limiters for different subscription tiers
const createLimiter = (windowMs, maxRequests, message) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for user ${req.user?.email || 'anonymous'}`);
      res.status(429).json({
        error: 'Too Many Requests',
        message,
        retryAfter: Math.round(windowMs / 1000),
      });
    },
  });
};

// Define rate limits for different tiers
const rateLimits = {
  free: createLimiter(60 * 60 * 1000, 10, 'Free tier limit: 10 requests per hour'),
  pro: createLimiter(60 * 1000, 100, 'Pro tier limit: 100 requests per minute'),
  enterprise: createLimiter(60 * 1000, 1000, 'Enterprise tier limit: 1000 requests per minute'),
};

// Usage tracking middleware
const trackUsage = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next();
    }

    // Extract model from request
    const model = req.body?.model || 'unknown';
    const endpoint = req.body?.endpoint || req.path;

    // Track API usage
    const usage = {
      userId: user._id,
      timestamp: new Date(),
      endpoint,
      model,
      requestId: req.id || Math.random().toString(36).substring(7),
    };

    // Update user's usage count
    await User.findByIdAndUpdate(user._id, {
      $inc: { 'subscription.usage': 1 },
    });

    // Log usage for analytics
    logger.info('API usage tracked:', usage);

    // Add usage info to response headers
    res.setHeader('X-Dumee-Usage-Count', user.subscription?.usage || 0);
    res.setHeader('X-Dumee-Usage-Limit', user.subscription?.limit || 10);

    next();
  } catch (error) {
    logger.error('Failed to track usage:', error);
    next(); // Continue even if tracking fails
  }
};

// Check subscription status and apply appropriate rate limit
const checkSubscription = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return rateLimits.free(req, res, next);
    }

    // Refresh user data to get latest subscription info
    const currentUser = await User.findById(user._id);
    if (!currentUser) {
      return rateLimits.free(req, res, next);
    }

    // Check if subscription is active
    const subscription = currentUser.subscription;
    const isActive = subscription?.status === 'active' && 
                    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd > new Date());

    // Determine tier
    let tier = 'free';
    if (isActive) {
      if (subscription.tier === 'enterprise') {
        tier = 'enterprise';
      } else if (subscription.tier === 'pro') {
        tier = 'pro';
      }
    }

    // Apply appropriate rate limiter
    req.userTier = tier;
    rateLimits[tier](req, res, next);
  } catch (error) {
    logger.error('Failed to check subscription:', error);
    rateLimits.free(req, res, next); // Default to free tier on error
  }
};

// Check usage limits for free tier
const checkUsageLimits = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next();
    }

    const subscription = user.subscription;
    
    // Skip limit check for paid tiers
    if (subscription?.tier !== 'free') {
      return next();
    }

    // Check monthly usage limit for free tier
    const usage = subscription?.usage || 0;
    const limit = subscription?.limit || 10;

    if (usage >= limit) {
      // Check if month has reset
      const lastReset = subscription?.lastUsageReset || user.createdAt;
      const now = new Date();
      const daysSinceReset = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));

      if (daysSinceReset >= 30) {
        // Reset usage counter
        await User.findByIdAndUpdate(user._id, {
          'subscription.usage': 0,
          'subscription.lastUsageReset': now,
        });
        return next();
      }

      // Usage limit exceeded
      return res.status(429).json({
        error: 'Usage Limit Exceeded',
        message: 'Free tier monthly limit reached. Please upgrade to continue.',
        usage,
        limit,
        resetDate: new Date(lastReset.getTime() + 30 * 24 * 60 * 60 * 1000),
      });
    }

    next();
  } catch (error) {
    logger.error('Failed to check usage limits:', error);
    next(); // Continue on error
  }
};

// Log transaction for billing purposes
const logTransaction = async (req, res, next) => {
  // Log response after it's sent
  const originalSend = res.send;
  res.send = function(data) {
    res.send = originalSend;
    
    // Log transaction if request was successful
    if (res.statusCode < 400 && req.user) {
      Transaction.create({
        user: req.user._id,
        type: 'api_call',
        amount: 0, // Can be used for usage-based billing
        description: `API call to ${req.path}`,
        model: req.body?.model,
        context: 'saas_usage',
        metadata: {
          endpoint: req.path,
          model: req.body?.model,
          tier: req.userTier,
          responseTime: Date.now() - req._startTime,
        },
      }).catch(error => {
        logger.error('Failed to log transaction:', error);
      });
    }
    
    return res.send(data);
  };
  
  req._startTime = Date.now();
  next();
};

// Combined SAAS middleware
const saasLimiter = [
  trackUsage,
  checkSubscription,
  checkUsageLimits,
  logTransaction,
];

module.exports = saasLimiter;