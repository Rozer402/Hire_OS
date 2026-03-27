import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { toast } from '../../components/ui/Toast';

export function LoginPage() {
  const [role, setRole] = useState('Recruiter');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const isRecruiter = role === 'Recruiter';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    try {
      setIsLoading(true);
      await login({ email, password, role: role.toLowerCase() });
      toast.success('Logged in successfully');
      navigate(isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-medium text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10 group">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md group-hover:bg-indigo-700 transition-colors">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">HireOS</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Welcome back</h1>
          <p className="text-slate-500 font-medium text-sm text-center mb-8">Sign in to your HireOS account</p>

          {/* Role Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-8 border border-slate-200">
            {['Recruiter', 'Candidate'].map(r => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${role === r ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-0.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="name@company.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} tracking-widest`} placeholder="••••••••" required />
              </div>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-70">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Register now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
