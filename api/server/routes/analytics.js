const express = require('express');
const router = express.Router();
const { requireJwtAuth, requireAdmin } = require('~/server/middleware');
const { Transaction, User } = require('~/db/models');
const logger = require('~/config/winston');

/**
 * Get user's usage analytics
 */
router.get('/usage', requireJwtAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Get usage stats
    const filter = {
      user: userId,
      type: 'api_call',
    };
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Aggregate usage by model
    const modelUsage = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$model',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$metadata.responseTime' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Aggregate usage by day
    const dailyUsage = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get current subscription info
    const user = await User.findById(userId).select('subscription');

    res.json({
      subscription: {
        tier: user.subscription?.tier || 'free',
        usage: user.subscription?.usage || 0,
        limit: user.subscription?.limit || 10,
        status: user.subscription?.status || 'inactive',
      },
      analytics: {
        modelUsage,
        dailyUsage,
        totalCalls: modelUsage.reduce((sum, m) => sum + m.count, 0),
      },
    });
  } catch (error) {
    logger.error('Failed to get usage analytics:', error);
    res.status(500).json({ error: 'Failed to get usage analytics' });
  }
});

/**
 * Get system-wide analytics (admin only)
 */
router.get('/system', requireJwtAuth, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const filter = { type: 'api_call' };
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Get total users by tier
    const usersByTier = await User.aggregate([
      {
        $group: {
          _id: '$subscription.tier',
          count: { $sum: 1 },
          activeSubscriptions: {
            $sum: {
              $cond: [{ $eq: ['$subscription.status', 'active'] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Get API usage by tier
    const usageByTier = await Transaction.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: '$userInfo' },
      {
        $group: {
          _id: '$userInfo.subscription.tier',
          totalCalls: { $sum: 1 },
          avgResponseTime: { $avg: '$metadata.responseTime' },
          uniqueUsers: { $addToSet: '$user' },
        },
      },
      {
        $project: {
          _id: 1,
          totalCalls: 1,
          avgResponseTime: 1,
          activeUsers: { $size: '$uniqueUsers' },
        },
      },
    ]);

    // Get revenue stats
    const revenueStats = await Transaction.aggregate([
      {
        $match: {
          type: { $in: ['subscription', 'payment'] },
          createdAt: dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgTransactionValue: { $avg: '$amount' },
        },
      },
    ]);

    // Get popular models
    const popularModels = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$model',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      users: {
        byTier: usersByTier,
        total: usersByTier.reduce((sum, tier) => sum + tier.count, 0),
      },
      usage: {
        byTier: usageByTier,
        totalApiCalls: usageByTier.reduce((sum, tier) => sum + tier.totalCalls, 0),
      },
      revenue: revenueStats[0] || {
        totalRevenue: 0,
        transactionCount: 0,
        avgTransactionValue: 0,
      },
      popularModels,
    });
  } catch (error) {
    logger.error('Failed to get system analytics:', error);
    res.status(500).json({ error: 'Failed to get system analytics' });
  }
});

/**
 * Export analytics data (admin only)
 */
router.get('/export', requireJwtAuth, requireAdmin, async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const filter = {};
    if (Object.keys(dateFilter).length > 0) {
      filter.createdAt = dateFilter;
    }

    // Get all transactions for export
    const transactions = await Transaction.find(filter)
      .populate('user', 'email username subscription.tier')
      .sort({ createdAt: -1 })
      .lean();

    if (format === 'csv') {
      // Convert to CSV
      const csv = [
        'Date,User,Email,Tier,Type,Amount,Model,Endpoint,ResponseTime',
        ...transactions.map(t => [
          t.createdAt.toISOString(),
          t.user?.username || 'N/A',
          t.user?.email || 'N/A',
          t.user?.subscription?.tier || 'free',
          t.type,
          t.amount || 0,
          t.model || 'N/A',
          t.metadata?.endpoint || 'N/A',
          t.metadata?.responseTime || 'N/A',
        ].join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=dumee-analytics.csv');
      res.send(csv);
    } else {
      res.json({ transactions });
    }
  } catch (error) {
    logger.error('Failed to export analytics:', error);
    res.status(500).json({ error: 'Failed to export analytics' });
  }
});

module.exports = router;