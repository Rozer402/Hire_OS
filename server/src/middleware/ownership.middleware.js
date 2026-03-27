import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';

export const isJobOwner = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Check if the user ID explicitly securely perfectly matches the recruiter tied to the specific job schema.
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this job' });
    }
    
    // Alternatively pass the pre-fetched Job object through req.job skipping subsequent queries natively!
    req.job = job;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid job ID' });
    }
    console.error('Ownership Middleware Error:', error);
    res.status(500).json({ success: false, message: 'Server error checking ownership parameters' });
  }
};

export const isApplicationOwner = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    // Explicit candidate restrictions mapped over local schema targets!
    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this application' });
    }
    
    req.application = application;
    next();
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid application ID' });
    }
    console.error('Ownership Middleware Error:', error);
    res.status(500).json({ success: false, message: 'Server error checking ownership parameters' });
  }
};
