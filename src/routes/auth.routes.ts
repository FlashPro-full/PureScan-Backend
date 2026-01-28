import express from 'express';
import { register, login, getMe, verify, sendVerificationCode, resetPassword } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/code', sendVerificationCode);
router.post('/verify', verify);
router.post('/login', login);
router.get('/me', authenticate, getMe);
router.post('/reset-password', resetPassword);

export default router;

