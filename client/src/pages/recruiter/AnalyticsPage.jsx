import React, { useState } from 'react';
import { Download, TrendingUp, Users, Target, Clock, Activity, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { analyticsService, jobService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30D');
  const [data, setData] = useState({
    applicationsOverTime: [], pipelineFunnel: [], statusData: [], timeToHireData: [],
    metrics: { totalJobs: 0, totalApplications: 0, totalInterviews: 0, hired: 0, avgScore: 0 }
  });
  const [topJobs, setTopJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const [statsRes, overRes, funnelRes, topCandsRes, myJobsRes] = await Promise.all([
          analyticsService.getDashboardStats(), analyticsService.getApplicationsOverTime(),
          analyticsService.getFunnel(), analyticsService.getTopCandidates(), jobService.getMyJobs()
        ]);
        const funnelMap = funnelRes.success ? (funnelRes.data || {}) : {};
        const funnelOrder = ['applied', 'in-review', 'shortlisted', 'interviewing', 'offered', 'rejected'];
        const pipelineFunnel = funnelOrder.filter(k => (funnelMap[k] || 0) > 0 || Object.keys(funnelMap).length === 0)
          .map(k => ({ stage: k.replace(/-/g, ' '), count: funnelMap[k] || 0 }));
        const statusData = Object.entries(funnelMap).map(([name, value]) => ({ name: name.replace(/-/g, ' '), value }));
        const applicationsOverTime = (overRes.success ? overRes.data : []).map(row => ({ name: row.date, applications: row.count }));
        const topList = topCandsRes.success ? (topCandsRes.data || []) : [];
        const avgScore = topList.length ? Math.round(topList.reduce((a, x) => a + (x.aiScore || 0), 0) / topList.length) : 0;
        const metrics = statsRes.success ? { totalJobs: statsRes.data?.totalJobs ?? 0, totalApplications: statsRes.data?.totalApplications ?? 0, totalInterviews: statsRes.data?.totalInterviews ?? 0, hired: statsRes.data?.totalHired ?? 0, avgScore } : { totalJobs: 0, totalApplications: 0, totalInterviews: 0, hired: 0, avgScore: 0 };
        setData({ applicationsOverTime, pipelineFunnel: pipelineFunnel.length ? pipelineFunnel : [{ stage: 'No data', count: 0 }], statusData, timeToHireData: [], metrics });
        if (myJobsRes.success && Array.isArray(myJobsRes.data)) setTopJobs(myJobsRes.data);
      } catch (err) { toast.error(err?.response?.data?.message || 'Failed to fetch analytics'); }
      finally { setIsLoading(false); }
    };
    fetchAll();
  }, []);

  const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6'];

  const handleExportCSV = () => {
    const id = toast.loading('Generating export...');
    try {
      const rows = [['Metric', 'Value'], ['Total Jobs', data.metrics.totalJobs], ['Total Applications', data.metrics.totalApplications], ['Total Interviews', data.metrics.totalInterviews], ['Total Hired', data.metrics.hired], ['Avg Score', data.metrics.avgScore], [], ['Pipeline Stage', 'Count']];
      data.pipelineFunnel.forEach(s => rows.push([s.stage, s.count]));
      const csvContent = rows.map(e => e.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-export-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      toast.success('Analytics exported!', { id });
    } catch (err) { toast.error('Failed to generate export', { id }); }
  };

  const kpis = [
    { label: 'Total Jobs', value: data.metrics.totalJobs, icon: Activity, color: 'border-l-indigo-500', iconBg: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Applications', value: data.metrics.totalApplications, icon: Users, color: 'border-l-violet-500', iconBg: 'bg-violet-50 text-violet-600' },
    { label: 'Interviews Scheduled', value: data.metrics.totalInterviews, icon: Target, color: 'border-l-amber-500', iconBg: 'bg-amber-50 text-amber-600' },
    { label: 'Avg Candidate Score', value: data.metrics.avgScore, icon: Clock, color: 'border-l-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  ];

  const tooltipStyle = { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontWeight: 600, color: '#0f172a' };
  const gridStyle = { stroke: '#e2e8f0' };
  const tickStyle = { fill: '#64748b', fontSize: 13, fontWeight: 500 };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
          <p className="text-slate-500 font-medium mt-1">Detailed performance metrics across all hiring pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            {['7D', '30D', '90D', '1Y'].map(range => (
              <button key={range} onClick={() => setDateRange(range)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${dateRange === range ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold shadow-sm" onClick={handleExportCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-indigo-600 animate-spin" /></div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {kpis.map((kpi, i) => (
              <div key={i} className={`bg-white border border-slate-200 border-l-4 ${kpi.color} rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg ${kpi.iconBg} flex items-center justify-center p-2`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">{kpi.label}</p>
                </div>
                <p className="text-3xl font-bold text-slate-900 mb-3">{kpi.value}</p>
                {/* Sparkline */}
                <div className="h-8 w-full bg-slate-100 rounded flex items-end overflow-hidden gap-px">
                  {[0.4, 0.6, 0.5, 0.75, 0.85, 1.0].map((h, idx) => (
                    <div key={idx} className="flex-1 bg-indigo-200 rounded-t transition-all" style={{ height: `${h * 100}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Velocity */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-slate-900">Applications Velocity</CardTitle></CardHeader>
              <CardContent className="p-6 pt-8">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.applicationsOverTime.length ? data.applicationsOverTime : [{name:'Empty',applications:0}]} margin={{top:10,right:10,left:-20,bottom:0}}>
                      <defs><linearGradient id="appsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={tickStyle} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#64748b" tick={tickStyle} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#6366f1' }} />
                      <Area type="monotone" dataKey="applications" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#appsGrad)" activeDot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hiring Funnel */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-slate-900">Hiring Funnel Conversion</CardTitle></CardHeader>
              <CardContent className="p-6 pt-8">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.pipelineFunnel.length ? data.pipelineFunnel : [{stage:'Empty',count:0}]} layout="vertical" margin={{top:5,right:30,left:40,bottom:5}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} horizontal={true} vertical={false} />
                      <XAxis type="number" stroke="#64748b" tick={tickStyle} axisLine={false} tickLine={false} />
                      <YAxis dataKey="stage" type="category" stroke="#64748b" tick={{fill:'#64748b',fontSize:12,fontWeight:600}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill:'#f1f5f9'}} contentStyle={tooltipStyle} itemStyle={{ color: '#6366f1' }} />
                      <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Breakdown */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-slate-900">Application Status Breakdown</CardTitle></CardHeader>
              <CardContent className="p-6">
                <div className="h-[280px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.statusData.length ? data.statusData : [{name:'No data',value:1}]} cx="50%" cy="50%" innerRadius={75} outerRadius={105} paddingAngle={2} dataKey="value" stroke="none">
                        {(data.statusData.length ? data.statusData : [{name:'No data',value:1}]).map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ fontWeight: 'bold', color: '#0f172a' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none text-center">
                    <span className="text-3xl font-bold text-slate-900">{data.metrics.totalApplications}</span>
                    <span className="text-slate-400 text-xs font-bold tracking-wider uppercase mt-1">Total</span>
                  </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {(data.statusData.length ? data.statusData : []).map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2 text-sm">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-slate-500 font-medium capitalize">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time to Hire */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-slate-900">Time to Hire Trend</CardTitle></CardHeader>
              <CardContent className="p-6 pt-8">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.timeToHireData.length ? data.timeToHireData : [{name:'Empty',days:0}]} margin={{top:5,right:10,left:-20,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridStyle.stroke} vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" tick={tickStyle} axisLine={false} tickLine={false} dy={10} />
                      <YAxis stroke="#64748b" tick={tickStyle} axisLine={false} tickLine={false} dx={-10} />
                      <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#6366f1' }} />
                      <Line type="monotone" dataKey="days" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Jobs */}
            <Card className="shadow-sm border border-slate-200 bg-white lg:col-span-2">
              <CardHeader className="border-b border-slate-100 pb-4"><CardTitle className="text-lg font-bold text-slate-900">Top Performing Jobs</CardTitle></CardHeader>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      {['Job Title', 'Views', 'Apps', 'Conv. Rate'].map(h => (
                        <th key={h} className="px-6 py-3.5 text-slate-500 text-xs font-bold tracking-wider uppercase border-b border-slate-200 bg-slate-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {topJobs.length === 0 ? (
                      <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400 font-medium text-sm">No active jobs found.</td></tr>
                    ) : topJobs.slice(0, 5).map(job => (
                      <tr key={job._id || job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{job.title}</td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">—</td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-700">{job.applicantCount ?? 0}</td>
                        <td className="px-6 py-4 text-sm text-emerald-600 font-bold">—</td>
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
