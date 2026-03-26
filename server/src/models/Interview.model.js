import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  type: { type: String, enum: ['async', 'live', 'video', 'phone', 'in-person'], default: 'async' },
  questions: [{
    question: { type: String, required: true },
    category: { type: String, enum: ['technical', 'behavioral', 'situational'] },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] }
  }],
  answers: [{
    questionIndex: { type: Number },
    answer: { type: String }
  }],
  scheduledAt: { type: Date },
  completedAt: { type: Date },
  status: { type: String, enum: ['pending', 'completed', 'no-show'], default: 'pending' },
  aiScore: { type: Number, min: 0, max: 100 },
  aiFeedback: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
