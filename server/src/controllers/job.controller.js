import Job from '../models/Job.model.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import mongoose from 'mongoose';

export const createJob = async (req, res) => {
  try {
    const jobData = { ...req.body, postedBy: req.user._id };
    const job = await Job.create(jobData);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    console.error('CreateJob Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create job' });
  }
};

export const getJobs = async (req, res) => {
  try {
    const { search, location, type, page = 1, limit = 10 } = req.query;

    // Optional auth: endpoint is used publicly, so we only filter by recruiter
    // jobs when a valid JWT is present.
    if (req.headers.authorization?.startsWith('Bearer ')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch {
        // If token is invalid/expired, fall back to public behavior.
        req.user = undefined;
      }
    }

    console.log('USER:', req.user); // temporary debug

    const query = { status: 'active' };
    if (req.user?.role === 'recruiter') {
      query.postedBy = req.user._id;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Use the requested logic for candidate/recruiter without restrictive filters
    const jobs = await Job.find(query)
      .populate('postedBy', 'name company companySize avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    console.log('JOBS:', jobs.length, 'found'); // temporary debug

    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('GetJobs Error:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to fetch jobs' });
  }
};

export const getJobById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'name company companySize avatar');
      
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    
    res.json({ success: true, data: job });
  } catch (error) {
    console.error('GetJobById Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch job' });
  }
};

export const updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updatedJob });
  } catch (error) {
    console.error('UpdateJob Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update job' });
  }
};

export const deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid Job ID format' });
    }

    const job = await Job.findById(req.params.id);
    
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    job.status = 'closed';
    await job.save();
    
    res.json({ success: true, message: 'Job closed successfully' });
  } catch (error) {
    console.error('DeleteJob Error:', error);
    res.status(500).json({ success: false, message: 'Failed to close job' });
  }
};

export const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('GetRecruiterJobs Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch recruiter jobs' });
  }
};
