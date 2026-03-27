import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Mail, Lock, Loader2, ArrowRight, User, Building2, Users2, Check } from 'lucide-react';
import { useAuthStore } from '../../hooks/useAuthStore';
import { toast } from '../../components/ui/Toast';

export function RegisterPage() {
  const [role, setRole] = useState('Recruiter');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', company: '', companySize: '', terms: false });
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const isRecruiter = role === 'Recruiter';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const calculateStrength = (pass) => {
    let s = 0;
    if (pass.length > 5) s++;
    if (pass.length > 8) s++;
    if (/[A-Z]/.test(pass)) s++;
    if (/[0-9]/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = calculateStrength(formData.password);
  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'];
  const strengthText = ['—', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthTextColors = ['text-slate-400', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-emerald-600', 'text-emerald-600'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.terms) {
      toast.error('Please fill in all required fields and accept terms'); return;
    }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (isRecruiter && (!formData.company || !formData.companySize)) { toast.error('Company details are required for recruiters'); return; }
    try {
      setIsLoading(true);
      const payload = { name: formData.name, email: formData.email, password: formData.password, role: role.toLowerCase() };
      if (isRecruiter) { payload.company = formData.company; payload.companySize = formData.companySize; }
      await registerUser(payload);
      toast.success('Account created successfully!');
      navigate(isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-medium text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-[520px]">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8 group">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-md group-hover:bg-indigo-700 transition-colors">
            <Briefcase className="h-6 w-6" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">HireOS</span>
        </Link>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900 mb-1 text-center">Create your account</h1>
          <p className="text-slate-500 font-medium text-sm text-center mb-8">Join the HireOS platform today</p>

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div onClick={() => setRole('Recruiter')} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all duration-200 relative ${isRecruiter ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
              {isRecruiter && <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white"/></div>}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${isRecruiter ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><Briefcase className="w-5 h-5" /></div>
              <h3 className={`font-bold text-sm mb-0.5 ${isRecruiter ? 'text-indigo-700' : 'text-slate-600'}`}>I want to hire</h3>
              <p className="text-xs text-slate-400 font-medium">Find top talent</p>
            </div>
            <div onClick={() => setRole('Candidate')} className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center text-center transition-all duration-200 relative ${!isRecruiter ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
              {!isRecruiter && <div className="absolute top-2.5 right-2.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white"/></div>}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${!isRecruiter ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}><User className="w-5 h-5" /></div>
              <h3 className={`font-bold text-sm mb-0.5 ${!isRecruiter ? 'text-indigo-700' : 'text-slate-600'}`}>I want a job</h3>
              <p className="text-xs text-slate-400 font-medium">Find opportunities</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
              <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" required /></div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="name@company.com" required /></div>
            </div>

            {isRecruiter && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</label>
                  <div className="relative"><Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="text" name="company" value={formData.company} onChange={handleChange} className={inputClass} placeholder="Acme Corp" required={isRecruiter} /></div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Size</label>
                  <div className="relative">
                    <Users2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <select name="companySize" value={formData.companySize} onChange={handleChange} className={`${inputClass} appearance-none cursor-pointer`} required={isRecruiter}>
                      <option value="" disabled>Select...</option>
                      <option value="1-10">1-10</option><option value="11-50">11-50</option><option value="51-200">51-200</option><option value="201-500">201-500</option><option value="500+">500+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="password" name="password" value={formData.password} onChange={handleChange} className={`${inputClass} tracking-widest`} placeholder="••••••••" required /></div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirm</label>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`${inputClass} tracking-widest`} placeholder="••••••••" required /></div>
              </div>
            </div>

            {formData.password.length > 0 && (
              <div className="space-y-1.5 px-0.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-400">Password strength</span>
                  <span className={strengthTextColors[strength]}>{strengthText[strength]}</span>
                </div>
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden">
                  {[1,2,3,4,5].map(i => <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${strength >= i ? strengthColors[strength] : 'bg-slate-100'}`} />)}
                </div>
              </div>
            )}

            <label className="flex items-start gap-3 cursor-pointer pt-1">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="sr-only" required />
                <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${formData.terms ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white hover:border-slate-400'}`}>
                  {formData.terms && <Check className="w-3 h-3 text-white stroke-[3]"/>}
                </div>
              </div>
              <span className="text-sm text-slate-500 font-medium leading-relaxed">I agree to the <a href="#" className="font-bold text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="font-bold text-indigo-600 hover:underline">Privacy Policy</a>.</span>
            </label>

            <button type="submit" disabled={isLoading}
              className="w-full h-12 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-2 mt-1 cursor-pointer disabled:opacity-70">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Create Account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
