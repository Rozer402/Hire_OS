import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  type: { type: String, enum: ['full-time', 'part-time', 'remote', 'contract'], required: true },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  skills: [{ type: String }],
  experienceLevel: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  applicantCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
