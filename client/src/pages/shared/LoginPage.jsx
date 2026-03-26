import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../hooks/useAuthStore';
import { toast } from '../../components/ui/Toast';

export function LoginPage() {
  const [role, setRole] = useState('Recruiter'); // 'Recruiter' or 'Candidate'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const isRecruiter = role === 'Recruiter';
  const activeColor = isRecruiter ? 'primary' : 'accent';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden py-12 px-4 selection:bg-[#6366f1]/30 selection:text-[#fafafa]">
      {/* Subtle Animated Gradient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className={`absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[150px] mix-blend-screen opacity-20 transition-all duration-[2000ms] ease-in-out animate-pulse ${isRecruiter ? 'bg-[#6366f1]' : 'bg-[#8b5cf6]'}`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] rounded-full blur-[150px] mix-blend-screen opacity-10 transition-all duration-[2000ms] ease-in-out ${isRecruiter ? 'bg-[#8b5cf6]' : 'bg-[#6366f1]'}`}></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-10">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className={`p-2.5 rounded-2xl transition-all duration-700 shadow-lg ${isRecruiter ? 'bg-[#6366f1]/10 text-[#6366f1] shadow-[#6366f1]/15 group-hover:bg-[#6366f1]/20' : 'bg-[#8b5cf6]/10 text-[#8b5cf6] shadow-[#8b5cf6]/15 group-hover:bg-[#8b5cf6]/20'}`}>
              <Brain className="h-9 w-9" />
            </div>
            <span className="text-4xl font-extrabold text-[#fafafa] tracking-tight">HireOS</span>
          </Link>
          <p className="text-[#a1a1aa] font-medium text-base text-center max-w-[260px] leading-relaxed">Let's build something great together.</p>
        </div>

        {/* Card */}
        <div className="bg-[#18181b]/80 backdrop-blur-xl border border-[#27272a] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          
          {/* Role Toggle */}
          <div className="flex p-1.5 bg-[#09090b]/80 rounded-2xl mb-10 border border-[#27272a] shadow-inner">
            <button
              onClick={(e) => { e.preventDefault(); setRole('Recruiter'); }}
              className={`flex-1 py-3 text-[0.75rem] uppercase tracking-[0.05em] font-bold rounded-xl transition-all duration-300 ${isRecruiter ? 'bg-[#18181b] text-[#fafafa] shadow-md border border-[#3f3f46]' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50 border border-transparent'}`}
            >
              Recruiter
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setRole('Candidate'); }}
              className={`flex-1 py-3 text-[0.75rem] uppercase tracking-[0.05em] font-bold rounded-xl transition-all duration-300 ${!isRecruiter ? 'bg-[#18181b] text-[#fafafa] shadow-md border border-[#3f3f46]' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-[#18181b]/50 border border-transparent'}`}
            >
              Candidate
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-[#a1a1aa] ml-1 uppercase tracking-[0.05em]">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-12 pr-4 py-4 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-base ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`}
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em]">Password</label>
                <Link to="/forgot-password" className={`text-xs font-bold hover:underline transition-colors ${activeColor === 'primary' ? 'text-[#6366f1] hover:text-[#818cf8]' : 'text-[#8b5cf6] hover:text-[#a78bfa]'}`}>Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-12 pr-4 py-4 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-base tracking-widest ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
               <button
                 type="submit"
                 disabled={isLoading}
                 className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 text-white shadow-xl ${
                   activeColor === 'primary' 
                   ? 'bg-[#6366f1] hover:bg-[#4f46e5] shadow-[#6366f1]/20 group' 
                   : 'bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-[#8b5cf6]/20 group'
                 }`}
               >
                 {isLoading ? (
                   <Loader2 className="h-6 w-6 animate-spin" />
                 ) : (
                   <>Sign in to HireOS <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-[#a1a1aa] font-medium">
              Don't have an account?{' '}
              <Link to="/register" className={`font-bold hover:underline transition-colors ${activeColor === 'primary' ? 'text-[#6366f1] hover:text-[#818cf8]' : 'text-[#8b5cf6] hover:text-[#a78bfa]'}`}>
                Register now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
