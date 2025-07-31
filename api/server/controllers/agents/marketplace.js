const { Agent } = require('~/db/models');
const { logger } = require('@dumee/data-schemas');

/**
 * Get all published agents for marketplace browsing
 * @route GET /api/agents/marketplace/browse
 */
const getPublishedAgents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      sortBy = 'popularity.downloads',
      order = 'desc',
      priceType 
    } = req.query;

    const skip = (page - 1) * limit;
    const query = { 
      isPublished: true, 
      'moderation.status': 'approved' 
    };

    // Apply filters
    if (category && category !== 'all') {
      query.marketplaceCategory = category;
    }
    
    if (priceType && priceType !== 'all') {
      query['price.type'] = priceType;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = order === 'desc' ? -1 : 1;

    const agents = await Agent.find(query)
      .populate('author', 'name avatar')
      .select('-instructions -model_parameters -tool_kwargs -versions -revenue -moderation')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Agent.countDocuments(query);

    res.json({
      agents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('[marketplace] Error getting published agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
};

/**
 * Search marketplace agents
 * @route GET /api/agents/marketplace/search
 */
const searchMarketplace = async (req, res) => {
  try {
    const { 
      q, 
      page = 1, 
      limit = 20,
      category,
      priceType,
      rating 
    } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const skip = (page - 1) * limit;
    const query = { 
      isPublished: true, 
      'moderation.status': 'approved',
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'marketplace.shortDescription': { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Apply additional filters
    if (category && category !== 'all') {
      query.marketplaceCategory = category;
    }
    
    if (priceType && priceType !== 'all') {
      query['price.type'] = priceType;
    }

    if (rating) {
      query['popularity.rating'] = { $gte: parseFloat(rating) };
    }

    const agents = await Agent.find(query)
      .populate('author', 'name avatar')
      .select('-instructions -model_parameters -tool_kwargs -versions -revenue -moderation')
      .sort({ 'popularity.downloads': -1, 'popularity.rating': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Agent.countDocuments(query);

    res.json({
      agents,
      query: q,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('[marketplace] Error searching agents:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

/**
 * Get detailed agent information
 * @route GET /api/agents/marketplace/:agentId
 */
const getAgentDetails = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await Agent.findOne({
      id: agentId,
      isPublished: true,
      'moderation.status': 'approved'
    })
      .populate('author', 'name avatar')
      .select('-model_parameters -tool_kwargs -versions -revenue -moderation')
      .lean();

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Increment view count (usage analytics)
    await Agent.updateOne(
      { id: agentId },
      { $inc: { 'popularity.usageCount': 1 } }
    );

    res.json(agent);
  } catch (error) {
    logger.error('[marketplace] Error getting agent details:', error);
    res.status(500).json({ error: 'Failed to fetch agent details' });
  }
};

/**
 * Publish an agent to marketplace
 * @route POST /api/agents/marketplace/:agentId/publish
 */
const publishAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user.id;
    const {
      marketplaceCategory,
      tags,
      price,
      marketplace
    } = req.body;

    // Verify agent ownership
    const agent = await Agent.findOne({ id: agentId, author: userId });
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found or unauthorized' });
    }

    // Validate required marketplace fields
    if (!marketplaceCategory || !marketplace?.shortDescription) {
      return res.status(400).json({ 
        error: 'Category and short description are required for publishing' 
      });
    }

    // Update agent with marketplace data
    const updateData = {
      isPublished: true,
      marketplaceCategory,
      tags: tags || [],
      price: price || { type: 'free' },
      marketplace,
      'moderation.status': 'pending'
    };

    const updatedAgent = await Agent.findOneAndUpdate(
      { id: agentId },
      { $set: updateData },
      { new: true }
    ).lean();

    res.json({ 
      message: 'Agent submitted for review', 
      agent: updatedAgent 
    });
  } catch (error) {
    logger.error('[marketplace] Error publishing agent:', error);
    res.status(500).json({ error: 'Failed to publish agent' });
  }
};

/**
 * Unpublish an agent from marketplace
 * @route POST /api/agents/marketplace/:agentId/unpublish
 */
const unpublishAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const userId = req.user.id;

    const agent = await Agent.findOneAndUpdate(
      { id: agentId, author: userId },
      { $set: { isPublished: false } },
      { new: true }
    );

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found or unauthorized' });
    }

    res.json({ message: 'Agent unpublished successfully' });
  } catch (error) {
    logger.error('[marketplace] Error unpublishing agent:', error);
    res.status(500).json({ error: 'Failed to unpublish agent' });
  }
};

/**
 * Get popular agents
 * @route GET /api/agents/marketplace/popular
 */
const getPopularAgents = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const agents = await Agent.find({
      isPublished: true,
      'moderation.status': 'approved'
    })
      .populate('author', 'name avatar')
      .select('-instructions -model_parameters -tool_kwargs -versions -revenue -moderation')
      .sort({ 
        'popularity.downloads': -1, 
        'popularity.rating': -1,
        'popularity.usageCount': -1 
      })
      .limit(parseInt(limit))
      .lean();

    res.json(agents);
  } catch (error) {
    logger.error('[marketplace] Error getting popular agents:', error);
    res.status(500).json({ error: 'Failed to fetch popular agents' });
  }
};

/**
 * Get featured agents (verified/promoted)
 * @route GET /api/agents/marketplace/featured
 */
const getFeaturedAgents = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const agents = await Agent.find({
      isPublished: true,
      isVerified: true,
      'moderation.status': 'approved'
    })
      .populate('author', 'name avatar')
      .select('-instructions -model_parameters -tool_kwargs -versions -revenue -moderation')
      .sort({ 'popularity.rating': -1 })
      .limit(parseInt(limit))
      .lean();

    res.json(agents);
  } catch (error) {
    logger.error('[marketplace] Error getting featured agents:', error);
    res.status(500).json({ error: 'Failed to fetch featured agents' });
  }
};

/**
 * Get agents by category
 * @route GET /api/agents/marketplace/categories
 */
const getCategorizedAgents = async (req, res) => {
  try {
    const categories = await Agent.aggregate([
      {
        $match: {
          isPublished: true,
          'moderation.status': 'approved'
        }
      },
      {
        $group: {
          _id: '$marketplaceCategory',
          count: { $sum: 1 },
          avgRating: { $avg: '$popularity.rating' },
          totalDownloads: { $sum: '$popularity.downloads' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json(categories);
  } catch (error) {
    logger.error('[marketplace] Error getting categorized agents:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

/**
 * Purchase a premium agent 
 * @route POST /api/agents/marketplace/:agentId/purchase  
 */
const purchaseAgent = async (req, res) => {
  // Forward to payments API
  res.redirect(307, `/api/payments/purchase/${req.params.agentId}`);
};

/**
 * Subscribe to a premium agent
 * @route POST /api/agents/marketplace/:agentId/subscribe
 */
const subscribeToAgent = async (req, res) => {
  // Forward to payments API
  res.redirect(307, `/api/payments/subscribe/${req.params.agentId}`);
};

const getMyPurchases = async (req, res) => {
  res.status(501).json({ error: 'Purchase history coming soon' });
};

const getMySubscriptions = async (req, res) => {
  res.status(501).json({ error: 'Subscription management coming soon' });
};

const getAgentAnalytics = async (req, res) => {
  res.status(501).json({ error: 'Analytics coming soon' });
};

const reviewAgent = async (req, res) => {
  res.status(501).json({ error: 'Review system coming soon' });
};

const getAgentReviews = async (req, res) => {
  res.status(501).json({ error: 'Review system coming soon' });
};

const moderateAgent = async (req, res) => {
  res.status(501).json({ error: 'Moderation system coming soon' });
};

module.exports = {
  getPublishedAgents,
  publishAgent,
  unpublishAgent,
  searchMarketplace,
  getAgentDetails,
  purchaseAgent,
  subscribeToAgent,
  getMyPurchases,
  getMySubscriptions,
  getAgentAnalytics,
  reviewAgent,
  getAgentReviews,
  moderateAgent,
  getPopularAgents,
  getFeaturedAgents,
  getCategorizedAgents,
};

