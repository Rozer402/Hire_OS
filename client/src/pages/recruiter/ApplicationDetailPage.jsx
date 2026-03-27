import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, Phone, ExternalLink, Download, MessageSquare, 
  Calendar, CheckCircle2, XCircle, Clock, ArrowLeft, Loader2, Sparkles 
} from 'lucide-react';
import { applicationService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { toast } from '../../components/ui/Toast';
import MessagePanel from '../../components/MessagePanel';

export function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const res = await applicationService.getApplicationById(id);
        if (res.success) {
          setApplication(res.data);
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load application');
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const res = await applicationService.updateStatus(id, { status: newStatus });
      if (res.success) {
        setApplication(prev => ({ ...prev, status: newStatus }));
        toast.success(`Application moved to ${newStatus}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  if (!application) return (
    <div className="p-8 text-center bg-white border border-slate-200 rounded-xl max-w-2xl mx-auto mt-20 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Application Not Found</h2>
      <p className="text-slate-500 mb-6">The application you are looking for does not exist or has been removed.</p>
      <Button onClick={() => navigate('/recruiter/applications')} variant="outline">Back to Applications</Button>
    </div>
  );

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'offered': return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">{status}</Badge>;
      case 'interviewing': return <Badge className="bg-violet-50 text-violet-700 border border-violet-100">{status}</Badge>;
      case 'in-review': return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100">{status}</Badge>;
      case 'shortlisted': return <Badge className="bg-amber-50 text-amber-600 border border-amber-100">{status}</Badge>;
      case 'rejected': return <Badge className="bg-red-50 text-red-600 border border-red-100">{status}</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-600 border border-slate-200">{status || 'Applied'}</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-[1400px] mx-auto min-h-screen">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4 group cursor-pointer border-none bg-transparent">
          <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" /> Back to List
        </button>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={application.candidate?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(application.candidate?.name || 'User')}`} 
              className="w-16 h-16 rounded-2xl border border-slate-200 shadow-sm"
              alt="Avatar"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{application.candidate?.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-slate-500 font-medium text-sm">Applied for <span className="text-slate-900 font-bold">{application.job?.title}</span></p>
                <span className="text-slate-300">•</span>
                <p className="text-slate-400 text-sm">{new Date(application.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-slate-200 text-slate-600 font-semibold gap-2 hover:bg-slate-50 h-10" onClick={() => setShowMessages(true)}>
              <MessageSquare className="w-4 h-4" /> Message
            </Button>
            <div className="h-10 w-px bg-slate-200 mx-1 hidden md:block"></div>
            {getStatusBadge(application.status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-slate-900 font-semibold text-base mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Mail className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-slate-900">{application.candidate?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                <Phone className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-semibold text-slate-900">{application.candidate?.phone || 'Not provided'}</p>
                </div>
              </div>
              {application.candidate?.linkedIn && (
                <a href={application.candidate.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group">
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LinkedIn</p>
                    <p className="text-sm font-semibold text-slate-900">View Profile</p>
                  </div>
                </a>
              )}
              {application.resumeUrl && (
                <a 
                  href={(import.meta.env.VITE_API_URL || '').replace('/api', '') + (application.resumeUrl.startsWith('/') ? application.resumeUrl : '/' + application.resumeUrl)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors group"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <div>
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Resume</p>
                    <p className="text-sm font-bold text-indigo-700">Download CV</p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-slate-900 font-semibold text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI Score & Reasoning
            </h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-4">
               <p className="text-sm text-slate-700 leading-relaxed font-medium capitalize">
                 "{application.aiReasoning || "AI assessment pending for this candidate."}"
               </p>
            </div>
            <div className="flex flex-wrap gap-2">
               {(application.candidate?.skills || []).map(skill => (
                 <span key={skill} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">{skill}</span>
               ))}
            </div>
          </div>

          {/* Job Overview */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-slate-900 font-semibold text-base mb-4">Role Overview</h2>
            <div className="space-y-4">
               <div>
                 <h3 className="text-sm font-bold text-slate-900">{application.job?.title}</h3>
                 <p className="text-sm text-slate-500 mt-1 line-clamp-3">{application.job?.description}</p>
               </div>
               <div className="flex flex-wrap gap-8 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                    <p className="text-sm font-semibold text-slate-900">{application.job?.department}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-slate-900">{application.job?.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salary Range</p>
                    <p className="text-sm font-semibold text-slate-900">${application.job?.salaryMin}k - ${application.job?.salaryMax}k</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Panel */}
        <div className="col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
               <div className="text-center pb-6 border-b border-slate-100 mb-6">
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">AI Match Score</p>
                 <div className="text-5xl font-extrabold text-indigo-600">{application.aiScore || 0}%</div>
                 <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${application.aiScore || 0}%` }}></div>
                 </div>
               </div>

               <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Pipeline Actions</h3>
                  <Button 
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                    onClick={() => handleStatusUpdate('interviewing')}
                  >
                    Set Interview
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full h-11 border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                    onClick={() => handleStatusUpdate('shortlisted')}
                  >
                    Shortlist
                  </Button>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button 
                      className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
                      onClick={() => handleStatusUpdate('offered')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept
                    </Button>
                    <Button 
                      className="h-10 bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 font-bold"
                      onClick={() => handleStatusUpdate('rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" /> Reject
                    </Button>
                  </div>
               </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
               <h4 className="text-amber-800 text-sm font-bold flex items-center gap-2 mb-2">
                 <Clock className="w-4 h-4" /> Next Steps
               </h4>
               <p className="text-amber-700 text-xs font-medium leading-relaxed">
                 Coordinate with the department head before moving the candidate to the "Offered" stage.
               </p>
            </div>
          </div>
        </div>
      </div>

      {showMessages && application.candidate && (
        <MessagePanel
          recipientId={application.candidate?._id}
          recipientName={application.candidate?.name}
          onClose={() => setShowMessages(false)}
        />
      )}
    </div>
  );
}

export default ApplicationDetailPage;
