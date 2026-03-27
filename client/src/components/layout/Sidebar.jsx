import React from 'react';
import { NavLink } from 'react-router-dom';
import { Briefcase, Users, LayoutDashboard, FileText, Calendar, TrendingUp, Settings, UserCircle } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import clsx from 'clsx';

export function Sidebar() {
  const { user } = useAuthStore();

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/recruiter/post-job', icon: FileText, label: 'Post a Job' },
    { to: '/recruiter/applications', icon: Briefcase, label: 'Applications' },
    { to: '/recruiter/candidates', icon: Users, label: 'Candidates' },
    { to: '/recruiter/interviews', icon: Calendar, label: 'Interviews' },
    { to: '/recruiter/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
    { to: '/recruiter/settings', icon: Settings, label: 'Settings' }
  ];

  const candidateLinks = [
    { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
    { to: '/candidate/applications', icon: FileText, label: 'My Applications' },
    { to: '/candidate/interviews', icon: Calendar, label: 'My Interviews' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const links = user?.role === 'recruiter' ? recruiterLinks : (user?.role === 'candidate' ? candidateLinks : []);

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-slate-200 shrink-0 relative z-20 justify-between">
      <div>
        <div className="flex h-16 items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2 text-indigo-600">
            <Briefcase className="h-6 w-6" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">HireOS</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/recruiter/dashboard' || link.to === '/candidate/dashboard' || link.to === '/profile'}
                className={({ isActive }) =>
                  clsx(
                    "group flex items-center rounded-r-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 border-l-[3px]",
                    isActive
                      ? "bg-indigo-50 text-indigo-600 border-indigo-600 font-semibold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-transparent"
                  )
                }
              >
                <link.icon className="mr-3 h-5 w-5 flex-shrink-0 transition-colors" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {user && (
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 w-full bg-slate-50 p-3 rounded-xl border border-slate-200 cursor-pointer hover:shadow-md transition-all duration-200">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`} 
              alt="Avatar" 
              className="w-10 h-10 rounded-full border border-slate-200 shrink-0 bg-white" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 font-medium capitalize truncate">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
