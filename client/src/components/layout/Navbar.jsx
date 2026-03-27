import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, ChevronDown, User as UserIcon, Settings, Home } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { NotificationsPopover } from './NotificationsPopover';

export function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all border-none bg-transparent cursor-pointer font-medium text-sm mr-2"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </button>
        <button 
          onClick={() => navigate('/#features')}
          className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer mr-6"
        >
          Features
        </button>
        <div className="w-full max-w-md relative flex items-center">
          <Search className="absolute left-3 text-slate-400 h-4 w-4" />
          <input 
            type="text"
            placeholder="Search jobs, candidates..."
            className="w-full bg-slate-100 border border-slate-200 text-sm text-slate-900 placeholder-slate-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && <NotificationsPopover />}

        {user && (
          <div className="relative">
            <button 
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pl-3 pr-2 hover:bg-slate-50 transition-all duration-200 focus:outline-none cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="text-sm font-semibold text-slate-700 hidden sm:block cursor-pointer">{user.name?.split(' ')[0]}</span>
              <img src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}`} alt="Avatar" className="w-7 h-7 rounded-full border border-slate-200 bg-slate-100 cursor-pointer" />
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 cursor-pointer ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-slate-100 mb-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{user.email}</p>
                </div>
                <button type="button" className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 cursor-pointer" onClick={() => { setDropdownOpen(false); navigate('/profile'); }}>
                  <UserIcon className="mr-3 h-4 w-4 text-slate-400 cursor-pointer" /> Profile
                </button>
                <button type="button" className="flex w-full items-center px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 cursor-pointer" onClick={() => { setDropdownOpen(false); navigate(user?.role === 'recruiter' ? '/recruiter/settings' : '/profile'); }}>
                  <Settings className="mr-3 h-4 w-4 text-slate-400 cursor-pointer" /> Settings
                </button>
                <div className="my-1 border-t border-slate-100"></div>
                <button 
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex w-full items-center px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="mr-3 h-4 w-4 cursor-pointer" /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
