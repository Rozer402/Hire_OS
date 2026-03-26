import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, DollarSign, Briefcase, Brain, AlertTriangle, Upload, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { jobService, applicationService } from '../../services/api';
import { useAuthStore } from '../../hooks/useAuthStore';
import { formatDistanceToNow } from 'date-fns';

export function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuthStore();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  const { data: job, isLoading, isError, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id),
    select: r => r.data || r
  });

  const { data: myApps } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationService.getMyApplications(),
    enabled: !!(isAuthenticated && isCandidate()),
    select: r => r.data || r
  });

  const hasApplied = useMemo(() => {
    if (!myApps) return false;
    return myApps.some(app => app.job?._id === id || app.job === id);
  }, [myApps, id]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.response?.data?.message || 'Failed to load job', { id: 'job-error' });
    }
  }, [isError, error]);

  const handleApply = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isCandidate()) {
      toast.error('Only candidate accounts can apply to jobs', { id: 'role-error' });
      return navigate('/login');
    }
    if (!resume) return toast.error('Please upload your resume', { id: 'resume-error' });
    if (hasApplied) return toast.error('You have already applied to this job', { id: 'applied-error' });
    
    setApplying(true);
    const toastId = toast.loading('Uploading & Parsing Resume with AI...');
    try {
      const appFd = new FormData();
      appFd.append('resume', resume);
      appFd.append('jobId', id);
      appFd.append('coverLetter', coverLetter || '');

      const appRes = await applicationService.createApplication(appFd);
      const score = appRes?.data?.aiScore;
      toast.success(
        score != null
          ? `Application submitted! AI match score: ${score}/100`
          : 'Application submitted successfully.',
        { id: toastId, duration: 5000 }
      );
      navigate('/candidate/applications');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to apply', { id: toastId });
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <div className="text-center text-gray-400 py-20">Loading...</div>;
  if (isError || !job) return <div className="text-center text-gray-400 py-20">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
      {/* Main */}
      <div className="md:col-span-2 space-y-6">
        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-1">{job.title}</h1>
          <p className="text-primary-400">{job.company || job.postedBy?.company || 'Company'}</p>
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-400">
            {job.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>}
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.type}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{formatDistanceToNow(new Date(job.createdAt), {addSuffix:true})}</span>
            {(job.salaryMin != null || job.salary?.min != null) && (
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salaryMin != null
                  ? `$${job.salaryMin}k — $${job.salaryMax}k`
                  : `$${job.salary.min / 1000}k — $${job.salary.max / 1000}k`}
              </span>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="font-semibold text-white mb-3">About the Role</h2>
          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{job.description}</p>
        </div>

        {job.skills?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-white mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map(s => <span key={s} className="badge-blue text-xs px-2 py-1">{s}</span>)}
            </div>
          </div>
        )}

        {job.aiAnalysis && (
          <div className="card border-accent-800/30 bg-accent-900/10">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-accent-300">AI Job Analysis</span>
              <span className="badge-blue">{job.aiAnalysis.seniorityLevel}</span>
            </div>
            {job.aiAnalysis.biasFlags?.length > 0 && (
              <div className="flex items-start gap-2 text-yellow-400 text-xs">
                <AlertTriangle className="w-3 h-3 mt-0.5" />
                <span>{job.aiAnalysis.biasFlags.length} bias flag(s) detected in this JD</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Sidebar */}
      <div className="space-y-4">
        {isCandidate() ? (
          <div className="card">
            <h3 className="font-semibold text-white mb-4">{hasApplied ? 'Application Status' : 'Apply Now'}</h3>
            
            {hasApplied ? (
              <div className="bg-primary-900/20 border border-primary-500/30 p-6 rounded-xl text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-primary-400" />
                </div>
                <h4 className="font-medium text-white">Already Applied</h4>
                <p className="text-sm text-gray-400">You have successfully submitted your application for this role. The recruiter will review your profile shortly.</p>
                <button type="button" onClick={() => navigate('/candidate/applications')} className="btn-secondary w-full mt-4 py-2 text-sm">View Application List</button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Resume (PDF) *</label>
                  <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-primary-600 transition-colors">
                    <Upload className="w-6 h-6 text-gray-500" />
                    <span className="text-xs text-gray-400">{resume ? resume.name : 'Click to upload PDF'}</span>
                    <input type="file" accept=".pdf" className="sr-only" onChange={e => setResume(e.target.files[0])} disabled={applying} />
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Cover Letter (optional)</label>
                  <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={4} className="input resize-none text-sm" placeholder="Why are you a great fit?" disabled={applying} />
                </div>
                <div className="bg-primary-900/30 border border-primary-800/50 rounded-lg p-3 text-xs text-primary-300 flex items-start gap-2">
                  <Brain className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  AI will parse your resume and score your fit instantly.
                </div>
                <button onClick={handleApply} disabled={applying} className="btn-primary w-full py-2.5">
                  {applying ? 'Uploading & Parsing...' : 'Submit Application'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center">
            <p className="text-gray-400 text-sm mb-4">Sign in as a candidate to apply</p>
            <button type="button" onClick={() => navigate('/login')} className="btn-primary w-full py-2.5 block text-center">Login to Apply</button>
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Applicants</span>
            <span className="text-white font-medium">{job.applicantCount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Type</span>
            <span className="text-white">{job.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
