import express from 'express';
import { getDashboardStats, getApplicationsOverTime, getHiringFunnel, getTopCandidates } from '../controllers/analytics.controller.js';
import { protect, requireRecruiter } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRecruiter);

router.get('/dashboard', getDashboardStats);
router.get('/applications-over-time', getApplicationsOverTime);
router.get('/hiring-funnel', getHiringFunnel);
router.get('/top-candidates', getTopCandidates);

export default router;
