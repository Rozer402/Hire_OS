import express from 'express';
import { parseResume, scoreCandidate, generateQuestions, detectBias } from '../controllers/ai.controller.js';
import { protect, requireRecruiter } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRecruiter);

router.post('/parse-resume', parseResume);
router.post('/score', scoreCandidate);
router.post('/generate-questions', generateQuestions);
router.post('/detect-bias', detectBias);

export default router;
