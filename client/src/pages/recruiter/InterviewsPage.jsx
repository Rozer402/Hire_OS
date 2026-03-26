import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, UserCheck, CheckCircle2, XCircle, FileQuestion, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { createInterview, interviewService, applicationService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export function InterviewsPage() {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Scheduling State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    applicationId: '',
    scheduledAt: '',
    type: 'video',
    notes: ''
  });
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);

  const openScheduleModal = () => {
    setIsScheduleOpen(true);
    setScheduleError(null);
  };

  React.useEffect(() => {
    if (isScheduleOpen) {
      const fetchApps = async () => {
        try {
          setAppsLoading(true);
          const res = await applicationService.getApplications();
          if (res.success && res.data) {
            setApplications(res.data);
          }
        } catch (err) {
          console.error('Failed to fetch applications for scheduling', err);
        } finally {
          setAppsLoading(false);
        }
      };
      fetchApps();
    }
  }, [isScheduleOpen]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.applicationId) {
      setScheduleError('Please select an application.');
      return;
    }
    setIsScheduling(true);
    setScheduleError(null);

    try {
      const scheduledAtISO = scheduleForm.scheduledAt ? new Date(scheduleForm.scheduledAt).toISOString() : null;
      const res = await createInterview({
        applicationId: scheduleForm.applicationId,
        scheduledAt: scheduledAtISO,
        type: scheduleForm.type,
        notes: scheduleForm.notes
      });
      
      if (res.success || res.data) {
        toast.success('Interview scheduled successfully!');
        setIsScheduleOpen(false);
        setScheduleForm({ applicationId: '', scheduledAt: '', type: 'video', notes: '' });
        
        // Refresh interviews
        const newInt = await interviewService.getInterviews();
        if (newInt.success) setInterviews(newInt.data);
      } else {
        throw new Error(res.message || 'Failed to schedule');
      }
    } catch (err) {
      setScheduleError(err?.response?.data?.message || err.message || 'Failed to schedule interview');
    } finally {
      setIsScheduling(false);
    }
  };

  React.useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const res = await interviewService.getInterviews();
        if (res.success || Array.isArray(res.data) || Array.isArray(res)) {
          setInterviews(res.data || res || []);
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to fetch interviews');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const stats = [
    { label: 'Total Scheduled', value: '18', icon: CalendarIcon },
    { label: 'Completed', value: '45', icon: CheckCircle2 },
    { label: 'Pending Review', value: '12', icon: Clock },
    { label: 'Avg Interview Score', value: '8.4/10', icon: UserCheck },
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed': return <Badge variant="success">Completed</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'no-show': return <Badge variant="danger">No-show</Badge>;
      default: return <Badge variant="secondary">{status || 'Pending'}</Badge>;
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-[#fafafa] tracking-tight">Interviews</h1>
          <p className="text-[#a1a1aa] font-medium mt-1">Manage your upcoming schedule and review AI-generated questions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2" onClick={() => {
            const id = toast.loading('Syncing with calendar...');
            setTimeout(() => toast.success('Calendar synced successfully!', { id }), 1500);
          }}>
            <CalendarIcon className="w-4 h-4" /> Sync Calendar
          </Button>
          <Button
            className="gap-2 bg-[#6366f1] hover:bg-[#4f46e5] text-[#fafafa] shadow-lg shadow-[#6366f1]/20"
            onClick={openScheduleModal}
          >
            <Video className="w-4 h-4" /> Schedule New
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="shadow-xl">
            <CardContent className="p-0 flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#09090b] border border-[#27272a] shadow-inner">
                <stat.icon className="w-6 h-6 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-[2rem] font-bold text-[#fafafa] leading-tight">{stat.value}</p>
                <p className="text-[0.75rem] font-semibold text-[#a1a1aa] uppercase tracking-[0.05em]">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-xl flex flex-col p-0 overflow-hidden">
            <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between min-h-[64px]">
              <h2 className="font-bold text-[#fafafa] text-lg">April 2024</h2>
              <div className="flex gap-1">
                <button className="p-1.5 rounded bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"><ChevronLeft className="w-4 h-4" /></button>
                <button className="p-1.5 rounded bg-[#27272a] text-[#a1a1aa] hover:text-[#fafafa]"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="p-6 flex-1 bg-[#18181b]">
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[0.75rem] font-semibold tracking-[0.05em] text-[#a1a1aa] uppercase">
                <div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div><div>Su</div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-[#a1a1aa]">
                {Array.from({length: 30}).map((_, i) => (
                   <div 
                     key={i} 
                     className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-colors cursor-pointer ${
                       i + 1 === 15 ? 'bg-[#6366f1] text-[#fafafa] shadow-md shadow-[#6366f1]/30' : 
                       [16, 18, 22].includes(i+1) ? 'bg-[#27272a] text-[#fafafa]' : 'hover:bg-white/[0.03]'
                     }`}
                   >
                     {i + 1}
                     {[16, 18, 22].includes(i+1) && <div className="w-1 h-1 rounded-full bg-[#6366f1] mt-1"></div>}
                   </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="shadow-xl h-full border-[#27272a] bg-[#18181b] backdrop-blur-sm border-dashed">
             <div className="p-8 flex flex-col items-center justify-center text-center h-full">
               <Video className="w-12 h-12 text-[#a1a1aa] mb-4" />
               <h3 className="text-lg font-bold text-[#fafafa] mb-2">Connect your Zoom</h3>
               <p className="text-sm text-[#a1a1aa] mb-6">Automatically generate meeting links for every scheduled interview.</p>
               <Button variant="secondary" className="w-full font-bold">Connect Integration</Button>
             </div>
          </Card>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl p-0 overflow-hidden">
            <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex flex-col sm:flex-row justify-between items-center min-h-[64px]">
              <h2 className="font-bold text-[#fafafa] text-lg">Upcoming & Recent</h2>
              <div className="flex gap-2 mt-3 sm:mt-0">
                 <Button variant="secondary" className="h-8 px-3 text-xs bg-[#27272a] hover:bg-[#3f3f46]">All</Button>
                 <Button variant="ghost" className="h-8 px-3 text-xs text-[#a1a1aa] hover:text-[#fafafa]">Today</Button>
                 <Button variant="ghost" className="h-8 px-3 text-xs text-[#a1a1aa] hover:text-[#fafafa]">This Week</Button>
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-[#18181b]">
                  <tr>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Interview</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Status</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a] bg-[#18181b]">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-[#a1a1aa]">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#6366f1]" />
                        Loading interviews...
                      </td>
                    </tr>
                  ) : interviews.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-[#a1a1aa]">
                        No interviews scheduled.
                      </td>
                    </tr>
                  ) : interviews.map(interview => (
                    <tr key={interview._id || interview.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={interview.candidate?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidate?.name || 'User')}`} alt={interview.candidate?.name} className="w-10 h-10 rounded-full border border-[#27272a]" />
                          <div>
                            <p className="font-bold text-[#fafafa] group-hover:text-[#818cf8] transition-colors">{interview.candidate?.name || 'Unknown Candidate'}</p>
                            <p className="text-xs text-[#a1a1aa] font-medium tracking-wide mt-0.5">{interview.type || 'Video'} • {interview.job?.title || 'General'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-semibold text-[#fafafa]">
                             {interview.scheduledAt || interview.date ? new Date(interview.scheduledAt || interview.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                           </span>
                           <span className="flex items-center gap-1.5 text-xs text-[#a1a1aa] mt-0.5">
                             <Clock className="w-3.5 h-3.5" /> {(interview.scheduledAt || interview.date) ? new Date(interview.scheduledAt || interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 flex flex-col gap-2 items-start justify-center pt-5">
                         {getStatusBadge(interview.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" className="h-8 font-bold text-[#a1a1aa] hover:text-[#fafafa]" onClick={() => setSelectedInterview(interview)}>
                            <FileQuestion className="w-3.5 h-3.5 mr-1" /> View Questions
                          </Button>
                          <Button size="sm" variant="secondary" className="h-8 font-bold">Review</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal for AI Questions */}
      {selectedInterview && (
        <>
          <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 transition-opacity" onClick={() => setSelectedInterview(null)}>
            <div 
               className="w-full max-w-2xl bg-[#18181b] border border-[#27272a] rounded-[12px] shadow-2xl z-50 flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
               onClick={e => e.stopPropagation()}
            >
            
            <div className="flex items-center justify-between p-6 border-b border-[#27272a] bg-[#18181b]">
              <div>
                 <h2 className="text-xl font-bold text-[#fafafa] flex items-center gap-2">
                   <FileQuestion className="w-6 h-6 text-[#6366f1]" /> AI Interview Guide
                 </h2>
                 <p className="text-sm text-[#a1a1aa] mt-1">Generated for <span className="font-semibold text-[#fafafa]">{selectedInterview.candidate?.name || 'Unknown Candidate'}</span></p>
              </div>
              <button onClick={() => setSelectedInterview(null)} className="p-2 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.03] rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="bg-[#6366f1]/10 border border-[#6366f1]/20 p-4 rounded-xl">
                 <h3 className="text-xs font-bold uppercase tracking-[0.05em] text-[#6366f1] mb-2">Contextual Recommendations</h3>
                 <p className="text-sm font-medium text-[#fafafa] leading-relaxed">
                   Based on the candidate's core expertise and the requirements for <strong className="text-[#fafafa]">{selectedInterview.job?.title || 'the position'}</strong>, HireOS AI recommends these 5 critical questions to accurately measure their system knowledge and cultural agility.
                 </p>
              </div>

              <div className="space-y-4">
                  <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-semibold text-[#fafafa] mb-2">1. "Can you walk me through the architecture of a high-throughput microservice you've deployed?"</p>
                  </div>
                  <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-semibold text-[#fafafa] mb-2">2. "How would you optimize a database query that is locking tables during peak hours?"</p>
                  </div>
                  <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-semibold text-[#fafafa] mb-2">3. "Describe a time when you completely disagreed with a senior engineer's technical choice. How did you resolve it?"</p>
                  </div>
                  <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-semibold text-[#fafafa] mb-2">4. "How do you ensure reliable monitoring and observability in distributed environments?"</p>
                  </div>
                  <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                    <p className="text-sm font-semibold text-[#fafafa] mb-2">5. "Explain your strategy for migrating monolithic data safely into microservices without causing downtime."</p>
                  </div>
              </div>

            </div>
          </div>
          </div>
        </>
      )}

      {/* Schedule New Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-opacity" onClick={() => setIsScheduleOpen(false)}>
          <div className="w-full max-w-2xl bg-[#18181b] border border-[#27272a] rounded-[12px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#27272a] bg-[#18181b]">
              <div>
                <h2 className="text-xl font-bold text-[#fafafa] flex items-center gap-2">
                  <Video className="w-6 h-6 text-[#6366f1]" /> Schedule New Interview
                </h2>
                <p className="text-sm text-[#a1a1aa] mt-1">Select an application and schedule the meeting.</p>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="p-2 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.03] rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm text-[#a1a1aa] font-medium">Application</label>
                <select
                  value={scheduleForm.applicationId}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, applicationId: e.target.value }))}
                  className="w-full bg-[#27272a] border border-[#3f3f46] text-[#fafafa] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6366f1] transition-colors disabled:opacity-50"
                  disabled={appsLoading || (applications.length === 0 && !appsLoading)}
                  required
                >
                  {appsLoading ? (
                    <option value="">Loading applications...</option>
                  ) : applications.length === 0 ? (
                    <option value="">No applications available</option>
                  ) : (
                    <>
                      <option value="">Select application...</option>
                      {applications.map(app => (
                        <option key={app._id} value={app._id}>
                          {app.candidate?.name || app.candidateName || 'Unknown'} — {app.job?.title || app.jobTitle || 'Unknown Job'}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-[#a1a1aa] font-medium">Scheduled At</label>
                <input
                  type="datetime-local"
                  value={scheduleForm.scheduledAt}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, scheduledAt: e.target.value }))}
                  className="w-full bg-[#27272a] border border-[#3f3f46] text-[#fafafa] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6366f1] transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-[#a1a1aa] font-medium">Type</label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-[#27272a] border border-[#3f3f46] text-[#fafafa] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6366f1] transition-colors"
                >
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in-person">In-person</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-[#a1a1aa] font-medium">Notes (optional)</label>
                <textarea
                  rows={3}
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full bg-[#27272a] border border-[#3f3f46] text-[#fafafa] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#6366f1] transition-colors resize-none"
                  placeholder="Any context for the interviewer"
                />
              </div>

              {scheduleError && (
                <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                  {scheduleError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={() => setIsScheduleOpen(false)} disabled={isScheduling} className="h-11 px-6 font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={isScheduling || !scheduleForm.applicationId} className="bg-[#6366f1] hover:bg-[#4f46e5] text-[#fafafa] font-bold h-11 px-6 inline-flex items-center justify-center gap-2">
                  {isScheduling ? <><Loader2 className="w-5 h-5 animate-spin" /> Scheduling...</> : 'Confirm Schedule'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default InterviewsPage;
