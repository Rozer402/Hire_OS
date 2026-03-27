import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Grid, List, Loader2 } from 'lucide-react';
import { applicationService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { ScoreRing } from '../../components/ui/ScoreRing';
import { toast } from '../../components/ui/Toast';

const thClass = "px-6 py-3.5 text-slate-500 text-xs font-bold tracking-wider uppercase text-left border-b border-slate-200 bg-slate-50";

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
        if (!res.success) { setCandidates([]); return; }
        const apps = res.data || [];
        const map = new Map();
        for (const a of apps) {
          const c = a.candidate;
          if (!c?._id) continue;
          const score = a.aiScore ?? 0;
          const prev = map.get(c._id);
          if (!prev || score > (prev.score ?? 0)) {
            map.set(c._id, {
              id: c._id, name: c.name, email: c.email,
              avatar: c.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name || 'User')}`,
              role: a.job?.title || 'Applicant',
              experience: c.experienceYears != null ? `${c.experienceYears} yrs` : '—',
              skills: Array.isArray(c.skills) ? c.skills : [],
              score: score || 0, location: '—', applicationId: a._id
            });
          }
        }
        setCandidates([...map.values()]);
      } catch (e) {
        toast.error(e?.response?.data?.message || 'Failed to load candidates');
        setCandidates([]);
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const filteredCandidates = useMemo(() =>
    candidates.filter(c =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
    ), [candidates, search]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  // Color initials background based on first letter
  const avatarBg = (name) => {
    const colors = ['bg-indigo-100 text-indigo-700','bg-violet-100 text-violet-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700','bg-rose-100 text-rose-700','bg-sky-100 text-sky-700'];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Talent Pool</h1>
          <p className="text-slate-500 font-medium mt-1">Candidates from your job applications.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
          {[{ mode: 'grid', Icon: Grid }, { mode: 'list', Icon: List }].map(({ mode, Icon }) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${viewMode === mode ? 'bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100' : 'text-slate-400 hover:text-slate-700'}`}>
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 mb-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search by name, role or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" />
        </div>
      </div>

      {filteredCandidates.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-slate-200 rounded-xl bg-white text-slate-400 font-medium">
          No candidates yet. Applications to your jobs will appear here.
        </div>
      ) : viewMode === 'grid' ? (
        /* ─── Grid View ─── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCandidates.map(candidate => (
            <div key={candidate.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                {candidate.avatar && !candidate.avatar.includes('ui-avatars') ? (
                  <img src={candidate.avatar} alt={candidate.name} className="w-14 h-14 rounded-full border border-slate-200 object-cover" />
                ) : (
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${avatarBg(candidate.name)}`}>
                    {candidate.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <ScoreRing score={candidate.score} size={44} strokeWidth={4} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{candidate.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-3">{candidate.role} · {candidate.experience}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(candidate.skills.length ? candidate.skills : ['—']).slice(0, 3).map((skill, i) => (
                  <span key={i} className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">{skill}</span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">+{candidate.skills.length - 3}</span>
                )}
              </div>
              <Button type="button" className="w-full text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm"
                onClick={() => candidate.applicationId && navigate(`/recruiter/applications/${candidate.applicationId}`)}>
                View Application
              </Button>
            </div>
          ))}
        </div>
      ) : (
        /* ─── List View ─── */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr>
                  <th className={thClass}>Candidate</th>
                  <th className={thClass}>Current Role</th>
                  <th className={thClass}>Top Skills</th>
                  <th className={thClass}>Experience</th>
                  <th className={thClass}>AI Score</th>
                  <th className={`${thClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.avatar && !c.avatar.includes('ui-avatars') ? (
                          <img src={c.avatar} alt={c.name} className="w-9 h-9 rounded-full border border-slate-200 object-cover" />
                        ) : (
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${avatarBg(c.name)}`}>{c.name?.charAt(0).toUpperCase()}</div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{c.role}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {(c.skills.length ? c.skills : ['—']).slice(0, 2).map((skill, i) => (
                          <span key={i} className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full">{skill}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{c.experience}</td>
                    <td className="px-6 py-4"><ScoreRing score={c.score} size={36} strokeWidth={3} /></td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" className="h-8 border-slate-200 text-indigo-600 hover:bg-indigo-50 font-semibold"
                        onClick={() => c.applicationId && navigate(`/recruiter/applications/${c.applicationId}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidatesPage;
