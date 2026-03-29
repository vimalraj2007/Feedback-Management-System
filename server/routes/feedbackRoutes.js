import express from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { 
  submitFeedback,
  getMyFeedback,
  getAllFeedback,
  getSingleFeedback,
  deleteFeedback
} from '../controllers/feedbackController.js';

const router = express.Router();

router.post('/', authenticate, submitFeedback);
router.get('/my', authenticate, getMyFeedback);
router.get('/', authenticate, requireRole('admin'), getAllFeedback);
router.get('/:id', authenticate, requireRole('admin'), getSingleFeedback);
router.delete('/:id', authenticate, requireRole('admin'), deleteFeedback);

export default router;
