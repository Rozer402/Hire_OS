import { useState, useEffect } from 'react';
import { applicationService } from '../../services/api';
import { Briefcase, Building2, MapPin, Calendar, Clock, ChevronRight, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

function getStatusBadge(status) {
  const s = (status || '').toLowerCase();
  switch (s) {
    case 'applied':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold uppercase tracking-wider"><Clock className="w-3.5 h-3.5"/> Applied</span>;
    case 'interviewing':
    case 'interview-scheduled':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider"><Calendar className="w-3.5 h-3.5"/> Interviewing</span>;
    case 'hired':
    case 'selected':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider"><CheckCircle2 className="w-3.5 h-3.5"/> Hired</span>;
    case 'rejected':
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider"><XCircle className="w-3.5 h-3.5"/> Rejected</span>;
    default:
      return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider">{s || 'Pending'}</span>;
  }
}

export function MyApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await applicationService.getMyApplications();
      setApps(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = apps.filter(app => {
    if (filter === 'All') return true;
    const s = (app.status || '').toLowerCase();
    if (filter === 'Applied' && s === 'applied') return true;
    if (filter === 'Interviewing' && (s === 'interviewing' || s === 'interview-scheduled')) return true;
    if (filter === 'Closed' && (s === 'rejected' || s === 'hired' || s === 'selected')) return true;
    return false;
  });

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8 space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My Applications</h1>
          <p className="text-slate-500 font-medium">Track and manage your submitted job applications.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm inline-flex items-center overflow-x-auto hide-scrollbar w-full md:w-auto">
        {['All', 'Applied', 'Interviewing', 'Closed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${filter === f ? 'bg-indigo-50 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.2)]' : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-none'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse flex h-32"></div>
          ))}
        </div>
      ) : filteredApps.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredApps.map(app => (
            <div key={app._id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                  <Building2 className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <Link to={`/jobs/${app?.job?._id}`} className="block group">
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1 cursor-pointer">{app?.job?.title || 'Unknown Role'}</h3>
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400"/> {app?.job?.company || app?.job?.postedBy?.company || 'Company'}</span>
                    {app?.job?.location && (
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400"/> {app?.job?.location}</span>
                    )}
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400"/> Applied {formatDistanceToNow(new Date(app?.createdAt))} ago</span>
                  </div>
                  
                  {app.aiScore != null && (
                    <div className="mt-4 flex items-center gap-2">
                       <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">Match Score: {app.aiScore}%</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 shrink-0 justify-center">
                {getStatusBadge(app.status)}
                
                <Link to={`/jobs/${app?.job?._id}`} className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center gap-1 cursor-pointer">
                  View Job <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No applications found</h3>
          <p className="text-slate-500 mb-6 font-medium">You haven't applied to any jobs that match this filter yet.</p>
          <Link to="/jobs">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg transition-all shadow-sm cursor-pointer">
              Browse Open Jobs
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default MyApplicationsPage;
