import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    try {
      setIsLoading(true);
      const res = await authService.forgotPassword({ email });
      if (res.success) {
        toast.success('Password reset email sent');
        setIsSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request password reset');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden py-12 px-4 selection:bg-[#6366f1]/30 selection:text-[#fafafa]">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full blur-[150px] mix-blend-screen opacity-20 bg-[#6366f1]"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <Link to="/" className="text-3xl font-extrabold text-[#fafafa] tracking-tight mb-2">HireOS</Link>
          <p className="text-[#a1a1aa] font-medium text-base text-center">Account Recovery</p>
        </div>

        <div className="bg-[#18181b]/80 backdrop-blur-xl border border-[#27272a] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          {!isSent ? (
            <form onSubmit={handleRequestToken} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#a1a1aa] ml-1 uppercase tracking-[0.05em]">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#6366f1]/40 group-focus-within:text-[#6366f1] transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner focus:border-[#6366f1]"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] flex items-center justify-center text-white transition-all shadow-xl"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-[#6366f1]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-[#6366f1]" />
              </div>
              <h3 className="text-xl font-bold text-[#fafafa]">Check your email</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                We sent a password reset link to <span className="text-white font-medium">{email}</span>. This link will expire in 15 minutes.
              </p>
            </div>
          )}

          <div className="mt-8 text-center">
             <Link to="/login" className="text-sm text-[#a1a1aa] hover:text-[#fafafa] font-medium transition-colors hover:underline">Return to login screen</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
