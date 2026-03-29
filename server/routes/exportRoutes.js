import express from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { exportCSV, exportPDF } from '../controllers/exportController.js';

const router = express.Router();

router.use(authenticate, requireRole('admin'));

router.get('/csv', exportCSV);
router.get('/pdf', exportPDF);

export default router;
