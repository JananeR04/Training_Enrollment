import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { 
  validateRegistration, 
  validateLogin, 
  handleValidationErrors 
} from '../utils/validators.js';

const router = express.Router();

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authenticate, getProfile);

export default router;