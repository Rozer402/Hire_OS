import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Building2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { authService } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
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
        <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center text-[#a1a1aa]">
        Sign in to view your profile.
      </div>
    );
  }

  const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#fafafa] mb-1">Profile</h1>
        <p className="text-[#a1a1aa] text-sm">Your account information from HireOS.</p>
      </div>

      <Card className="border-[#27272a] bg-[#18181b]">
        <CardHeader className="border-b border-[#27272a]">
          <CardTitle className="text-[#fafafa] text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-[#6366f1]" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col sm:flex-row gap-6">
          <img src={avatarSrc} alt="" className="w-24 h-24 rounded-2xl border border-[#27272a] object-cover shrink-0" />
          <div className="space-y-4 flex-1 min-w-0">
            <div>
              <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-1">Name</p>
              <p className="text-[#fafafa] font-medium">{user.name}</p>
            </div>
            <div className="flex items-start gap-2 text-[#a1a1aa]">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" />
              <span className="text-sm break-all">{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[#a1a1aa]">
              <Briefcase className="w-4 h-4 shrink-0" />
              <span className="text-sm capitalize">{user.role || '—'}</span>
            </div>
            {user.role === 'recruiter' && (user.company || user.companySize) && (
              <div className="flex items-start gap-2 text-[#a1a1aa]">
                <Building2 className="w-4 h-4 mt-0.5 shrink-0" />
                <div className="text-sm">
                  {user.company && <p className="text-[#fafafa] font-medium">{user.company}</p>}
                  {user.companySize && <p className="text-xs mt-0.5">{user.companySize} employees</p>}
                </div>
              </div>
            )}
            {user.role === 'candidate' && Array.isArray(user.skills) && user.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">Skills</p>
                <p className="text-sm text-[#fafafa]">{user.skills.join(', ')}</p>
              </div>
            )}
            {(user.phone || user.linkedIn || user.github) && (
              <div className="pt-4 border-t border-[#27272a] space-y-3">
                <p className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider mb-2">Contact & Links</p>
                {user.phone && <div className="text-sm text-[#fafafa] font-medium">{user.phone}</div>}
                {user.linkedIn && <div><a href={user.linkedIn} target="_blank" rel="noreferrer" className="text-sm text-[#6366f1] hover:underline">LinkedIn Profile</a></div>}
                {user.github && <div><a href={user.github} target="_blank" rel="noreferrer" className="text-sm text-[#6366f1] hover:underline">GitHub Profile</a></div>}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilePage;
