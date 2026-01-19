import express from 'express';
import {
  createTraining,
  getAllTrainings,
  getTrainingById,
  getTrainerTrainings,
  updateTraining,
  deleteTraining
} from '../controllers/trainingController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';
import { validateTraining, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

// Public/Employee routes
router.get('/', authenticate, getAllTrainings);
router.get('/:id', authenticate, getTrainingById);

// Trainer-only routes
router.post(
  '/',
  authenticate,
  requireRole('TRAINER'),
  validateTraining,
  handleValidationErrors,
  createTraining
);

router.get(
  '/trainer/my-trainings',
  authenticate,
  requireRole('TRAINER'),
  getTrainerTrainings
);

router.put(
  '/:id',
  authenticate,
  requireRole('TRAINER'),
  updateTraining
);

router.delete(
  '/:id',
  authenticate,
  requireRole('TRAINER'),
  deleteTraining
);

export default router;