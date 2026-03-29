import express from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { questionSchema } from 'shared';
import {
  getAllActiveQuestions,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deactivateQuestion,
  reorderQuestions
} from '../controllers/questionController.js';

const router = express.Router();

router.get('/active', authenticate, getAllActiveQuestions); 
router.get('/', authenticate, requireRole('admin'), getAllQuestions); 
router.post('/', authenticate, requireRole('admin'), validateBody(questionSchema), createQuestion);
router.put('/:id', authenticate, requireRole('admin'), validateBody(questionSchema), updateQuestion);
router.delete('/:id', authenticate, requireRole('admin'), deactivateQuestion);
router.patch('/reorder', authenticate, requireRole('admin'), reorderQuestions);

export default router;
