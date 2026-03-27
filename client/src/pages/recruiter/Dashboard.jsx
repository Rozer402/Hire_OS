import React, { useState, useEffect } from 'react';
import { Briefcase, Users, Calendar, UserCheck, TrendingUp, TrendingDown, ArrowRight, Video, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsService, jobService } from '../../services/api';
import { Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toast';

export function Dashboard() {
  const [statsData, setStatsData] = useState({ totalJobs: 0, totalApplications: 0, totalInterviews: 0, totalHired: 0 });
  const [applicationsOverTime, setApplicationsOverTime] = useState([]);
  const [topCandidates, setTopCandidates] = useState([]);
  const [topJobs, setTopJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, overTimeRes, topCandsRes, topJobsRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getApplicationsOverTime(),
          analyticsService.getTopCandidates(),
          jobService.getMyJobs()
        ]);
        
        if (statsRes.success) setStatsData(statsRes.data);
        if (overTimeRes.success) setApplicationsOverTime(overTimeRes.data);
        if (topCandsRes.success) setTopCandidates(topCandsRes.data);
        if (topJobsRes.success) setTopJobs(topJobsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error(error?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Total Jobs Posted', value: statsData.totalJobs.toString(), icon: Briefcase, color: 'border-l-indigo-500', iconBg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Active Applications', value: statsData.totalApplications.toString(), icon: Users, color: 'border-l-violet-500', iconBg: 'bg-violet-50 text-violet-600' },
    { label: 'Interviews Scheduled', value: statsData.totalInterviews.toString(), icon: Calendar, color: 'border-l-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Hired This Month', value: statsData.totalHired.toString(), icon: UserCheck, color: 'border-l-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  ];

  const getStatusBadge = (status) => {
    const s = (status || 'applied').toLowerCase();
    const label = {
      applied: 'Applied',
      'in-review': 'In Review',
      shortlisted: 'Shortlisted',
      interviewing: 'Interviewing',
      offered: 'Offered',
      rejected: 'Rejected'
    }[s] || status || 'Applied';
    switch (s) {
      case 'offered': return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100">{label}</Badge>;
      case 'interviewing': return <Badge className="bg-violet-50 text-violet-700 border border-violet-100 hover:bg-violet-100">{label}</Badge>;
      case 'in-review': return <Badge className="bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100">{label}</Badge>;
      case 'shortlisted': return <Badge className="bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100">{label}</Badge>;
      case 'rejected': return <Badge className="bg-red-50 text-red-600 border border-red-100 hover:bg-red-100">{label}</Badge>;
      default: return <Badge className="bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100">{label}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Recruiter Dashboard</h1>
          <p className="text-slate-500 font-medium text-base">Here's an overview of your hiring pipeline and top talent matches.</p>
        </div>
        <Link to="/recruiter/post-job">
           <Button className="shadow-sm gap-2 h-11 px-6 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white border-transparent">
             <Briefcase className="w-4 h-4"/> Post a New Job
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-white border border-slate-200 border-l-4 ${stat.color} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center p-2`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-slate-600">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-indigo-600" /></div>
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Applications Over Time (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', fontWeight: 600, color: '#0f172a' }}
                      itemStyle={{ color: '#4f46e5' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 6, fill: '#4f46e5', strokeWidth: 0, shadow: '0 0 10px rgba(79, 70, 229, 0.5)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Top Matched Candidates</CardTitle>
              <Link to="/recruiter/candidates" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center group">
                View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold tracking-wider uppercase">Candidate</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold tracking-wider uppercase pl-2">AI Score</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold tracking-wider uppercase">Status</th>
                    <th className="px-6 py-4 text-slate-500 text-xs font-bold tracking-wider uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {topCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-slate-500 text-sm font-medium">No applications to show yet.</td>
                    </tr>
                  ) : topCandidates.map(app => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={app.candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate.name)}`} alt={app.candidate.name} className="w-10 h-10 rounded-full border border-slate-200 shadow-sm transition-colors"/>
                          <div>
                            <p className="font-bold text-slate-900 transition-colors">{app.candidate.name}</p>
                            <p className="text-sm text-slate-500 font-medium tracking-wide mt-0.5">{app.job?.title || 'Unknown Role'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center w-24">
                        <ScoreRing score={app.aiScore || 0} size={42} strokeWidth={4} />
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Link to={`/recruiter/applications?job=${app.job?._id}`}>
                             <Button variant="outline" size="sm" className="font-semibold h-8 px-3 border-slate-200 text-slate-600 hover:bg-slate-100">View</Button>
                           </Link>
                           <Link to="/recruiter/interviews">
                             <Button size="sm" className="font-semibold gap-1.5 h-8 px-3 text-white bg-indigo-600 hover:bg-indigo-700 border-none shadow-sm">
                               <Video className="w-3.5 h-3.5" /> Schedule
                             </Button>
                           </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
           <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Job Postings</CardTitle>
              <Link to="/recruiter/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
               <div className="divide-y divide-slate-100 px-2 py-1">
                  {topJobs.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 font-medium text-sm">No jobs posted yet.</div>
                  ) : topJobs.map(job => (
                     <div key={job._id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer mb-1 border border-transparent hover:border-slate-100">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-slate-900 leading-tight transition-colors">{job.title}</h4>
                          <Badge variant={job.status === 'closed' ? 'secondary' : 'success'} className={`ml-3 shrink-0 shadow-sm capitalize ${job.status === 'closed' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>{job.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{job.applicantCount || 0} <span className="font-medium text-slate-500">applicants</span></span>
                          </div>
                          <span className="text-sm font-semibold text-slate-500">
                            {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

      </div>
      )}
    </div>
  );
}

export default Dashboard;
