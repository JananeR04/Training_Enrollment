import express from 'express';
import {
  enrollInTraining,
  getMyEnrollments,
  cancelEnrollment,
  getTrainingEnrollments
} from '../controllers/enrollmentController.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

// Employee routes
router.post(
  '/',
  authenticate,
  requireRole('EMPLOYEE'),
  enrollInTraining
);

router.get(
  '/my-enrollments',
  authenticate,
  requireRole('EMPLOYEE'),
  getMyEnrollments
);

router.delete(
  '/:id',
  authenticate,
  requireRole('EMPLOYEE'),
  cancelEnrollment
);

// Trainer routes
router.get(
  '/training/:trainingId',
  authenticate,
  requireRole('TRAINER'),
  getTrainingEnrollments
);

export default router;