import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Key, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export function ResetPasswordPage() {
  const token = new URLSearchParams(window.location.search).get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Invalid or missing reset token. Please request a new one.');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (!newPassword || !confirmPassword) return toast.error('Please fill in all fields');

    try {
      setIsLoading(true);
      const res = await authService.resetPassword({ token, newPassword });
      if (res.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] px-4">
         <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Invalid Request</h2>
            <p className="text-[#a1a1aa] mb-6">No reset token found in the URL parameter.</p>
            <Link to="/forgot-password" className="text-[#6366f1] hover:underline font-medium">Request a new link</Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden py-12 px-4 selection:bg-[#6366f1]/30 selection:text-[#fafafa]">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full blur-[150px] mix-blend-screen opacity-20 bg-[#6366f1]"></div>
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center justify-center mb-10">
          <Link to="/" className="text-3xl font-extrabold text-[#fafafa] tracking-tight mb-2">HireOS</Link>
          <p className="text-[#a1a1aa] font-medium text-base text-center">Set New Password</p>
        </div>

        <div className="bg-[#18181b]/80 backdrop-blur-xl border border-[#27272a] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          {!isSuccess ? (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#a1a1aa] ml-1 uppercase tracking-[0.05em]">New Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-[#6366f1]/40 group-focus-within:text-[#6366f1] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] focus:outline-none focus:border-[#6366f1] tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[0.75rem] font-bold text-[#a1a1aa] ml-1 uppercase tracking-[0.05em]">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-[#6366f1]/40 group-focus-within:text-[#6366f1] transition-colors" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] focus:outline-none focus:border-[#6366f1] tracking-widest"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-bold rounded-2xl bg-[#6366f1] hover:bg-[#4f46e5] flex items-center justify-center text-white transition-all shadow-xl"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-[#fafafa]">Password Updated</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">
                Your password has been successfully reset. Redirecting to login...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
