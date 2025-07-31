const express = require('express');
const {
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
} = require('~/server/controllers/agents/marketplace');

const router = express.Router();

// Public marketplace endpoints (no auth required for browsing)
router.get('/browse', getPublishedAgents);
router.get('/search', searchMarketplace);
router.get('/popular', getPopularAgents);
router.get('/featured', getFeaturedAgents);
router.get('/categories', getCategorizedAgents);
router.get('/:agentId', getAgentDetails);
router.get('/:agentId/reviews', getAgentReviews);

// Protected endpoints (require authentication)
router.use(require('~/server/middleware/requireJwtAuth'));

// User actions
router.post('/:agentId/purchase', purchaseAgent);
router.post('/:agentId/subscribe', subscribeToAgent);
router.post('/:agentId/review', reviewAgent);
router.get('/my/purchases', getMyPurchases);
router.get('/my/subscriptions', getMySubscriptions);

// Creator actions
router.post('/:agentId/publish', publishAgent);
router.post('/:agentId/unpublish', unpublishAgent);
router.get('/:agentId/analytics', getAgentAnalytics);

// Admin/Moderation actions (require admin role)
router.post('/:agentId/moderate', moderateAgent);

module.exports = router;

