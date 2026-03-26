import express from 'express';
import { sendMessage, getConversation } from '../controllers/message.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:userId', protect, getConversation);

export default router;
