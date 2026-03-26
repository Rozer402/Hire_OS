import express from 'express';
import { applyToJob, getApplications, getApplicationById, updateStatus, getCandidateApplications } from '../controllers/application.controller.js';
import { protect, requireRecruiter, requireCandidate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

// Candidate Routes
router.post('/', protect, requireCandidate, upload.single('resume'), applyToJob);
router.get('/candidate/me', protect, requireCandidate, getCandidateApplications);

// Recruiter Routes
router.get('/', protect, requireRecruiter, getApplications);
router.patch('/:id/status', protect, requireRecruiter, updateStatus);

// Shared Routes
router.get('/:id', protect, getApplicationById);

export default router;
