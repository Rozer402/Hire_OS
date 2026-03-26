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
    <div className="flex h-screen w-64 flex-col bg-[#18181b] border-r border-[#27272a] shrink-0 relative z-20">
      <div className="flex h-16 items-center px-6 border-b border-[#27272a]">
        <div className="flex items-center gap-2 text-[#6366f1]">
          <Briefcase className="h-6 w-6" />
          <span className="text-xl font-bold text-[#fafafa]">HireOS</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/recruiter/dashboard' || link.to === '/candidate/dashboard' || link.to === '/profile'}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#6366f1]/12 text-[#6366f1] border-r-2 border-[#6366f1]"
                    : "text-[#a1a1aa] hover:bg-white/[0.03] hover:text-[#fafafa] border-r-2 border-transparent"
                )
              }
            >
              <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
