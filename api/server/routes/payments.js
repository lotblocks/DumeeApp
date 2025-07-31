const express = require('express');
const { requireJwtAuth } = require('~/server/middleware');
const {
  setupCreatorAccount,
  purchaseAgent,
  subscribeToAgent,
  getMyPurchases,
  getCreatorEarnings,
  handleWebhook,
} = require('~/server/controllers/payments');

const router = express.Router();

// Public webhook endpoint (no auth required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes (require authentication)
router.use(requireJwtAuth);

// Creator monetization
router.post('/connect/setup', setupCreatorAccount);
router.get('/creator/earnings', getCreatorEarnings);

// User purchases
router.post('/purchase/:agentId', purchaseAgent);
router.post('/subscribe/:agentId', subscribeToAgent);
router.get('/my/purchases', getMyPurchases);

module.exports = router;

