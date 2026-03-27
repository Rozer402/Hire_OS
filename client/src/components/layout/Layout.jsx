import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuthStore } from '../../hooks/useAuthStore';

export function Layout() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Uncomment to enforce auth, but since we're using dummy data right now, let's keep it accessible
  // if (!user) {
  //  return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden relative bg-slate-50">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-slate-50">
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
