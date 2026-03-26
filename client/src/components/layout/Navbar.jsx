import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, LogOut, ChevronDown, User as UserIcon, Settings } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#27272a] bg-[#18181b] px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="w-full max-w-sm relative flex items-center">
          <Search className="absolute left-3 text-[#a1a1aa] h-4 w-4" />
          <input 
            type="text"
            placeholder="Search jobs, candidates..."
            className="w-full bg-[#27272a] border border-[#3f3f46] text-sm text-[#fafafa] placeholder-[#71717a] rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-onyx-400 hover:text-onyx-50 transition-colors rounded-full hover:bg-onyx-800 focus:outline-none">
          <Bell className="h-5 w-5" />
          {user?.role === 'recruiter' && (
            <span className="absolute top-1 right-2 h-2.5 w-2.5 rounded-full bg-status-danger ring-2 ring-onyx-900"></span>
          )}
        </button>

        {user && (
          <div className="relative">
            <button 
              className="flex items-center gap-2 rounded-full border border-onyx-800 bg-onyx-800/50 p-1 pl-3 pr-2 hover:bg-onyx-700 transition-colors focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-sm font-medium text-onyx-100 hidden sm:block">{user.name?.split(' ')[0]}</span>
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`} alt="Avatar" className="w-7 h-7 rounded-full border border-onyx-700 bg-onyx-800" />
              <ChevronDown className={`w-4 h-4 text-onyx-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-onyx-800 bg-onyx-900 shadow-2xl overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-onyx-800/80 mb-1">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-onyx-400 truncate">{user.email}</p>
                </div>
                <button type="button" className="flex w-full items-center px-4 py-2 text-sm text-onyx-300 hover:bg-onyx-800 transition-colors" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  <UserIcon className="mr-3 h-4 w-4 text-onyx-400" /> Profile
                </button>
                <button type="button" className="flex w-full items-center px-4 py-2 text-sm text-onyx-300 hover:bg-onyx-800 transition-colors" onClick={() => { setDropdownOpen(false); navigate(user?.role === 'recruiter' ? '/recruiter/settings' : '/profile'); }}>
                  <Settings className="mr-3 h-4 w-4 text-onyx-400" /> Settings
                </button>
                <div className="my-1 border-t border-onyx-800/80"></div>
                <button 
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-status-danger hover:bg-onyx-800 transition-colors"
                >
                  <LogOut className="mr-3 h-4 w-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
