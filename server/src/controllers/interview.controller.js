import Interview from '../models/Interview.model.js';
import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import Notification from '../models/Notification.model.js';
import { generateInterviewQuestionsWithAI } from '../services/ai.service.js';

export const createInterview = async (req, res) => {
  try {
    const { applicationId, type, scheduledAt } = req.body;
    
    const application = await Application.findById(applicationId).populate('candidate').populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
    
    // Auto generate questions if AI service is present
    let questions = [];
    try {
      questions = await generateInterviewQuestionsWithAI(
        application.job.title, 
        application.job.description, 
        application.parsedResume || application.candidate
      );
    } catch (aiError) {
      console.warn('Failed to auto-generate questions, creating empty interview', aiError);
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      questions = [
        { question: 'Tell us about yourself and what drew you to this role.', category: 'behavioral', difficulty: 'easy' },
        { question: 'Describe a challenging project you owned end-to-end.', category: 'behavioral', difficulty: 'medium' },
        { question: 'How do you approach debugging a production issue under time pressure?', category: 'technical', difficulty: 'medium' }
      ];
    }

    const interview = await Interview.create({
      application: applicationId,
      candidate: application.candidate._id,
      recruiter: req.user._id,
      job: application.job._id,
      type: type || 'async',
      scheduledAt,
      questions
    });

    // Notify Candidate explicitly
    await Notification.create({
      recipient: application.candidate._id,
      type: 'interview_scheduled',
      message: `An interview for ${application.job.title} has been scheduled.`,
      link: `/candidate/interviews`
    });

    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    console.error('CreateInterview Error:', error);
    res.status(500).json({ success: false, message: 'Failed to create interview' });
  }
};

export const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ recruiter: req.user._id })
      .populate('candidate', 'name avatar email')
      .populate('job', 'title')
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: interviews });
  } catch (error) {
    console.error('GetInterviews Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interviews' });
  }
};

export const getCandidateInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        select: 'title location postedBy',
        populate: { path: 'postedBy', select: 'company name' }
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: interviews });
  } catch (error) {
    console.error('GetCandidateInterviews Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch candidate interviews' });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('candidate', '-password')
      .populate('job')
      .populate('application');
      
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    const uid = req.user._id.toString();
    const isRecruiter = req.user.role === 'recruiter' && interview.recruiter.toString() === uid;
    const isCandidate = req.user.role === 'candidate' && interview.candidate._id.toString() === uid;
    if (!isRecruiter && !isCandidate) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this interview' });
    }
    
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('GetInterviewById Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch interview' });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { questionIndex, answer } = req.body;
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    if (interview.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    interview.answers.push({ questionIndex, answer });
    await interview.save();
    
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('SubmitAnswer Error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit answer' });
  }
};

export const completeInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });

    const uid = req.user._id.toString();
    const allowed =
      interview.candidate.toString() === uid ||
      interview.recruiter.toString() === uid;
    if (!allowed) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    interview.completedAt = new Date();
    interview.status = 'completed';
    await interview.save();
    
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('CompleteInterview Error:', error);
    res.status(500).json({ success: false, message: 'Failed to complete interview' });
  }
};
