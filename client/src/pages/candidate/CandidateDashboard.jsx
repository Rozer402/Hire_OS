import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Calendar, ChevronRight, FileText, Loader2, Info } from 'lucide-react';
import { applicationService, interviewService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { useAuthStore } from '../../hooks/useAuthStore';

export function CandidateDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [myApps, setMyApps] = React.useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [appsRes, intsRes] = await Promise.all([
          applicationService.getMyApplications(),
          interviewService.getMyInterviews()
        ]);
        
        if (appsRes.success) setMyApps(appsRes.data || []);
        
        if (intsRes.success) {
          const ints = intsRes.data || [];
          setUpcomingInterviews(ints.filter((i) => i?.status !== 'completed' && i?.status !== 'no-show'));
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const profileCompleteness = 85;

  return (
    <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-8">
      
      {/* Welcome Section */}
      <div className="flex flex-col mb-2">
         <h1 className="text-2xl font-semibold text-slate-900 mb-1">Good morning, {user?.name?.split(' ')[0] || 'Candidate'}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 border-l-4 border-l-indigo-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate('/candidate/applications')}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 p-2">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-600">Applications</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : myApps.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-violet-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate('/candidate/interviews')}>
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center text-violet-600 p-2">
                <Calendar className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-600">Interviews</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{isLoading ? '-' : upcomingInterviews.length}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => navigate('/profile')}>
           <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 p-2">
                <FileText className="w-5 h-5" />
              </div>
              <p className="font-semibold text-slate-600">Profile Score</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{profileCompleteness}%</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Applications), Right (Interviews) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column (60%) - Applications */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
             <Link to="/candidate/applications" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
               View all <ChevronRight className="w-4 h-4 cursor-pointer" />
             </Link>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {isLoading ? (
                <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 text-slate-300 animate-spin" /></div>
              ) : myApps.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                   <div className="w-10 h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mb-2">
                     <Info className="w-5 h-5 text-slate-400" />
                   </div>
                   <p className="text-slate-500 font-medium text-sm">No recent applications found.</p>
                </div>
              ) : (
                myApps.slice(0, 5).map(app => (
                  <div key={app._id || app.id || Math.random()} className="p-4 hover:bg-slate-50 transition-all duration-200 cursor-pointer flex items-center justify-between" onClick={() => navigate('/candidate/applications')}>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm cursor-pointer">{app?.job?.title || 'Unknown Role'}</h4>
                      <p className="text-sm text-slate-500">{app?.job?.postedBy?.company || app?.job?.company || 'Confidential Company'}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-md font-semibold capitalize ${(app?.status || '').toLowerCase() === 'applied' ? 'bg-slate-100 text-slate-600' : ((app?.status || '').toLowerCase() === 'interviewing' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700')}`}>
                      {app?.status?.replace(/-/g, ' ') || 'Pending'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (40%) - Interviews */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-lg font-bold text-slate-900">Upcoming Interviews</h2>
          </div>
          <div className="space-y-3">
             {isLoading ? (
                <div className="flex justify-center p-6 bg-white border border-slate-200 rounded-xl shadow-sm"><Loader2 className="w-6 h-6 text-slate-300 animate-spin" /></div>
              ) : upcomingInterviews.length > 0 ? (
                upcomingInterviews.map(int => (
                  <div key={int._id || int.id || Math.random()} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 text-sm cursor-pointer">{int?.job?.title || 'Role'}</h4>
                        <p className="text-xs text-slate-500">{int?.job?.postedBy?.company || int?.job?.company || 'Company'}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] font-bold text-slate-500 uppercase block leading-none">{int?.scheduledAt ? new Date(int.scheduledAt).toLocaleDateString(undefined, { month: 'short' }) : 'TBD'}</span>
                         <span className="text-sm font-bold text-slate-900 block leading-none mt-1">{int?.scheduledAt ? new Date(int.scheduledAt).getDate() : '--'}</span>
                      </div>
                    </div>
                    <Link to={`/candidate/interviews/${int?._id || int?.id}`} className="block">
                      <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer" disabled={!int?._id && !int?.id}>
                        Join
                      </button>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-2 border border-slate-100">
                    <Info className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">No upcoming interviews.</p>
                </div>
              )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default CandidateDashboard;
