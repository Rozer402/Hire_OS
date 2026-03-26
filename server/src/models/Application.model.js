import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { 
    type: String, 
    enum: ['applied', 'in-review', 'shortlisted', 'interviewing', 'offered', 'rejected'],
    default: 'applied'
  },
  resumeUrl: { type: String },
  coverLetter: { type: String },
  aiScore: { type: Number, min: 0, max: 100 },
  aiReasoning: { type: String },
  aiStrengths: [{ type: String }],
  aiWeaknesses: [{ type: String }],
  parsedResume: {
    skills: [{ type: String }],
    experienceYears: { type: Number },
    education: [{ degree: String, institution: String, year: String }],
    summary: { type: String }
  },
  statusHistory: [{
    status: { type: String },
    changedAt: { type: Date, default: Date.now },
    note: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
