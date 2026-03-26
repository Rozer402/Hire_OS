import express from 'express';
import { createInterview, getInterviews, getCandidateInterviews, getInterviewById, submitAnswer, completeInterview } from '../controllers/interview.controller.js';
import { protect, requireRecruiter, requireCandidate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, requireRecruiter, createInterview);
router.get('/', protect, requireRecruiter, getInterviews);
router.get('/candidate/me', protect, requireCandidate, getCandidateInterviews);
router.get('/:id', protect, getInterviewById);

router.post('/:id/answers', protect, requireCandidate, submitAnswer);
router.patch('/:id/complete', protect, completeInterview);

export default router;
