import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import Notification from '../models/Notification.model.js';
import { parseResumeWithAI, scoreCandidateWithAI } from '../services/ai.service.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const applyToJob = async (req, res) => {
  try {
    const { jobId, resumeUrl: bodyResumeUrl, coverLetter } = req.body;
    let resumeUrl = bodyResumeUrl;
    if (req.file?.path) {
      resumeUrl = req.file.path;
    }
    if (!resumeUrl) {
      return res.status(400).json({ success: false, message: 'Resume PDF is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    // Check if already applied
    const existing = await Application.findOne({ job: jobId, candidate: req.user._id });
    if (existing) return res.status(400).json({ success: false, message: 'Already applied' });

    // Create application
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      recruiter: job.postedBy,
      resumeUrl,
      coverLetter,
      statusHistory: [{ status: 'applied', note: 'Initial application' }]
    });

    job.applicantCount += 1;
    await job.save();

    // Notify Recruiter natively safely
    await Notification.create({
      recipient: job.postedBy,
      type: 'new_application',
      message: `A new candidate applied for the ${job.title} role.`,
      link: `/recruiter/applications/${application._id}`
    });

    // AI Processing
    try {
      if (resumeUrl) {
         let dataBuffer;
         if (resumeUrl.startsWith('http')) {
           const response = await fetch(resumeUrl);
           const arrayBuffer = await response.arrayBuffer();
           dataBuffer = Buffer.from(arrayBuffer);
         } else {
           const rel = resumeUrl.replace(/^\//, '');
           const filePath = path.join(__dirname, '../../', rel);
           if (fs.existsSync(filePath)) {
             dataBuffer = fs.readFileSync(filePath);
           }
         }

         if (dataBuffer) {
           const data = await pdfParse(dataBuffer);
           
           // Parse Resume
           const parsedResume = await parseResumeWithAI(data.text);
           application.parsedResume = parsedResume;
           
           // Score Candidate Deterministically
           const aiResult = await scoreCandidateWithAI(job.description, parsedResume, job.title, job.skills);
           application.aiScore = aiResult.score;
           application.aiReasoning = aiResult.reasoning;
           application.aiStrengths = aiResult.strengths;
           application.aiWeaknesses = aiResult.weaknesses;

           await application.save();
         }
      }
    } catch (aiError) {
      console.error('AI Processing Error during applyToJob:', aiError);
      // We don't fail the whole request, application is still created
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error('ApplyToJob Error:', error);
    res.status(500).json({ success: false, message: 'Failed to apply' });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ recruiter: req.user._id })
      .populate('candidate', 'name email avatar skills experienceYears')
      .populate('job', 'title department location')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('GetApplications Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch applications' });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('candidate', '-password')
      .populate('job')
      .populate('recruiter', 'name company');
      
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    
    // Auth check
    if (application.recruiter._id.toString() !== req.user._id.toString() && application.candidate._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('GetApplicationById Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch application' });
  }
};

const APPLICATION_STATUSES = ['applied', 'in-review', 'shortlisted', 'interviewing', 'offered', 'rejected'];

export const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }
    const application = await Application.findById(req.params.id);
    
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    if (application.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    application.statusHistory.push({ status, note });
    await application.save();

    // Alert candidate gracefully
    await Notification.create({
      recipient: application.candidate,
      type: 'application_update',
      message: `Your application for ${application.job?.title || 'a recent role'} was moved to ${status.replace(/-/g, ' ')}.`,
      link: '/candidate/applications'
    });

    res.json({ success: true, data: application });
  } catch (error) {
    console.error('UpdateStatus Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
};

export const getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        select: 'title department location type postedBy',
        populate: { path: 'postedBy', select: 'company name' }
      })
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('GetCandidateApplications Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate applications' });
  }
};
