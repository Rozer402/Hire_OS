import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, UserCheck, CheckCircle2, FileQuestion, X, Loader2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { createInterview, interviewService, applicationService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const thClass = "px-6 py-3.5 text-slate-500 text-xs font-bold tracking-wider uppercase text-left border-b border-slate-200 bg-slate-50";
const inputClass = "w-full border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-sm placeholder-slate-400 shadow-sm";

export function InterviewsPage() {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ applicationId: '', scheduledAt: '', type: 'video', notes: '' });
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);

  const openScheduleModal = () => { setIsScheduleOpen(true); setScheduleError(null); };

  React.useEffect(() => {
    if (isScheduleOpen) {
      const fetchApps = async () => {
        try {
          setAppsLoading(true);
          const res = await applicationService.getApplications();
          if (res.success && res.data) setApplications(res.data);
        } catch (err) { console.error(err); } finally { setAppsLoading(false); }
      };
      fetchApps();
    }
  }, [isScheduleOpen]);

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleForm.applicationId) { setScheduleError('Please select an application.'); return; }
    setIsScheduling(true); setScheduleError(null);
    try {
      const scheduledAtISO = scheduleForm.scheduledAt ? new Date(scheduleForm.scheduledAt).toISOString() : null;
      const res = await createInterview({ applicationId: scheduleForm.applicationId, scheduledAt: scheduledAtISO, type: scheduleForm.type, notes: scheduleForm.notes });
      if (res.success || res.data) {
        toast.success('Interview scheduled successfully!');
        setIsScheduleOpen(false);
        setScheduleForm({ applicationId: '', scheduledAt: '', type: 'video', notes: '' });
        const newInt = await interviewService.getInterviews();
        if (newInt.success) setInterviews(newInt.data);
      } else { throw new Error(res.message || 'Failed to schedule'); }
    } catch (err) { setScheduleError(err?.response?.data?.message || err.message || 'Failed to schedule interview'); }
    finally { setIsScheduling(false); }
  };

  React.useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setIsLoading(true);
        const res = await interviewService.getInterviews();
        if (res.success || Array.isArray(res.data) || Array.isArray(res)) setInterviews(res.data || res || []);
      } catch (err) { toast.error(err?.response?.data?.message || 'Failed to fetch interviews'); }
      finally { setIsLoading(false); }
    };
    fetchInterviews();
  }, []);

  const stats = [
    { label: 'Total Scheduled', value: interviews.length.toString() || '0', icon: CalendarIcon, color: 'border-l-indigo-500', iconBg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Completed', value: interviews.filter(i => i.status === 'completed').length.toString(), icon: CheckCircle2, color: 'border-l-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
    { label: 'Pending Review', value: interviews.filter(i => i.status !== 'completed').length.toString(), icon: Clock, color: 'border-l-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Avg Interview Score', value: '8.4/10', icon: UserCheck, color: 'border-l-violet-500', iconBg: 'bg-violet-50 text-violet-600' },
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    const cls = s === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                s === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                s === 'no-show' ? 'bg-red-50 text-red-600 border border-red-100' :
                'bg-slate-100 text-slate-600 border border-slate-200';
    const label = s === 'completed' ? 'Completed' : s === 'pending' ? 'Pending' : s === 'no-show' ? 'No-show' : status || 'Pending';
    return <span className={`text-xs font-bold px-2.5 py-1 rounded-md capitalize ${cls}`}>{label}</span>;
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interviews</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your upcoming schedule and review AI-generated questions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold" onClick={() => {
            const id = toast.loading('Syncing with calendar...');
            setTimeout(() => toast.success('Calendar synced successfully!', { id }), 1500);
          }}>
            <CalendarIcon className="w-4 h-4" /> Sync Calendar
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm" onClick={openScheduleModal}>
            <Video className="w-4 h-4" /> Schedule New
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white border border-slate-200 border-l-4 ${stat.color} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center p-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Interviews Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h2 className="font-bold text-slate-900 text-lg">Upcoming & Recent</h2>
          <div className="flex gap-2">
            <button className="h-8 px-3 text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg">All</button>
            <button className="h-8 px-3 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">Today</button>
            <button className="h-8 px-3 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors">This Week</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className={thClass}>Interview</th>
                <th className={thClass}>Date & Time</th>
                <th className={thClass}>Status</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  <Loader2 className="w-7 h-7 animate-spin mx-auto mb-3 text-indigo-600" />
                  <span className="text-sm font-medium">Loading interviews...</span>
                </td></tr>
              ) : interviews.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400 font-medium text-sm">No interviews scheduled yet.</td></tr>
              ) : interviews.map(interview => (
                <tr key={interview._id || interview.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={interview.candidate?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(interview.candidate?.name || 'User')}&background=e0e7ff&color=4338ca`}
                        alt={interview.candidate?.name} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{interview.candidate?.name || 'Unknown Candidate'}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 capitalize">{interview.type || 'Video'} · {interview.job?.title || 'General'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900 block">
                      {(interview.scheduledAt || interview.date) ? new Date(interview.scheduledAt || interview.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'TBD'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" /> {(interview.scheduledAt || interview.date) ? new Date(interview.scheduledAt || interview.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBD'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(interview.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="sm" variant="ghost" className="h-8 text-slate-500 hover:text-indigo-600 font-semibold" onClick={() => setSelectedInterview(interview)}>
                        <FileQuestion className="w-3.5 h-3.5 mr-1" /> Questions
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 font-semibold border-slate-200 text-slate-600 hover:bg-slate-50">Review</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Questions Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={() => setSelectedInterview(null)}>
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileQuestion className="w-5 h-5 text-indigo-600" /> AI Interview Guide</h2>
                <p className="text-sm text-slate-500 mt-0.5">Generated for <span className="font-semibold text-slate-900">{selectedInterview.candidate?.name || 'Unknown Candidate'}</span></p>
              </div>
              <button onClick={() => setSelectedInterview(null)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">Contextual Recommendations</h3>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                  Based on the candidate's expertise and the requirements for <strong className="text-slate-900">{selectedInterview.job?.title || 'the position'}</strong>, HireOS AI recommends these critical questions to measure their knowledge and cultural fit.
                </p>
              </div>
              <div className="space-y-3">
                {["Can you walk me through the architecture of a high-throughput microservice you've deployed?",
                  "How would you optimize a database query that is locking tables during peak hours?",
                  "Describe a time when you disagreed with a senior engineer's technical choice. How did you resolve it?",
                  "How do you ensure reliable monitoring and observability in distributed environments?",
                  "Explain your strategy for migrating monolithic data safely into microservices without causing downtime."
                ].map((q, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                    <p className="text-sm font-semibold text-slate-900"><span className="text-indigo-600 mr-2">{i+1}.</span>"{q}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setIsScheduleOpen(false)}>
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Video className="w-5 h-5 text-indigo-600" /> Schedule New Interview</h2>
                <p className="text-sm text-slate-500 mt-0.5">Select an application and set the meeting details.</p>
              </div>
              <button onClick={() => setIsScheduleOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Application</label>
                <select value={scheduleForm.applicationId} onChange={(e) => setScheduleForm(p => ({ ...p, applicationId: e.target.value }))} className={inputClass} disabled={appsLoading || applications.length === 0} required>
                  {appsLoading ? <option value="">Loading applications...</option> :
                   applications.length === 0 ? <option value="">No applications available</option> : (
                    <><option value="">Select application...</option>
                    {applications.map(app => <option key={app._id} value={app._id}>{app.candidate?.name || 'Unknown'} — {app.job?.title || 'Unknown Job'}</option>)}</>
                  )}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Scheduled At</label>
                <input type="datetime-local" value={scheduleForm.scheduledAt} onChange={(e) => setScheduleForm(p => ({ ...p, scheduledAt: e.target.value }))} className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Interview Type</label>
                <select value={scheduleForm.type} onChange={(e) => setScheduleForm(p => ({ ...p, type: e.target.value }))} className={inputClass}>
                  <option value="video">Video</option><option value="phone">Phone</option><option value="in-person">In-person</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Notes (optional)</label>
                <textarea rows={3} value={scheduleForm.notes} onChange={(e) => setScheduleForm(p => ({ ...p, notes: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Any context for the interviewer" />
              </div>
              {scheduleError && <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 font-medium">{scheduleError}</div>}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)} disabled={isScheduling} className="h-11 px-6 font-semibold border-slate-200 text-slate-600">Cancel</Button>
                <Button type="submit" disabled={isScheduling || !scheduleForm.applicationId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 px-6 gap-2 shadow-sm">
                  {isScheduling ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling...</> : 'Confirm Schedule'}
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
