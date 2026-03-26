import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { applicationService } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Loader2, User, Briefcase, Calendar, Star, CheckCircle, Brain, XCircle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await applicationService.getApplicationById(id);
      setApp(res?.success ? res.data : null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to fetch application');
      toast.error('Failed to fetch application');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      setUpdating(true);
      await applicationService.updateStatus(id, { status: newStatus, note: 'Updated from application detail' });
      toast.success('Application status updated');
      await fetchApplication();
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-4">{error || 'Application not found'}</h2>
        <Button onClick={() => navigate(-1)} variant="secondary">Go Back</Button>
      </div>
    );
  }

  const { candidate, job, status, resumeUrl, aiScore, aiReasoning, parsedResume, aiInterviewQuestions, createdAt, appliedDate } = app;
  const fileBase = (api.defaults.baseURL || '').replace(/\/api\/?$/, '');
  const resumeHref = resumeUrl ? (resumeUrl.startsWith('http') ? resumeUrl : `${fileBase}${resumeUrl}`) : null;
  const aiSummary = aiReasoning || parsedResume?.summary;
  const candidateName = candidate?.name || 'Unknown Candidate';
  const jobTitle = job?.title || 'Unknown Job';
  const score = aiScore || 0;
  
  const timelineStatuses = ['Applied', 'In review', 'Interview', 'Offer'];
  const s = (status || 'applied').toLowerCase();
  let currentIdx = 0;
  if (s === 'applied') currentIdx = 0;
  else if (s === 'in-review' || s === 'shortlisted') currentIdx = 1;
  else if (s === 'interviewing') currentIdx = 2;
  else if (s === 'offered') currentIdx = 3;
  else if (s === 'rejected') currentIdx = -1;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center text-[#a1a1aa] hover:text-[#fafafa] transition-colors font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#18181b] border border-[#27272a] p-6 rounded-2xl shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#27272a] flex items-center justify-center border border-[#3f3f46]">
            <User className="w-8 h-8 text-[#a1a1aa]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#fafafa]">{candidateName}</h1>
            <p className="text-[#a1a1aa] font-medium mt-1 mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> {jobTitle}
            </p>
            <Badge variant="purple">{status || 'Applied'}</Badge>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => handleUpdateStatus('rejected')} disabled={updating} variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 font-bold">
            <XCircle className="w-4 h-4 mr-2" /> Reject
          </Button>
          <Button onClick={() => handleUpdateStatus('interviewing')} disabled={updating} className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold">
            <CheckCircle className="w-4 h-4 mr-2" /> Move to Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="border-[#27272a] bg-[#18181b] shadow-xl">
            <CardHeader className="border-b border-[#27272a] pb-4">
              <CardTitle className="text-[#fafafa] flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#6366f1]" /> AI Candidate Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6 mb-6">
                 <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-[#6366f1] bg-[#6366f1]/10">
                   <span className="text-2xl font-bold text-[#fafafa]">{score}</span>
                   <span className="text-xs text-[#a1a1aa] font-semibold">/ 100</span>
                 </div>
                 <div>
                   <h3 className="font-bold text-[#fafafa] text-lg mb-1">Resume Match Score</h3>
                   <p className="text-[#a1a1aa] text-sm leading-relaxed">AI has evaluated this candidate's resume against the requirements for the {jobTitle} role.</p>
                 </div>
              </div>
              
              <div className="bg-[#27272a]/50 p-4 rounded-xl border border-[#3f3f46]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#a1a1aa] mb-2">Parsed Resume Summary</h4>
                <p className="text-sm text-[#fafafa] leading-relaxed whitespace-pre-wrap">{aiSummary || 'No summary available.'}</p>
              </div>
            </CardContent>
          </Card>

          {aiInterviewQuestions && aiInterviewQuestions.length > 0 && (
            <Card className="border-[#27272a] bg-[#18181b] shadow-xl">
              <CardHeader className="border-b border-[#27272a] pb-4">
                <CardTitle className="text-[#fafafa] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#f59e0b]" /> Suggested Interview Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {aiInterviewQuestions.map((q, i) => (
                  <div key={i} className="bg-[#27272a]/30 p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-medium text-[#fafafa]"><span className="text-[#6366f1] font-bold mr-2">Q{i+1}.</span>{typeof q === 'string' ? q : q.question || JSON.stringify(q)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border-[#27272a] bg-[#18181b] shadow-xl">
            <CardHeader className="border-b border-[#27272a] pb-4">
              <CardTitle className="text-[#fafafa] text-base">Application Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6 relative ml-3 border-l border-[#3f3f46]">
                {timelineStatuses.map((s, i) => {
                  const isActive = currentIdx === i;
                  const isPast = currentIdx > i;
                  const isRejected = status?.toLowerCase() === 'rejected';

                  let circleColor = 'bg-[#27272a] border-[#3f3f46]';
                  let textColor = 'text-[#a1a1aa]';
                  
                  if (isActive && !isRejected) {
                    circleColor = 'bg-[#6366f1] border-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)]';
                    textColor = 'text-[#fafafa] font-bold';
                  } else if (isPast && !isRejected) {
                    circleColor = 'bg-[#10b981] border-[#10b981]';
                    textColor = 'text-[#fafafa]';
                  } else if (isRejected && s === 'Applied') {
                    textColor = 'text-[#a1a1aa] line-through';
                  }

                  return (
                    <div key={s} className="relative flex items-center gap-4 -ml-[17px]">
                       <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 z-10 ${circleColor}`}>
                          {isPast && !isRejected ? <CheckCircle className="w-4 h-4 text-white" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                       </div>
                       <div className={`text-sm ${textColor}`}>{s}</div>
                    </div>
                  );
                })}
                {status?.toLowerCase() === 'rejected' && (
                  <div className="relative flex items-center gap-4 -ml-[17px] mt-6">
                     <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 shrink-0 z-10 bg-red-500 border-red-500">
                        <XCircle className="w-4 h-4 text-white" />
                     </div>
                     <div className="text-sm font-bold text-red-500">Rejected</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-[#27272a] bg-[#18181b] shadow-xl">
            <CardHeader className="border-b border-[#27272a] pb-4">
              <CardTitle className="text-[#fafafa] text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1">Applied Date</span>
                <span className="text-sm text-[#fafafa] font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-[#a1a1aa]" /> {appliedDate || createdAt ? new Date(appliedDate || createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
              {resumeHref && (
                <div>
                  <span className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider block mb-1">Resume</span>
                  <a href={resumeHref} target="_blank" rel="noreferrer" className="text-sm text-[#6366f1] hover:text-[#818cf8] font-medium underline">View PDF Document</a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetailPage;
