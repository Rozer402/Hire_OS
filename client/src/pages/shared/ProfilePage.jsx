import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Building2, Loader2, Phone, Github, Linkedin } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { authService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export function ProfilePage() {
  const { user: storeUser } = useAuthStore();
  const [user, setUser] = useState(storeUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await authService.getMe();
        if (!cancelled && res?.success && res.data) {
          setUser(res.data);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(e?.response?.data?.message || 'Could not load profile');
          setUser(storeUser);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [storeUser]);

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-slate-500 font-medium">
        Sign in to view your profile.
      </div>
    );
  }

  const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">My Profile</h1>
        <p className="text-slate-500 font-medium text-sm">Your account information on HireOS.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-6 items-start">
          <img src={avatarSrc} alt="Avatar" className="w-24 h-24 rounded-2xl border border-slate-200 object-cover shrink-0 shadow-sm" />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h2>
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full capitalize">{user.role}</span>
            {user.role === 'recruiter' && user.company && (
              <div className="flex items-center gap-2 mt-3 text-slate-600">
                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-sm font-semibold">{user.company}</span>
                {user.companySize && <span className="text-xs text-slate-400 font-medium">· {user.companySize} employees</span>}
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email</p>
                <p className="text-sm text-slate-900 font-medium break-all">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Phone</p>
                  <p className="text-sm text-slate-900 font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {user.linkedIn && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Linkedin className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">LinkedIn</p>
                  <a href={user.linkedIn} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-medium hover:underline">View Profile</a>
                </div>
              </div>
            )}

            {user.github && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Github className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">GitHub</p>
                  <a href={user.github} target="_blank" rel="noreferrer" className="text-sm text-indigo-600 font-medium hover:underline">View Profile</a>
                </div>
              </div>
            )}
          </div>

          {user.role === 'candidate' && Array.isArray(user.skills) && user.skills.length > 0 && (
            <div className="pt-5 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(s => (
                  <span key={s} className="text-sm font-semibold bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
