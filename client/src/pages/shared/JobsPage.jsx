import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, Loader2 } from 'lucide-react';
import { getJobs } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`} className="card hover:border-gray-700 transition-all block group p-5 bg-[#18181b] border border-[#27272a] rounded-2xl">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">{job.title}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{job.company || job.postedBy?.company || 'Company'}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${job.type === 'remote' ? 'badge-green' : 'badge-blue'}`}>{job.type}</span>
      </div>

      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{job.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {job.skills?.slice(0, 4).map(skill => (
          <span key={skill} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-md">{skill}</span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.applicantCount || 0} applicants</span>
        {(job.salaryMin != null || job.salary?.min != null) && (
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {job.salaryMin != null ? `${job.salaryMin}k-${job.salaryMax}k` : `${job.salary.min / 1000}k-${job.salary.max / 1000}k`}
          </span>
        )}
      </div>

      {job.aiAnalysis?.biasFlags?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <span className="text-xs text-yellow-400">⚠️ AI flagged {job.aiAnalysis.biasFlags.length} potential bias issue(s)</span>
        </div>
      )}
    </Link>
  );
}

export function JobsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [experience, setExperience] = useState('');
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const { data } = await getJobs();
        
        const jobs = data?.data?.jobs || data?.data || data?.jobs || data || [];
        setJobs(jobs);
        setPagination(data?.pagination || null);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchTxt = search.toLowerCase();
      const matchSearch = search ? (
        job.title?.toLowerCase().includes(searchTxt) || 
        job.company?.toLowerCase().includes(searchTxt) || 
        job.postedBy?.company?.toLowerCase().includes(searchTxt)
      ) : true;
      
      const matchType = type ? (job.type?.toLowerCase() === type.toLowerCase() || (type === 'all' && true)) : true;
      
      let matchExp = true;
      if (experience && experience !== '') {
        const expJob = (job.experienceLevel || '').toLowerCase();
        const expFilter = experience.toLowerCase();
        matchExp = expJob.includes(expFilter.split('-')[0]) || expJob === expFilter;
      }

      return matchSearch && matchType && matchExp;
    });
  }, [jobs, search, type, experience]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Browse Jobs</h1>
        <p className="text-gray-400">Find your next opportunity — AI matches your skills automatically when you apply.</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full bg-[#18181b] border-[#27272a] text-white" placeholder="Search jobs, companies, skills..." />
        </div>
        <select value={type} onChange={e => setType(e.target.value)} className="input w-auto bg-[#18181b] border-[#27272a] text-white">
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
          <option value="part-time">Part-time</option>
        </select>
        <select value={experience} onChange={e => setExperience(e.target.value)} className="input w-auto bg-[#18181b] border-[#27272a] text-white">
          <option value="">All Experience</option>
          <option value="Entry-Level">Entry-Level</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-400 mb-4">{filteredJobs.length} jobs found</div>
          <div className="grid md:grid-cols-2 gap-4">
            {filteredJobs.length ? (
              filteredJobs.map(job => <JobCard key={job._id} job={job} />)
            ) : jobs.length > 0 ? (
              <div className="col-span-2 text-center py-16 text-gray-400 border border-dashed border-gray-700 rounded-2xl">
                No jobs match your search
              </div>
            ) : (
              <div className="col-span-2 text-center py-16 text-gray-400 border border-dashed border-gray-700 rounded-2xl">
                No jobs posted yet
              </div>
            )}
          </div>
          {pagination?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(pagination?.pages)].map((_, i) => (
                <button key={i} onClick={() => setPage(i+1)}
                  className={`w-8 h-8 rounded-lg text-sm ${page === i+1 ? 'bg-[#6366f1] text-white' : 'bg-[#18181b] text-gray-400 border border-[#27272a] hover:bg-[#27272a]'}`}>
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobsPage;
