import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob, getRecruiterJobs } from '../controllers/job.controller.js';
import { protect, requireRecruiter } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter/mine', protect, requireRecruiter, getRecruiterJobs);
router.get('/:id', getJobById);

router.post('/', protect, requireRecruiter, createJob);
router.put('/:id', protect, requireRecruiter, updateJob);
router.delete('/:id', protect, requireRecruiter, deleteJob);

export default router;
