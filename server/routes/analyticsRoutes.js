import express from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { 
  getSummary,
  getTrend,
  getDistribution,
  getSentimentSummary 
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/summary', getSummary);
router.get('/trend', getTrend);
router.get('/distribution', getDistribution);
router.get('/sentiment', getSentimentSummary);

export default router;
