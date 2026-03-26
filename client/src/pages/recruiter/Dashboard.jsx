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
    { label: 'Total Jobs Posted', value: statsData.totalJobs.toString(), icon: Briefcase, change: '', isPositive: true },
    { label: 'Active Applications', value: statsData.totalApplications.toString(), icon: Users, change: '', isPositive: true },
    { label: 'Interviews Scheduled', value: statsData.totalInterviews.toString(), icon: Calendar, change: '', isPositive: true },
    { label: 'Hired This Month', value: statsData.totalHired.toString(), icon: UserCheck, change: '', isPositive: true },
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
      case 'offered': return <Badge variant="success">{label}</Badge>;
      case 'interviewing': return <Badge variant="primary">{label}</Badge>;
      case 'in-review': return <Badge variant="info">{label}</Badge>;
      case 'shortlisted': return <Badge variant="warning">{label}</Badge>;
      case 'rejected': return <Badge variant="danger">{label}</Badge>;
      default: return <Badge variant="secondary">{label}</Badge>;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-[#fafafa] mb-2">Recruiter Dashboard</h1>
          <p className="text-[#a1a1aa] font-medium text-base">Here's an overview of your hiring pipeline and top talent matches.</p>
        </div>
        <Link to="/recruiter/post-job">
           <Button className="shadow-lg shadow-primary/20 gap-2 h-11 px-6 font-bold text-sm bg-primary hover:bg-primary-hover">
             <Briefcase className="w-4 h-4"/> Post a New Job
           </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden relative group transition-colors border-l-[3px] border-l-[#6366f1]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#27272a]/50 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 transition-colors duration-500"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-2xl bg-[#27272a] border border-[#3f3f46] shadow-inner transition-colors">
                  <stat.icon className="h-6 w-6 text-[#a1a1aa] transition-colors" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.isPositive ? 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30' : 'text-[#f43f5e] bg-[#f43f5e]/10 border border-[#f43f5e]/30'}`}>
                  {stat.isPositive ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1.5">{stat.label}</h3>
              <p className="text-[2rem] font-bold text-[#fafafa] tracking-tight">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-[#6366f1]" /></div>
      ) : (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <Card className="shadow-xl">
            <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
              <CardTitle className="text-lg font-bold text-[#fafafa]">Applications Over Time (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-8">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                    <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', fontWeight: 600 }}
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorApps)" activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 0, shadow: '0 0 10px #6366f1' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#27272a] bg-[#18181b] pb-4">
              <CardTitle className="text-lg font-bold text-[#fafafa]">Top Matched Candidates</CardTitle>
              <Link to="/recruiter/candidates" className="text-sm font-bold text-[#6366f1] hover:text-[#818cf8] transition-colors flex items-center group">
                View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#27272a] bg-[#18181b]">
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Candidate</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase pl-2">AI Score</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Status</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {topCandidates.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-[#a1a1aa] text-sm">No applications to show yet.</td>
                    </tr>
                  ) : topCandidates.map(app => (
                    <tr key={app._id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={app.candidate.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.candidate.name)}`} alt={app.candidate.name} className="w-10 h-10 rounded-full border border-[#3f3f46] shadow-inner transition-colors"/>
                          <div>
                            <p className="font-bold text-[#fafafa] transition-colors">{app.candidate.name}</p>
                            <p className="text-xs text-[#a1a1aa] font-medium tracking-wide mt-0.5">{app.job?.title || 'Unknown Role'}</p>
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
                           <Link to={`/recruiter/applications/${app._id}`}>
                             <Button variant="ghost" size="sm" className="font-bold h-8 px-3">View</Button>
                           </Link>
                           <Link to="/recruiter/interviews">
                             <Button size="sm" className="font-bold gap-1.5 h-8 px-3 text-white bg-[#6366f1] hover:bg-[#4f46e5]">
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
           <Card className="shadow-xl flex flex-col h-full">
            <CardHeader className="flex flex-row items-center justify-between border-b border-[#27272a] bg-[#18181b] pb-4">
              <CardTitle className="text-lg font-bold text-[#fafafa]">Recent Job Postings</CardTitle>
              <Link to="/recruiter/post-job" className="text-sm font-bold text-[#6366f1] hover:text-[#818cf8] transition-colors group">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </CardHeader>
            <CardContent className="p-0 flex-1">
               <div className="divide-y divide-[#27272a]">
                  {topJobs.map(job => (
                     <div key={job._id} className="p-5 hover:bg-white/[0.03] transition-colors group cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-bold text-[#fafafa] leading-tight transition-colors">{job.title}</h4>
                          <Badge variant={job.status === 'closed' ? 'secondary' : 'success'} className="ml-3 shrink-0 shadow-sm capitalize">{job.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#a1a1aa]" />
                            <span className="text-sm font-bold text-[#fafafa]">{job.applicantCount || 0} <span className="text-xs text-[#a1a1aa] font-medium">applicants</span></span>
                          </div>
                          <span className="text-xs font-semibold text-[#a1a1aa]">
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
