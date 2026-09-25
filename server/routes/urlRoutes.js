import express from 'express';
import {
  createUrl,
  getUserUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
} from '../controllers/urlController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import { urlCreateLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

router.post('/', urlCreateLimiter, optionalAuth, createUrl);
router.get('/', protect, getUserUrls);
router.get('/:id', protect, getUrlById);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);

export default router;
