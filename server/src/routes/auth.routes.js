import express from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.patch('/me', protect, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
