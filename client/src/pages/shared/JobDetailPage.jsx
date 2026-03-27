import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Clock, DollarSign, Briefcase, Brain, Upload, CheckCircle2, Building2 } from 'lucide-react';
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
    if (!resume) return toast.error('Please upload your resume (PDF).', { id: 'resume-error' });
    if (hasApplied) return toast.error('You have already applied to this job.', { id: 'applied-error' });
    
    setApplying(true);
    const toastId = toast.loading('Uploading resume and evaluating fit...');
    try {
      const appFd = new FormData();
      appFd.append('resume', resume);
      appFd.append('jobId', id);
      appFd.append('coverLetter', coverLetter || '');

      const appRes = await applicationService.createApplication(appFd);
      const score = appRes?.data?.aiScore;
      toast.success(
        score != null
          ? `Application submitted! Match score: ${score}%`
          : 'Application submitted successfully.',
        { id: toastId, duration: 5000 }
      );
      navigate('/candidate/applications');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to apply.', { id: toastId });
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <div className="text-center text-slate-500 py-20 font-medium">Loading job details...</div>;
  if (isError || !job) return <div className="text-center text-slate-500 py-20 font-medium">Job not found or has been removed.</div>;

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Column: Job Content (65% ~ 8/12) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Job Header Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-xl border border-slate-200 flex items-center justify-center bg-white shadow-sm">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-1">{job.title}</h1>
              <p className="text-lg font-semibold text-slate-500">{job.company || job.postedBy?.company || 'Confidential Company'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            {job.location && (
              <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <MapPin className="w-4 h-4 text-slate-500" /> {job.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold capitalize">
              <Briefcase className="w-4 h-4 text-slate-500" /> {job.type}
            </span>
            {(job.salaryMin != null || job.salary?.min != null) && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                {job.salaryMin != null
                  ? `$${job.salaryMin}k — $${job.salaryMax}k`
                  : `$${job.salary.min / 1000}k — $${job.salary.max / 1000}k`}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-semibold">
              <Clock className="w-4 h-4 text-slate-500" />
              Posted {formatDistanceToNow(new Date(job.createdAt), {addSuffix:true})}
            </span>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-8">
          
          <div className="space-y-3">
             <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">About the Role</h2>
             <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600 space-y-3 text-[15px] whitespace-pre-line">
               {job.description}
             </div>
          </div>

          {job.skills?.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Requirements & Skills</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-4 marker:text-slate-400">
                {job.skills.map(s => (
                  <li key={s} className="pl-1">{s}</li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {job.skills.map(s => (
                  <span key={s} className="bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-semibold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
             <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Nice to Have</h2>
             <p className="text-slate-600 text-[15px] leading-relaxed">
               Experience with agile methodologies, cross-functional collaboration, and a track record of delivering high-quality solutions in fast-paced environments.
             </p>
          </div>

        </div>

      </div>

      {/* Right Column: Sticky Apply Panel (35% ~ 4/12) */}
      <div className="lg:col-span-4">
        <div className="sticky top-6 space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center">
            {isCandidate() ? (
              <div className="w-full">
                {hasApplied ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl text-center flex flex-col items-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-emerald-900 font-bold text-lg mb-1">Application Sent</h3>
                    <p className="text-sm text-emerald-700 font-medium mb-4">Your profile is currently under review by the hiring team.</p>
                    <button 
                      onClick={() => navigate('/candidate/applications')} 
                      className="w-full bg-white border border-emerald-200 text-emerald-700 font-semibold py-2.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer shadow-sm"
                    >
                      Track Status
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 border-b border-slate-100 pb-4">Submit Application</h3>
                    
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Resume (PDF) <span className="text-red-500">*</span></label>
                      <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${resume ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30'}`}>
                        <Upload className={`w-6 h-6 mb-2 ${resume ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium text-slate-600 text-center px-2">
                          {resume ? resume.name : 'Click to select or drag & drop'}
                        </span>
                        <input type="file" accept=".pdf" className="sr-only" onChange={e => setResume(e.target.files[0])} disabled={applying} />
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Cover Letter <span className="text-slate-400 font-normal">(Optional)</span></label>
                      <textarea 
                        value={coverLetter} 
                        onChange={e => setCoverLetter(e.target.value)} 
                        rows={3} 
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-all shadow-sm" 
                        placeholder="Highlight your most relevant experience..." 
                        disabled={applying} 
                      />
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3">
                      <Brain className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <p className="text-xs text-indigo-900 font-medium leading-relaxed">
                        Our smart system evaluates your resume keywords to provide immediate hiring match feedback.
                      </p>
                    </div>

                    <button 
                      onClick={handleApply} 
                      disabled={applying || !resume} 
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-sm cursor-pointer ${applying || !resume ? 'bg-indigo-400 cursor-not-allowed hidden' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}`}
                    >
                      Apply Now
                    </button>
                    {(applying || !resume) && (
                      <button 
                        disabled={true} 
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all shadow-sm ${applying ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 opacity-50 cursor-not-allowed'}`}
                      >
                        {applying ? 'Evaluating application...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-100">
                  <Briefcase className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg">Interested in this role?</h3>
                <p className="text-slate-500 text-sm font-medium">Log in as a candidate to submit your application directly to the recruiter.</p>
                <button 
                  type="button" 
                  onClick={() => navigate('/login')} 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-sm cursor-pointer mt-2"
                >
                  Sign in to Apply
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">At a Glance</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">Total Applicants</span>
                <span className="text-slate-900 font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">{job.applicantCount || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">Work Setting</span>
                <span className="text-slate-900 font-bold capitalize">{job.type || 'Standard'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">Department</span>
                <span className="text-slate-900 font-bold capitalize">{job.department || 'General'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
