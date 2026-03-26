import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['recruiter', 'candidate'], required: true },
  // Recruiter fields
  company: { type: String },
  companySize: { type: String },
  // Candidate fields
  resumeUrl: { type: String },
  skills: [{ type: String }],
  experienceYears: { type: Number },
  bio: { type: String },
  phone: { type: String },
  linkedIn: { type: String },
  github: { type: String },
  // Shared
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  // Password Reset
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

const User = mongoose.model('User', userSchema);
export default User;
