import React, { useState, useMemo, useEffect } from 'react';
import MessagePanel from '../../components/MessagePanel';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowDownUp, CheckCircle2, Navigation, MoreHorizontal, X, Mail, Phone, ExternalLink, Loader2, Video, Download, MessageSquare } from 'lucide-react';
import { applicationService, createInterview } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';

const TAB_TO_STATUS = {
  All: null,
  'In Review': 'in-review',
  Shortlisted: 'shortlisted',
  Interviewing: 'interviewing',
  Offered: 'offered',
  Rejected: 'rejected'
};

function statusLabel(raw) {
  const s = (raw || 'applied').toLowerCase();
  const map = {
    applied: 'Applied',
    'in-review': 'In Review',
    shortlisted: 'Shortlisted',
    interviewing: 'Interviewing',
    offered: 'Offered',
    rejected: 'Rejected'
  };
  return map[s] || raw || 'Applied';
}

export function ApplicationsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [showMessages, setShowMessages] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const STAGES = ['applied', 'in-review', 'shortlisted', 'interviewing', 'offered'];

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleError, setScheduleError] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({ scheduledAt: '', type: 'video', notes: '' });

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApplication) return;
    setIsScheduling(true);
    setScheduleError(null);

    try {
      const scheduledAtISO = scheduleForm.scheduledAt ? new Date(scheduleForm.scheduledAt).toISOString() : null;
      const res = await createInterview({
        applicationId: selectedApplication._id,
        scheduledAt: scheduledAtISO,
        type: scheduleForm.type,
        notes: scheduleForm.notes
      });
      if (res.success || res.message === 'Interview created successfully') {
        toast.success('Interview scheduled successfully!');
        setIsModalOpen(false);
        setScheduleForm({ scheduledAt: '', type: 'video', notes: '' });
      } else {
        throw new Error(res.message || 'Failed to schedule interview');
      }
    } catch (err) {
      setScheduleError(err?.response?.data?.message || err.message || 'Failed to schedule');
    } finally {
      setIsScheduling(false);
    }
  };
  
  const handleNextStage = async () => {
    if (!selectedApp) return;
    const currentStatus = (selectedApp.status || 'applied').toLowerCase();
    const currentIdx = STAGES.indexOf(currentStatus);
    
    if (currentIdx >= 0 && currentIdx < STAGES.length - 1) {
      const nextStatus = STAGES[currentIdx + 1];
      try {
        setUpdatingStatus(true);
        const res = await applicationService.updateStatus(selectedApp._id, { status: nextStatus, note: 'Moved to next stage by recruiter' });
        if (res.success) {
          toast.success(`Moved to ${statusLabel(nextStatus)}`);
          setApplications(prev => prev.map(a => a._id === selectedApp._id ? { ...a, status: nextStatus } : a));
          setSelectedApp(prev => ({ ...prev, status: nextStatus }));
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to update status');
      } finally {
        setUpdatingStatus(false);
      }
    }
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export');
      return;
    }
    
    try {
      const headers = ['Candidate Name', 'Email', 'Job Title', 'Status', 'Applied Date'];
      const rows = applications.map(app => {
        const dateStr = app.createdAt ? new Date(app.createdAt).toISOString().split('T')[0] : 'N/A';
        return [
          app.candidate?.name || 'N/A',
          app.candidate?.email || 'N/A',
          app.job?.title || 'N/A',
          app.status || 'applied',
          dateStr
        ];
      });
      
      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `applications-export-${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate CSV');
    }
  };

  useEffect(() => {
    const fetchApps = async () => {
      try {
        setIsLoading(true);
        const res = await applicationService.getApplications();
        if (res.success) {
          setApplications(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error(error?.response?.data?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, []);

  const tabs = ['All', 'In Review', 'Shortlisted', 'Interviewing', 'Offered', 'Rejected'];

  const filteredApps = useMemo(() => {
    const tabKey = TAB_TO_STATUS[activeTab];
    return applications.filter(app => {
      const st = (app.status || 'applied').toLowerCase();
      const matchTab = tabKey === null || st === tabKey;
      const matchSearch = app.candidate?.name?.toLowerCase().includes(search.toLowerCase()) ||
                          app.job?.title?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [applications, activeTab, search]);

  const getStatusBadge = (status) => {
    const label = statusLabel(status);
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'offered': return <Badge variant="success">{label}</Badge>;
      case 'interviewing': return <Badge variant="primary">{label}</Badge>;
      case 'in-review': return <Badge variant="info">{label}</Badge>;
      case 'shortlisted': return <Badge variant="warning">{label}</Badge>;
      case 'rejected': return <Badge variant="danger">{label}</Badge>;
      default: return <Badge variant="secondary">{label}</Badge>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-primary bg-primary/10 border-primary/30';
    if (score >= 75) return 'text-status-success bg-status-success/10 border-status-success/30';
    if (score >= 60) return 'text-status-warning bg-status-warning/10 border-status-warning/30';
    return 'text-status-danger bg-status-danger/10 border-status-danger/30';
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen flex flex-col relative">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] font-bold text-[#fafafa] tracking-tight">Applications</h1>
          <p className="text-[#a1a1aa] font-medium mt-1">Manage and track your 12 active applicant pipelines.</p>
        </div>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] overflow-hidden shadow-sm flex-1 flex flex-col relative">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#27272a] flex flex-col md:flex-row justify-between gap-4 bg-[#18181b]">
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
            {tabs.map(tab => {
              const tabKey = TAB_TO_STATUS[tab];
              const count = tabKey === null
                ? applications.length
                : applications.filter(a => (a.status || 'applied').toLowerCase() === tabKey).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${isActive ? 'bg-[#27272a] text-[#fafafa] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.03]'}`}
                >
                  {tab}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-[#6366f1] text-white' : 'bg-[#27272a]/50 text-[#a1a1aa] group-hover:bg-[#27272a]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
              <input 
                type="text" 
                placeholder="Search candidates or jobs..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full md:w-64 pl-9 pr-4 py-2 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
              />
            </div>
            <select className="bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#6366f1]">
              <option>Sort by: Newest</option>
              <option>Sort by: Score (High to Low)</option>
              <option>Sort by: Name (A-Z)</option>
            </select>
            <Button variant="secondary" className="h-[38px] px-3 gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-[#fafafa] border border-[#3f3f46]" onClick={handleExportCSV}>
              <Download className="w-4 h-4" />
              <span className="hidden md:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 h-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-[#6366f1]" /></div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Candidate</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Job Applied</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Applied Date</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">AI Score</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Status</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a] flex-1">
              {filteredApps.map(app => (
                <tr 
                  key={app._id} 
                  onClick={() => setSelectedApp(app)}
                  className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={app.candidate?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate?.name || 'User')}`} alt={app.candidate?.name} className="w-9 h-9 rounded-full bg-[#27272a] border border-[#3f3f46]" />
                      <div>
                        <p className="text-sm font-bold text-[#fafafa] group-hover:text-[#818cf8] transition-colors">{app.candidate?.name || 'Unknown'}</p>
                        <p className="text-xs text-[#a1a1aa]">{app.candidate?.email || 'No email'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#fafafa]">{app.job?.title || 'Unknown Job'}</p>
                    <p className="text-xs text-[#a1a1aa] truncate max-w-[150px]">{app.job?.department || 'General'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#a1a1aa]">
                      {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex min-w-[36px] items-center justify-center border font-bold text-xs px-2.5 py-1 rounded-md ${getScoreColor(app.aiScore || 0)}`}>
                      {app.aiScore || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {getStatusBadge(app.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-[#a1a1aa] hover:text-[#6366f1]" onClick={(e) => { e.stopPropagation(); setSelectedApp(app); setShowMessages(true); }}>
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 px-3" onClick={(e) => { e.stopPropagation(); navigate(`/recruiter/applications/${app._id}`); }}>View</Button>
                      <select 
                        className="bg-[#27272a] border border-[#3f3f46] text-[#fafafa] text-xs rounded px-2 py-1.5 focus:outline-none focus:border-[#6366f1] cursor-pointer max-w-[120px]"
                        onClick={(e) => e.stopPropagation()}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          if (!newStatus) return;
                          try {
                            const res = await applicationService.updateStatus(app._id, { status: newStatus, note: 'Updated from applications list' });
                            if (res.success) {
                               setApplications(prev => prev.map(a => a._id === app._id ? { ...a, status: newStatus } : a));
                            }
                          } catch (err) {
                            console.error('Failed to update status', err);
                            toast.error(err?.response?.data?.message || 'Failed to update status');
                          }
                        }}
                        value={(app.status || 'applied').toLowerCase()}
                      >
                        <option value="applied">Applied</option>
                        <option value="in-review">In Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#a1a1aa]">
                    No applications found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Slide-over Side Panel */}
      {selectedApp && (
        <>
          <div className="fixed inset-0 bg-[#09090b]/50 backdrop-blur-sm z-40 transition-opacity" onClick={() => setSelectedApp(null)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#18181b] border-l border-[#27272a] shadow-2xl z-50 flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
              <h2 className="text-lg font-bold text-[#fafafa]">Application Details</h2>
              <button onClick={() => setSelectedApp(null)} className="p-2 text-[#a1a1aa] hover:text-white hover:bg-white/[0.03] rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 space-y-8">
              <div className="flex items-center gap-5">
                <img src={selectedApp.candidate?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedApp.candidate?.name || 'User')}`} className="w-20 h-20 rounded-2xl border border-[#27272a] shadow-md" alt="Avatar"/>
                <div>
                  <h3 className="text-[2rem] font-bold text-[#fafafa] mb-1 leading-none">{selectedApp.candidate.name}</h3>
                  <div className="flex flex-wrap gap-2 text-sm text-[#a1a1aa] font-medium mt-3">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5"/> {selectedApp.candidate.email}</span>
                    {selectedApp.candidate.phone && <span className="flex items-center gap-1 ml-2"><Phone className="w-3.5 h-3.5"/> {selectedApp.candidate.phone}</span>}
                    {selectedApp.candidate.linkedIn && <a href={selectedApp.candidate.linkedIn} target="_blank" rel="noreferrer" className="flex items-center gap-1 ml-2 text-[#6366f1] hover:underline"><ExternalLink className="w-3.5 h-3.5"/> LinkedIn</a>}
                    {selectedApp.candidate.github && <a href={selectedApp.candidate.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 ml-2 text-[#6366f1] hover:underline"><ExternalLink className="w-3.5 h-3.5"/> GitHub</a>}
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-[#09090b] p-6 rounded-[12px] border border-[#27272a]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold tracking-[0.05em] text-[#a1a1aa] uppercase">AI Match Analysis</span>
                  <div className={`font-bold text-sm px-2 py-0.5 rounded border ${getScoreColor(selectedApp.aiScore || 0)}`}>
                    Score: {selectedApp.aiScore || 0}/100
                  </div>
                </div>
                <p className="text-sm text-[#fafafa] leading-relaxed font-medium">"{selectedApp.aiReasoning || "AI assessment pending"}"</p>
              </div>

              <div>
                <h4 className="text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase mb-3">Role Applied</h4>
                <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] p-4 rounded-[12px]">
                  <div>
                    <p className="font-bold text-[#fafafa]">{selectedApp.job?.title}</p>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">{selectedApp.job?.type} • {selectedApp.job?.location}</p>
                  </div>
                  <Link to={selectedApp.job?._id ? `/jobs/${selectedApp.job._id}` : '/jobs'} onClick={(e) => e.stopPropagation()}>
                    <ExternalLink className="w-4 h-4 text-[#a1a1aa] hover:text-[#6366f1] cursor-pointer" />
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase mb-3">Candidate Status</h4>
                <div className="flex items-center justify-between">
                  {getStatusBadge(selectedApp.status)}
                  <span className="text-xs text-[#a1a1aa] font-semibold">Applied {new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase mb-3">Actions</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="secondary" 
                    className="w-full text-xs" 
                    onClick={() => setShowMessages(true)}
                  >
                    Message Candidate
                  </Button>
                  <Button 
                    className="w-full text-xs bg-[#6366f1] hover:bg-[#4f46e5] text-white disabled:opacity-50"
                    onClick={handleNextStage}
                    disabled={updatingStatus || STAGES.indexOf((selectedApp.status || 'applied').toLowerCase()) >= STAGES.length - 1}
                  >
                    {updatingStatus ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Move to Next Stage'}
                  </Button>
                  <Button 
                    className="col-span-2 w-full text-xs bg-[#10b981] hover:bg-[#059669] text-white"
                    onClick={() => {
                       setSelectedApplication(selectedApp);
                       setIsModalOpen(true);
                    }}
                  >
                     <Video className="w-4 h-4 mr-2" /> Schedule Interview
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </>
      )}

      {/* Messaging Panel */}
      {showMessages && selectedApp && (
        <MessagePanel
          recipientId={selectedApp.candidate?._id}
          recipientName={selectedApp.candidate?.name}
          onClose={() => setShowMessages(false)}
        />
      )}

      {/* Schedule Interview Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 transition-opacity" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-2xl bg-[#18181b] border border-[#27272a] rounded-[12px] shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
              <div>
                <h2 className="text-xl font-bold text-[#fafafa] flex items-center gap-2">
                  <Video className="w-6 h-6 text-[#10b981]" /> Schedule Interview
                </h2>
                <p className="text-sm text-[#a1a1aa] mt-1">for <span className="text-[#fafafa] font-bold">{selectedApplication.candidate?.name}</span></p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.03] rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
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
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} disabled={isScheduling} className="h-11 px-6 font-bold">
                  Cancel
                </Button>
                <Button type="submit" disabled={isScheduling} className="bg-[#10b981] hover:bg-[#059669] text-[#fafafa] font-bold h-11 px-6 inline-flex items-center justify-center gap-2">
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

export default ApplicationsPage;
