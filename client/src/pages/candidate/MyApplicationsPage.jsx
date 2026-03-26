import React, { useState } from 'react';
import MessagePanel from '../../components/MessagePanel';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Briefcase, Building, ChevronRight, CheckCircle2, CircleDashed, Clock, Video, MessageSquare } from 'lucide-react';
import { applicationService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function MyApplicationsPage() {
  const [myApps, setMyApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showMessages, setShowMessages] = useState(false);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(null);
  const [selectedRecruiterName, setSelectedRecruiterName] = useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await applicationService.getMyApplications();
        setMyApps(res.data || []);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const applicationStages = ['Applied', 'Screening', 'Interviewing', 'Offered'];

  const stageIndex = (status) => {
    const s = (status || 'applied').toLowerCase();
    if (s === 'rejected') return -1;
    if (s === 'applied') return 0;
    if (s === 'in-review' || s === 'shortlisted') return 1;
    if (s === 'interviewing') return 2;
    if (s === 'offered') return 3;
    return 0;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Applications</h1>
          <p className="text-gray-400 font-medium">Track the status of all your open job applications.</p>
        </div>
      </div>

      <div className="space-y-6">
        {myApps.map(app => {
          const currentStageIndex = stageIndex(app.status);
          
          return (
            <Card key={app._id || app.id || Math.random()} className="border-gray-800 shadow-xl overflow-hidden hover:border-gray-700/80 transition-all bg-gray-950 group">
              <CardContent className="p-0">
                <div className="p-6 sm:p-8 border-b border-gray-800 bg-gray-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group-hover:bg-gray-900/50 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 shadow-inner group-hover:border-primary-500/50 transition-colors">
                       <Building className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400 group-hover:text-primary-400 transition-colors" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors">{app?.job?.title || 'Unknown Role'}</h2>
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-400">
                        <span className="text-gray-300">{app?.job?.postedBy?.company || app?.job?.company || 'Unknown Company'}</span>
                        <span>{app?.job?.location || ''}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Applied {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                    <Badge variant={(app?.status || '').toLowerCase() === 'applied' ? 'blue' : ((app?.status || '').toLowerCase() === 'interviewing' ? 'purple' : 'green')} className="px-3 py-1.5 text-sm font-bold shadow-sm capitalize mb-auto">{app?.status?.replace(/-/g, ' ') || 'Pending'}</Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-700 bg-gray-800/80 text-gray-300 hover:text-white" onClick={() => {
                        setSelectedRecruiterId(app?.job?.postedBy?._id);
                        setSelectedRecruiterName(app?.job?.postedBy?.name || app?.job?.postedBy?.company || 'Recruiter');
                        setShowMessages(true);
                      }}>
                         <MessageSquare className="w-4 h-4" /> Message
                      </Button>
                      <Link to={`/jobs/${app?.job?._id || app?.jobId}`} className="hidden sm:block">
                         <Button variant="ghost" size="sm" className="gap-1 font-semibold text-gray-400 hover:text-white">View Job <ChevronRight className="w-4 h-4"/></Button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 bg-gray-950">
                  <div className="relative max-w-3xl mx-auto py-4">
                    <div className="absolute top-1/2 left-[10%] w-[80%] h-1 bg-gray-800 -translate-y-1/2 rounded-full overflow-hidden z-0">
                        <div className="h-full bg-primary-500 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: `${Math.max(0, (currentStageIndex / (applicationStages.length - 1)) * 100)}%` }}></div>
                    </div>
                    
                    <div className="relative z-10 flex justify-between">
                      {applicationStages.map((stage, idx) => {
                        const isRejected = (app?.status || '').toLowerCase() === 'rejected';
                        const isCompleted = !isRejected && idx <= currentStageIndex && currentStageIndex >= 0;
                        const isCurrent = !isRejected && idx === currentStageIndex;

                        let ringColor = isCompleted ? 'border-primary-500 bg-gray-950' : 'border-gray-800 bg-gray-900';
                        if (isRejected) ringColor = 'border-red-500 bg-gray-950';

                        let iconColor = isCompleted ? 'text-primary-500' : 'text-gray-600';
                        if (isRejected) iconColor = 'text-red-500';

                        return (
                          <div key={stage} className="flex flex-col items-center gap-3">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 flex items-center justify-center transition-colors shadow-sm bg-gray-950 ${ringColor} ${isCurrent && !isRejected ? 'shadow-[0_0_15px_rgba(14,165,233,0.4)]' : ''}`}>
                              {isCompleted && !isRejected ? (
                                <CheckCircle2 className={`w-4 h-4 sm:w-6 sm:h-6 ${iconColor}`} />
                              ) : (
                                <CircleDashed className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
                              )}
                            </div>
                            <span className={`text-[10px] sm:text-xs uppercase tracking-wider font-bold ${isCurrent ? (isRejected ? 'text-red-400' : 'text-white') : (isCompleted ? 'text-gray-400' : 'text-gray-600')}`}>
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {(app?.status || '').toLowerCase() === 'interviewing' && (
                    <div className="mt-8 p-5 bg-accent-950/20 border border-accent-900/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 animate-in fade-in slide-in-from-bottom-2">
                       <div>
                           <h4 className="font-bold text-accent-100 mb-1 flex items-center gap-2"><Video className="w-4 h-4 text-accent-500"/> Action Required: Async Interview</h4>
                           <p className="text-sm text-accent-300/70 font-medium">You have been invited to complete a technical video interview.</p>
                       </div>
                       <Link to={`/candidate/interviews`} className="w-full sm:w-auto">
                         <Button className="bg-accent-600 hover:bg-accent-500 text-white w-full sm:w-auto shadow-lg shadow-accent-900/30 font-bold px-8 h-11 border border-accent-500">Start Interview</Button>
                       </Link>
                    </div>
                  )}
                  {(app?.status || '').toLowerCase() === 'offered' && (
                     <div className="mt-8 p-5 bg-green-950/20 border border-green-900/50 rounded-2xl flex items-center justify-between animate-in fade-in">
                        <div>
                            <h4 className="font-bold text-green-100 mb-1">Congratulations! 🎉</h4>
                            <p className="text-sm text-green-300/70 font-medium">You have received an offer for this position. Check your email for details.</p>
                        </div>
                     </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {myApps.length === 0 && (
          <div className="text-center py-24 bg-gray-900/50 rounded-3xl border border-gray-800 border-dashed backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Briefcase className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No applications yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">You haven't applied to any jobs yet. Start exploring opportunities to see them tracked here.</p>
            <Link to="/jobs">
                <Button size="lg" className="shadow-lg shadow-primary-900/20 font-semibold px-8 h-12">Find Your Next Job</Button>
            </Link>
          </div>
        )}
      </div>

      {showMessages && selectedRecruiterId && (
        <MessagePanel
          recipientId={selectedRecruiterId}
          recipientName={selectedRecruiterName}
          onClose={() => setShowMessages(false)}
        />
      )}
    </div>
  );
}

export default MyApplicationsPage;
