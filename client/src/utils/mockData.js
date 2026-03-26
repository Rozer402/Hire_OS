import { addDays, subDays } from 'date-fns';

const today = new Date();

export const jobs = [
  { id: 'j1', title: 'Senior Frontend Engineer', company: 'TechCorp', salary: '$120k - $150k', location: 'Remote', type: 'Full-time', tags: ['React', 'TypeScript', 'Tailwind'], postedDate: subDays(today, 2).toISOString(), description: 'Lead our core UI development team.', biasScore: 95 },
  { id: 'j2', title: 'Machine Learning Architect', company: 'AI Innovators', salary: '$160k - $200k', location: 'San Francisco, CA', type: 'Full-time', tags: ['Python', 'TensorFlow', 'PyTorch'], postedDate: subDays(today, 5).toISOString(), description: 'Join our core AI team.', biasScore: 88 },
  { id: 'j3', title: 'Product Manager', company: 'Fintech Solutions', salary: '$130k - $160k', location: 'New York, NY', type: 'Full-time', tags: ['Agile', 'Fintech'], postedDate: subDays(today, 7).toISOString(), description: 'Lead the development of mobile app.', biasScore: 92 },
  { id: 'j4', title: 'Backend Developer (Go)', company: 'CloudScale', salary: '$110k - $140k', location: 'Remote', type: 'Full-time', tags: ['Go', 'Kubernetes'], postedDate: subDays(today, 10).toISOString(), description: 'Design microservices.', biasScore: 98 },
  { id: 'j5', title: 'UX Designer', company: 'Creative Agency', salary: '$90k - $120k', location: 'Austin, TX', type: 'Contract', tags: ['Figma', 'Prototyping'], postedDate: subDays(today, 12).toISOString(), description: 'Create intuitive user experiences.', biasScore: 85 }
];

export const candidates = [
  { id: 'c1', name: 'Alice Jenkins', email: 'alice@example.com', score: 95, skills: ['React', 'TypeScript', 'Node.js'], experience: '5 years', status: 'In Review', role: 'Frontend Engineer', location: 'San Francisco, CA', matchReason: 'Strong match on React and TS.', avatar: 'https://i.pravatar.cc/150?u=c1' },
  { id: 'c2', name: 'Bob Smith', email: 'bob@example.com', score: 88, skills: ['Python', 'Django', 'AWS'], experience: '8 years', status: 'Interviewing', role: 'Backend Engineer', location: 'Austin, TX', matchReason: 'Extensive AWS experience.', avatar: 'https://i.pravatar.cc/150?u=c2' },
  { id: 'c3', name: 'Charlie Davis', email: 'charlie@example.com', score: 92, skills: ['Java', 'Spring', 'Kafka'], experience: '6 years', status: 'Shortlisted', role: 'Software Engineer', location: 'New York, NY', matchReason: 'Perfect fit for distributed systems.', avatar: 'https://i.pravatar.cc/150?u=c3' },
  { id: 'c4', name: 'Diana Prince', email: 'diana@example.com', score: 58, skills: ['HTML', 'CSS', 'JavaScript'], experience: '2 years', status: 'Rejected', role: 'Junior Web Dev', location: 'Remote', matchReason: 'Lacks required framework experience.', avatar: 'https://i.pravatar.cc/150?u=c4' },
  { id: 'c5', name: 'Evan Wright', email: 'evan@example.com', score: 85, skills: ['Go', 'Docker', 'Kubernetes'], experience: '4 years', status: 'Offered', role: 'DevOps Engineer', location: 'Seattle, WA', matchReason: 'Solid cloud infrastructure knowledge.', avatar: 'https://i.pravatar.cc/150?u=c5' },
  { id: 'c6', name: 'Fiona Gallagher', email: 'fiona@example.com', score: 91, skills: ['Python', 'Pandas', 'SQL'], experience: '7 years', status: 'In Review', role: 'Data Scientist', location: 'Boston, MA', matchReason: 'Great analytical skills.', avatar: 'https://i.pravatar.cc/150?u=c6' },
  { id: 'c7', name: 'George Martin', email: 'george@example.com', score: 82, skills: ['C++', 'Unreal Engine'], experience: '10 years', status: 'Interviewing', role: 'Game Dev', location: 'Los Angeles, CA', matchReason: 'Veteran engine developer.', avatar: 'https://i.pravatar.cc/150?u=c7' },
  { id: 'c8', name: 'Hannah Abbott', email: 'hannah@example.com', score: 89, skills: ['Figma', 'Sketch', 'UI/UX'], experience: '3 years', status: 'Shortlisted', role: 'Product Designer', location: 'Remote', matchReason: 'Impressive portfolio.', avatar: 'https://i.pravatar.cc/150?u=c8' },
  { id: 'c9', name: 'Ian Malcolm', email: 'ian@example.com', score: 94, skills: ['Math', 'Algorithms', 'Research'], experience: '15 years', status: 'Offered', role: 'Research Scientist', location: 'Chicago, IL', matchReason: 'World-class researcher.', avatar: 'https://i.pravatar.cc/150?u=c9' },
  { id: 'c10', name: 'Jessica Jones', email: 'jessica@example.com', score: 65, skills: ['Sales', 'Communication'], experience: '5 years', status: 'Rejected', role: 'Sales Exec', location: 'New York, NY', matchReason: 'Poor technical fit.', avatar: 'https://i.pravatar.cc/150?u=c10' },
  { id: 'c11', name: 'Kevin Bacon', email: 'kevin@example.com', score: 86, skills: ['React Native', 'Mobile'], experience: '4 years', status: 'In Review', role: 'Mobile Dev', location: 'Austin, TX', matchReason: 'Good mobile cross-platform skills.', avatar: 'https://i.pravatar.cc/150?u=c11' },
  { id: 'c12', name: 'Laura Dern', email: 'laura@example.com', score: 90, skills: ['Product Management', 'Agile'], experience: '8 years', status: 'Interviewing', role: 'PM', location: 'San Francisco, CA', matchReason: 'Strong leader.', avatar: 'https://i.pravatar.cc/150?u=c12' },
  { id: 'c13', name: 'Mike Wheeler', email: 'mike@example.com', score: 81, skills: ['Node.js', 'Express', 'MongoDB'], experience: '2 years', status: 'Shortlisted', role: 'Backend Dev', location: 'Remote', matchReason: 'Solid MERN stack knowledge.', avatar: 'https://i.pravatar.cc/150?u=c13' },
  { id: 'c14', name: 'Nancy Drew', email: 'nancy@example.com', score: 93, skills: ['QA', 'Automation', 'Cypress'], experience: '6 years', status: 'Offered', role: 'QA Engineer', location: 'Seattle, WA', matchReason: 'Excellent attention to detail.', avatar: 'https://i.pravatar.cc/150?u=c14' }
];

export const applications = [
  { id: 'a1', candidate: candidates[0], job: jobs[0], status: 'Interviewing', appliedDate: subDays(today, 5).toISOString(), aiScore: candidates[0].score },
  { id: 'a2', candidate: candidates[1], job: jobs[3], status: 'Shortlisted', appliedDate: subDays(today, 6).toISOString(), aiScore: candidates[1].score },
  { id: 'a3', candidate: candidates[4], job: jobs[4], status: 'Offered', appliedDate: subDays(today, 15).toISOString(), aiScore: candidates[4].score },
  { id: 'a4', candidate: candidates[3], job: jobs[2], status: 'Rejected', appliedDate: subDays(today, 8).toISOString(), aiScore: candidates[3].score },
  { id: 'a5', candidate: candidates[7], job: jobs[4], status: 'In Review', appliedDate: subDays(today, 3).toISOString(), aiScore: candidates[7].score },
  { id: 'a6', candidate: candidates[5], job: jobs[1], status: 'Interviewing', appliedDate: subDays(today, 10).toISOString(), aiScore: candidates[5].score },
  { id: 'a7', candidate: candidates[11], job: jobs[2], status: 'Shortlisted', appliedDate: subDays(today, 4).toISOString(), aiScore: candidates[11].score },
  { id: 'a8', candidate: candidates[13], job: jobs[0], status: 'Offered', appliedDate: subDays(today, 1).toISOString(), aiScore: candidates[13].score },
  { id: 'a9', candidate: candidates[2], job: jobs[3], status: 'Shortlisted', appliedDate: subDays(today, 2).toISOString(), aiScore: candidates[2].score },
  { id: 'a10', candidate: candidates[6], job: jobs[1], status: 'Interviewing', appliedDate: subDays(today, 4).toISOString(), aiScore: candidates[6].score },
  { id: 'a11', candidate: candidates[9], job: jobs[2], status: 'Rejected', appliedDate: subDays(today, 7).toISOString(), aiScore: candidates[9].score },
  { id: 'a12', candidate: candidates[8], job: jobs[1], status: 'In Review', appliedDate: subDays(today, 1).toISOString(), aiScore: candidates[8].score }
];

export const interviews = [
  { id: 'i1', candidate: candidates[0], job: jobs[0], date: addDays(today, 1).toISOString(), type: 'Live Technical', status: 'Pending', aiQuestionsReady: true },
  { id: 'i2', candidate: candidates[1], job: jobs[3], date: addDays(today, 2).toISOString(), type: 'System Design', status: 'Pending', aiQuestionsReady: true },
  { id: 'i3', candidate: candidates[5], job: jobs[1], date: today.toISOString(), type: 'Async Behavioral', status: 'Completed', aiQuestionsReady: true },
  { id: 'i4', candidate: candidates[6], job: jobs[1], date: addDays(today, 3).toISOString(), type: 'Live Technical', status: 'Pending', aiQuestionsReady: false },
  { id: 'i5', candidate: candidates[11], job: jobs[2], date: subDays(today, 1).toISOString(), type: 'Product Interview', status: 'No-show', aiQuestionsReady: true },
  { id: 'i6', candidate: candidates[4], job: jobs[4], date: subDays(today, 2).toISOString(), type: 'Final Round', status: 'Completed', aiQuestionsReady: true },
  { id: 'i7', candidate: candidates[13], job: jobs[0], date: addDays(today, 4).toISOString(), type: 'Live Technical', status: 'Pending', aiQuestionsReady: true },
  { id: 'i8', candidate: candidates[8], job: jobs[1], date: addDays(today, 5).toISOString(), type: 'Async Case Study', status: 'Pending', aiQuestionsReady: true },
  { id: 'i9', candidate: candidates[2], job: jobs[3], date: subDays(today, 3).toISOString(), type: 'Initial Screen', status: 'Completed', aiQuestionsReady: true },
  { id: 'i10', candidate: candidates[7], job: jobs[4], date: subDays(today, 4).toISOString(), type: 'Portfolio Review', status: 'Completed', aiQuestionsReady: true }
];

export const recruiterAnalytics = {
  applicationsOverTime: [
    { name: 'Mon', applications: 12 }, { name: 'Tue', applications: 19 },
    { name: 'Wed', applications: 15 }, { name: 'Thu', applications: 22 },
    { name: 'Fri', applications: 28 }, { name: 'Sat', applications: 10 },
    { name: 'Sun', applications: 8 },
  ],
  pipelineFunnel: [
    { stage: 'Applied', count: 450 }, { stage: 'Screening', count: 120 },
    { stage: 'Interviewing', count: 45 }, { stage: 'Offered', count: 12 },
    { stage: 'Hired', count: 8 },
  ],
  topSources: [
    { name: 'LinkedIn', value: 45 }, { name: 'Direct', value: 25 },
    { name: 'Referral', value: 20 }, { name: 'Other', value: 10 }
  ]
};
