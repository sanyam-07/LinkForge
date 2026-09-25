import express from 'express';
import { getUrlAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:shortCode', protect, getUrlAnalytics);

export default router;
