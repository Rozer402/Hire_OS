import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Briefcase, Filter, Loader2, Building, ChevronLeft, ChevronRight, Users, ChevronRight as ArrowIcon } from 'lucide-react';
import { getJobs } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

function JobCard({ job }) {
  const shortDesc = job.description && job.description.length > 120 
    ? job.description.slice(0, 120) + '...' 
    : job.description;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 cursor-pointer">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <Link to={`/jobs/${job._id}`} className="block group">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">{job.title}</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">{job.company || job.postedBy?.company || 'Confidential Company'}</p>
          </Link>
          
          <div className="flex flex-wrap gap-2 mt-3">
             <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md capitalize">{job.type}</span>
             {job.location && (
               <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
             )}
             {(job.salaryMin != null || job.salary?.min != null) && (
               <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 flex items-center gap-1">
                 <DollarSign className="w-3 h-3"/>
                 {job.salaryMin != null ? `${job.salaryMin}k - ${job.salaryMax}k` : `${job.salary?.min / 1000}k - ${job.salary?.max / 1000}k`}
               </span>
             )}
          </div>
          
          <p className="text-sm text-slate-500 mt-4 leading-relaxed">{shortDesc}</p>
        </div>
        
        <div className="flex flex-col items-end justify-between shrink-0 h-full mt-2 md:mt-0">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
             <Clock className="w-3 h-3"/> {formatDistanceToNow(new Date(job.createdAt))} ago
          </span>
          <Link to={`/jobs/${job._id}`} className="mt-8 md:mt-auto inline-block">
             <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap">
               Apply Now
             </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse">
       <div className="flex justify-between items-start mb-4">
         <div className="w-full">
           <div className="h-6 bg-slate-200 rounded-md w-1/2 mb-2"></div>
           <div className="h-4 bg-slate-100 rounded-md w-1/3"></div>
         </div>
         <div className="h-4 w-16 bg-slate-100 rounded-md shrink-0"></div>
       </div>
       <div className="flex gap-2 mb-4">
         {[1, 2, 3].map(i => <div key={i} className="h-6 w-20 bg-slate-100 rounded-md"></div>)}
       </div>
       <div className="space-y-2 mb-4">
         <div className="h-4 bg-slate-100 rounded-md w-full"></div>
         <div className="h-4 bg-slate-100 rounded-md w-5/6"></div>
       </div>
       <div className="flex justify-end mt-4">
         <div className="h-9 w-24 bg-slate-200 rounded-lg"></div>
       </div>
    </div>
  );
}

export function JobsPage() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [experience, setExperience] = useState('All');
  const [page, setPage] = useState(1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async (currentPage = 1) => {
    try {
      setIsLoading(true);
      
      const queryParams = { page: currentPage, limit: 10 };
      if (search) queryParams.search = search;
      if (type && type !== 'All') queryParams.type = type.toLowerCase();
      // Experience filtering could technically be appended to the search string or custom param if backend supports.
      // Assuming naive match or just visual filter for now.
      if (experience && experience !== 'All') queryParams.experience = experience.toLowerCase();

      const { data } = await getJobs(queryParams);
      
      const fetchedJobs = data?.data?.jobs || data?.data || data?.jobs || data || [];
      setJobs(fetchedJobs);
      setPagination(data?.data?.pagination || data?.pagination || null);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, experience]); 

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); 
    fetchJobs(1);
  };

  return (
    <div className="max-w-[1000px] mx-auto p-4 md:p-8">
      
      <form onSubmit={handleSearchSubmit} className="mb-6 space-y-4">
        {/* Row 1: Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-base placeholder:text-slate-400" 
            placeholder="Search by job title, skill, or keyword..." 
          />
        </div>

        {/* Row 2: Inline Pill Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <span className="text-sm font-semibold text-slate-500 shrink-0 uppercase tracking-wider">Type:</span>
            {['All', 'Full-time', 'Contract', 'Part-time', 'Remote'].map(t => (
              <button 
                key={t}
                type="button"
                onClick={() => { setType(t); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${type === t ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="hidden md:block w-px h-6 bg-slate-200"></div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <span className="text-sm font-semibold text-slate-500 shrink-0 uppercase tracking-wider">Level:</span>
            {['All', 'Entry', 'Mid', 'Senior', 'Lead'].map(l => (
              <button 
                key={l}
                type="button"
                onClick={() => { setExperience(l); setPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${experience === l ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Results Matrix */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(n => <JobCardSkeleton key={n} />)}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Recommended Jobs</h2>
            <span className="text-sm text-slate-500 font-medium">{pagination?.total || jobs.length} matched</span>
          </div>
          
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map(job => <JobCard key={job._id} job={job} />)
            ) : (
              <div className="text-center py-20 border border-slate-200 rounded-xl bg-white shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs found</h3>
                <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                <button type="button" onClick={() => { setSearch(''); setType('All'); setExperience('All'); fetchJobs(1); }} className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">Clear all filters</button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {pagination?.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-1.5">
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i} onClick={() => setPage(i+1)}
                    className={`min-w-[40px] h-10 px-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${page === i+1 ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'}`}>
                    {i+1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-slate-200 cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default JobsPage;
