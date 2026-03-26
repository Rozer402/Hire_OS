import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List } from 'lucide-react';
import { applicationService } from '../../services/api';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { Card, CardContent } from '../../components/ui/Card';
import { toast } from '../../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export function CandidatesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await applicationService.getApplications();
        if (!res.success) {
          setCandidates([]);
          return;
        }
        const apps = res.data || [];
        const map = new Map();
        for (const a of apps) {
          const c = a.candidate;
          if (!c?._id) continue;
          const score = a.aiScore ?? 0;
          const prev = map.get(c._id);
          if (!prev || score > (prev.score ?? 0)) {
            map.set(c._id, {
              id: c._id,
              name: c.name,
              email: c.email,
              avatar: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'User')}`,
              role: a.job?.title || 'Applicant',
              experience: c.experienceYears != null ? `${c.experienceYears} yrs` : '—',
              skills: Array.isArray(c.skills) ? c.skills : [],
              score: score || 0,
              location: '—',
              applicationId: a._id
            });
          }
        }
        setCandidates([...map.values()]);
      } catch (e) {
        console.error(e);
        toast.error(e?.response?.data?.message || 'Failed to load candidates');
        setCandidates([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredCandidates = useMemo(() => {
    return candidates.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [candidates, search]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-10 h-10 animate-spin text-[#6366f1]" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[2rem] font-bold text-[#fafafa] tracking-tight">Talent Pool</h1>
          <p className="text-[#a1a1aa] font-medium mt-1">Candidates from your job applications.</p>
        </div>
        <div className="flex items-center gap-3 bg-[#18181b] border border-[#27272a] p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('grid')} 
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#27272a] text-[#fafafa] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#27272a] text-[#fafafa] shadow-sm' : 'text-[#a1a1aa] hover:text-[#fafafa]'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-4 flex flex-col lg:flex-row gap-4 mb-8 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
          <input 
            type="text" 
            placeholder="Search by name or current role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] placeholder-[#71717a] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-[#27272a] rounded-[12px] text-[#a1a1aa]">
          No candidates yet. Applications to your jobs will appear here.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCandidates.map(candidate => (
            <Card key={candidate.id} className="hover:border-[#6366f1]/50 transition-colors group">
              <CardContent className="p-0">
                <div className="flex justify-between items-start mb-4">
                  <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full border-2 border-[#27272a] group-hover:border-[#6366f1] transition-colors" />
                  <ScoreRing score={candidate.score} size={48} strokeWidth={4} />
                </div>
                
                <h3 className="font-bold text-lg text-[#fafafa] group-hover:text-[#818cf8] transition-colors">{candidate.name}</h3>
                <p className="text-sm text-[#a1a1aa] font-medium mb-4">{candidate.role} • {candidate.experience}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(candidate.skills.length ? candidate.skills : ['—']).slice(0, 3).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">{skill}</Badge>
                  ))}
                  {candidate.skills.length > 3 && (
                    <Badge variant="secondary" className="text-[10px] px-2 py-0.5">+{candidate.skills.length - 3}</Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    type="button"
                    className="w-full text-xs h-9 bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                    onClick={() => candidate.applicationId && navigate(`/recruiter/applications/${candidate.applicationId}`)}
                  >
                    View application
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-[#18181b]">
              <tr>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Candidate Profile</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Current Role</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Top Skills</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Experience</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">AI Score</th>
                <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272a]">
              {filteredCandidates.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.03] transition-colors cursor-pointer group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full border border-[#3f3f46]" />
                      <div>
                        <p className="font-bold text-[#fafafa] group-hover:text-[#818cf8] transition-colors">{c.name}</p>
                        <p className="text-xs text-[#a1a1aa]">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#fafafa]">{c.role}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {(c.skills.length ? c.skills : ['—']).slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#a1a1aa] font-medium">{c.experience}</td>
                  <td className="px-6 py-4">
                    <div className="w-12 h-12">
                      <ScoreRing score={c.score} size={36} strokeWidth={3} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8"
                      onClick={() => c.applicationId && navigate(`/recruiter/applications/${c.applicationId}`)}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CandidatesPage;
