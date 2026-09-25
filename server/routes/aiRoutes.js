import express from 'express';
import {
  analyzeUrl,
  generateAnalyticsInsights,
  suggestCampaign,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { aiLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/analyze-url', aiLimiter, protect, analyzeUrl);
router.post('/analytics-insights', aiLimiter, protect, generateAnalyticsInsights);
router.post('/suggest-campaign', aiLimiter, protect, suggestCampaign);

export default router;
