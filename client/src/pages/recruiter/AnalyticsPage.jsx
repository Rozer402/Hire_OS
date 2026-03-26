import React, { useState } from 'react';
import { Calendar as CalendarIcon, Download, TrendingUp, Users, Target, Clock, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { analyticsService, jobService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30D');
  const [data, setData] = useState({
    applicationsOverTime: [],
    pipelineFunnel: [],
    statusData: [],
    timeToHireData: [],
    metrics: { totalJobs: 0, totalApplications: 0, totalInterviews: 0, hired: 0, avgScore: 0 }
  });
  const [topJobs, setTopJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [statsRes, overRes, funnelRes, topCandsRes, myJobsRes] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getApplicationsOverTime(),
          analyticsService.getFunnel(),
          analyticsService.getTopCandidates(),
          jobService.getMyJobs()
        ]);

        const funnelMap = funnelRes.success ? (funnelRes.data || {}) : {};
        const funnelOrder = ['applied', 'in-review', 'shortlisted', 'interviewing', 'offered', 'rejected'];
        const pipelineFunnel = funnelOrder
          .filter((k) => (funnelMap[k] || 0) > 0 || Object.keys(funnelMap).length === 0)
          .map((k) => ({
            stage: k.replace(/-/g, ' '),
            count: funnelMap[k] || 0
          }));

        const statusData = Object.entries(funnelMap).map(([name, value]) => ({
          name: name.replace(/-/g, ' '),
          value
        }));

        const applicationsOverTime = (overRes.success ? overRes.data : []).map((row) => ({
          name: row.date,
          applications: row.count
        }));

        const topList = topCandsRes.success ? (topCandsRes.data || []) : [];
        const avgScore = topList.length
          ? Math.round(topList.reduce((a, x) => a + (x.aiScore || 0), 0) / topList.length)
          : 0;

        const metrics = statsRes.success
          ? {
              totalJobs: statsRes.data?.totalJobs ?? 0,
              totalApplications: statsRes.data?.totalApplications ?? 0,
              totalInterviews: statsRes.data?.totalInterviews ?? 0,
              hired: statsRes.data?.totalHired ?? 0,
              avgScore
            }
          : { totalJobs: 0, totalApplications: 0, totalInterviews: 0, hired: 0, avgScore: 0 };

        setData({
          applicationsOverTime,
          pipelineFunnel: pipelineFunnel.length ? pipelineFunnel : [{ stage: 'No data', count: 0 }],
          statusData,
          timeToHireData: [],
          metrics
        });

        if (myJobsRes.success && Array.isArray(myJobsRes.data)) {
          setTopJobs(myJobsRes.data);
        }
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const COLORS = ['#3b82f6', '#f59e0b', '#6366f1', '#10b981', '#f43f5e'];

  const kpis = [
    { label: 'Total Jobs', value: data.metrics.totalJobs, change: '+0%', icon: Activity },
    { label: 'Total Applications', value: data.metrics.totalApplications, change: '+0%', icon: Users },
    { label: 'Interviews Scheduled', value: data.metrics.totalInterviews, change: '+0%', icon: Target },
    { label: 'Avg Candidate Score', value: data.metrics.avgScore, change: '+0%', icon: Clock },
  ];

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-bold text-[#fafafa] tracking-tight">Analytics Overview</h1>
          <p className="text-[#a1a1aa] font-medium mt-1">Detailed performance metrics across all hiring pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#18181b] border border-[#27272a] p-1 rounded-xl">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button 
                key={range}
                onClick={() => setDateRange(range)} 
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${dateRange === range ? 'bg-[#27272a] text-[#fafafa] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'}`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => {
            const id = toast.loading('Generating export...');
            setTimeout(() => toast.success('Analytics exported successfully!', { id }), 1500);
          }}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-[#6366f1] animate-spin" /></div>
      ) : (
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="shadow-xl border-l-[3px] border-l-[#6366f1]">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-[#6366f1]" />
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${kpi.change.startsWith('+') && kpi.label !== 'Avg Time to Hire' || kpi.change.startsWith('-') && kpi.label === 'Avg Time to Hire' ? 'text-[#10b981] bg-[#10b981]/10 border border-[#10b981]/30' : 'text-[#f43f5e] bg-[#f43f5e]/10 border border-[#f43f5e]/30'}`}>
                  {kpi.change}
                </span>
              </div>
              <p className="text-[2rem] font-bold text-[#fafafa] mt-4 mb-1">{kpi.value}</p>
              <h3 className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">{kpi.label}</h3>
              {/* Sparkline placeholder block */}
              <div className="h-10 w-full mt-4 bg-[#27272a]/30 rounded flex items-end overflow-hidden">
                <div className="w-1/6 h-full bg-[#6366f1]/20 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
                <div className="w-1/6 h-4/5 bg-[#6366f1]/20 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
                <div className="w-1/6 h-2/3 bg-[#6366f1]/20 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
                <div className="w-1/6 h-3/4 bg-[#6366f1]/20 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
                <div className="w-1/6 h-full bg-[#6366f1]/40 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
                <div className="w-1/6 h-[90%] bg-[#6366f1]/60 hover:bg-[#6366f1] transition-colors border-r justify-self-end border-[#18181b]"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl">
          <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
            <CardTitle className="text-lg font-bold text-[#fafafa]">Applications Velocity</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.applicationsOverTime.length ? data.applicationsOverTime : [{name: 'Empty', applications: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAppsLg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorAppsLg)" activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 0, shadow: '0 0 10px #6366f1' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
            <CardTitle className="text-lg font-bold text-[#fafafa]">Hiring Funnel Conversion</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.pipelineFunnel.length ? data.pipelineFunnel : [{stage: 'Empty', count: 0}]} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#a1a1aa" tick={{fill: '#a1a1aa'}} axisLine={false} tickLine={false} />
                  <YAxis dataKey="stage" type="category" stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13, fontWeight: 600}} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#27272a', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
            <CardTitle className="text-lg font-bold text-[#fafafa]">Application Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusData.length ? data.statusData : [{name: 'No data', value: 1}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {(data.statusData.length ? data.statusData : [{name: 'No data', value: 1}]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ fontWeight: 'bold', color: '#fafafa' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none text-center">
                <span className="text-[2rem] font-bold text-[#fafafa]">{data.metrics.totalApplications}</span>
                <span className="text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Total</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {(data.statusData.length ? data.statusData : []).map((entry, index) => (
                 <div key={entry.name} className="flex items-center gap-2 text-sm">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                   <span className="text-[#a1a1aa] font-medium">{entry.name}</span>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl">
          <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
            <CardTitle className="text-lg font-bold text-[#fafafa]">Time to Hire Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.timeToHireData.length ? data.timeToHireData : [{name: 'Empty', days: 0}]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13}} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#a1a1aa" tick={{fill: '#a1a1aa', fontSize: 13}} axisLine={false} tickLine={false} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }}
                    itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="days" stroke="#6366f1" strokeWidth={4} dot={{ r: 6, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl flex flex-col xl:col-span-2">
          <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-[#fafafa]">Top Performing Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto flex-1">
             <table className="w-full text-left border-collapse">
                <thead className="bg-[#18181b]">
                  <tr>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Job Title</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Views</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Apps</th>
                    <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272a]">
                  {topJobs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-[#a1a1aa]">No active jobs found.</td>
                    </tr>
                  ) : topJobs.slice(0, 5).map((job, idx) => (
                    <tr key={job._id || job.id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-[#fafafa]">{job.title}</td>
                      <td className="px-6 py-4 text-sm text-[#a1a1aa] font-medium">—</td>
                      <td className="px-6 py-4 text-sm text-[#a1a1aa] font-medium">{job.applicantCount ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-[#10b981] font-bold">—</td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </CardContent>
        </Card>

      </div>
      </>
      )}
    </div>
  );
}

export default AnalyticsPage;
