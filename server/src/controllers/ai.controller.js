import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import { fileURLToPath } from 'url';
import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import { 
  parseResumeWithAI, 
  scoreCandidateWithAI, 
  generateInterviewQuestionsWithAI, 
  detectBiasWithAI 
} from '../services/ai.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const parseResume = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    if (!resumeUrl) return res.status(400).json({ success: false, message: 'resumeUrl is required' });

    const filePath = path.join(__dirname, '../../', resumeUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    const parsedData = await parseResumeWithAI(data.text);
    
    res.json({ success: true, data: parsedData });
  } catch (error) {
    console.error('ParseResume Express Error:', error);
    res.status(500).json({ success: false, message: 'Failed to parse resume via AI' });
  }
};

export const scoreCandidate = async (req, res) => {
  try {
    const { applicationId } = req.body;
    
    const application = await Application.findById(applicationId).populate('job');
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    // Use parsedResume if it exists, otherwise pass candidate ID / object representation
    const profileData = application.parsedResume || { message: 'Candidate metadata pending' };
    
    const aiResult = await scoreCandidateWithAI(application.job.description, profileData);
    
    // Save to application
    application.aiScore = aiResult.score;
    application.aiReasoning = aiResult.reasoning;
    application.aiStrengths = aiResult.strengths;
    application.aiWeaknesses = aiResult.weaknesses;
    await application.save();

    res.json({ success: true, data: aiResult });
  } catch (error) {
    console.error('ScoreCandidate Express Error:', error);
    res.status(500).json({ success: false, message: 'Failed to score candidate via AI' });
  }
};

export const generateQuestions = async (req, res) => {
  try {
    const { jobId, candidateId } = req.body;
    
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    
    const application = await Application.findOne({ job: jobId, candidate: candidateId });
    const profile = application?.parsedResume || { id: candidateId };

    const questions = await generateInterviewQuestionsWithAI(job.title, job.description, profile);
    
    res.json({ success: true, data: questions });
  } catch (error) {
    console.error('GenerateQuestions Express Error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate questions via AI' });
  }
};

export const detectBias = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ success: false, message: 'jobDescription is required' });

    const biasResult = await detectBiasWithAI(jobDescription);
    
    res.json({ success: true, data: biasResult });
  } catch (error) {
    console.error('DetectBias Express Error:', error);
    res.status(500).json({ success: false, message: 'Failed to detect bias via AI' });
  }
};
