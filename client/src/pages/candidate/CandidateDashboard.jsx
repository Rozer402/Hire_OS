import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { Badge } from '../../components/ui/Badge';
import { Briefcase, Calendar, CheckCircle2, ChevronRight, Video, FileText, Loader2 } from 'lucide-react';
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
        
        if (appsRes.success) {
          setMyApps(appsRes.data || []);
        }
        
        if (intsRes.success) {
          const ints = intsRes.data || [];
          setUpcomingInterviews(
            ints.filter((i) => i?.status !== 'completed' && i?.status !== 'no-show')
          );
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Candidate'}!</h1>
          <p className="text-gray-400">Here's what's happening with your job search today.</p>
        </div>
        <Link to="/jobs">
          <Button className="shadow-lg shadow-primary-900/30 font-medium">Find New Jobs</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-gray-800 bg-gray-900 border-t-4 border-t-primary-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary-900/30 flex items-center justify-center border border-primary-900/50">
                <Briefcase className="h-6 w-6 text-primary-500" />
              </div>
              <span className="text-4xl font-extrabold text-white">{isLoading ? '-' : myApps.length}</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Active Applications</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900 border-t-4 border-t-accent-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-accent-900/30 flex items-center justify-center border border-accent-900/50">
                <Calendar className="h-6 w-6 text-accent-500" />
              </div>
              <span className="text-4xl font-extrabold text-white">{isLoading ? '-' : upcomingInterviews.length}</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Upcoming Interviews</p>
          </CardContent>
        </Card>

        <Card className="border-gray-800 bg-gray-900 border-t-4 border-t-green-500 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                 <ScoreRing score={profileCompleteness} size={48} strokeWidth={5} />
              </div>
              <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-primary-400 hover:text-white hover:bg-primary-950/50">Complete Profile</Button>
              </Link>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider pb-1">Profile Completeness</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card className="border-gray-800 shadow-xl bg-gray-950">
          <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-gray-800">
            <CardTitle>Recent Applications</CardTitle>
            <Link to="/candidate/applications" className="text-sm text-primary-400 hover:text-primary-300 font-medium flex items-center">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-800/80">
              {isLoading ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
              ) : myApps.length === 0 ? (
                <div className="p-8 text-center text-gray-400">No recent applications found.</div>
              ) : (
                myApps.slice(0, 4).map(app => (
                  <div key={app._id || app.id || Math.random()} className="p-5 hover:bg-gray-900 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer" onClick={() => navigate('/candidate/applications')}>
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 mt-1 rounded-lg bg-gray-800 flex items-center justify-center shrink-0 border border-gray-700 group-hover:border-primary-500/50 transition-colors">
                        <Briefcase className="h-5 w-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-100 group-hover:text-primary-300 transition-colors">{app?.job?.title || 'Unknown Role'}</h4>
                        <p className="text-sm text-gray-400 font-medium mb-1.5">{app?.job?.postedBy?.company || app?.job?.company || 'Unknown Company'}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Applied {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
                      <Badge variant={(app?.status || '').toLowerCase() === 'applied' ? 'blue' : ((app?.status || '').toLowerCase() === 'interviewing' ? 'purple' : 'green')} className="shadow-sm font-medium capitalize">{app?.status?.replace(/-/g, ' ') || 'Pending'}</Badge>
                      <Link to={`/candidate/applications`}>
                        <span className="text-xs font-semibold text-gray-500 group-hover:text-primary-400 transition-colors flex items-center gap-1">Track Status <ChevronRight className="w-3 h-3"/></span>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Center - Interviews & Profile */}
        <div className="space-y-6">
          <Card className="border-gray-800 shadow-xl border-l-4 border-l-accent-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-950/20 to-transparent"></div>
            <CardHeader className="pb-3 border-b border-gray-800/50 relative z-10">
              <CardTitle className="text-lg">Up Next</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 relative z-10">
              {isLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-8 h-8 text-accent-500 animate-spin" /></div>
              ) : upcomingInterviews.length > 0 ? (
                <div className="space-y-4">
                  {upcomingInterviews.map(int => (
                    <div key={int._id || int.id || Math.random()} className="bg-gray-950 border border-gray-800 p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-sm hover:border-accent-800/50 transition-colors group">
                      <div className="h-14 w-14 rounded-full bg-accent-950 flex flex-col items-center justify-center shrink-0 border border-accent-800 group-hover:bg-accent-900/50 transition-colors">
                        <span className="text-[10px] font-bold text-accent-500 uppercase leading-none mb-1">{int?.scheduledAt ? new Date(int.scheduledAt).toLocaleDateString(undefined, { month: 'short' }) : 'TBD'}</span>
                        <span className="text-xl font-bold text-accent-300 leading-none">{int?.scheduledAt ? new Date(int.scheduledAt).getDate() : '--'}</span>
                      </div>
                      <div className="flex-1 w-full">
                        <h4 className="font-bold text-white mb-1">{int?.type || 'Virtual'} Interview</h4>
                        <p className="text-sm text-gray-400 font-medium mb-4">{int?.job?.postedBy?.company || int?.job?.company || 'Company'} — {int?.job?.title || 'Role'}</p>
                        <Link to={`/candidate/interviews/${int?._id || int?.id}`} className="block">
                          <Button size="sm" className="w-full gap-2 bg-accent-600 hover:bg-accent-500 text-white shadow-lg shadow-accent-900/40 font-semibold h-9 rounded-lg border border-accent-500" disabled={!int?._id && !int?.id}>
                            <Video className="w-4 h-4" /> Start Async Interview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Video className="w-8 h-8 text-gray-700 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No upcoming interviews at the moment.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-800 shadow-xl bg-gray-950">
            <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2 mb-1.5"><FileText className="w-5 h-5 text-green-500" /> Resume Needs Update</h3>
                <p className="text-sm text-gray-400 font-medium">Your resume was last uploaded 3 months ago.</p>
              </div>
              <Link to="/profile" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto shadow-sm font-semibold border-gray-700 hover:bg-gray-800 hover:text-white">Update Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CandidateDashboard;
