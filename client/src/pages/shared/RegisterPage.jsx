import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, Loader2, ArrowRight, User, Building2, Briefcase, Users2, Check } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../hooks/useAuthStore';
import { toast } from '../../components/ui/Toast';

export function RegisterPage() {
  const [role, setRole] = useState('Recruiter'); // 'Recruiter' or 'Candidate'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    companySize: '',
    terms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const isRecruiter = role === 'Recruiter';
  const activeColor = isRecruiter ? 'primary' : 'accent';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
       ...prev, 
       [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 5
  };

  const strength = calculatePasswordStrength(formData.password);
  const strengthColors = ['bg-gray-800', 'bg-red-500', 'bg-yellow-500', 'bg-yellow-400', 'bg-green-500', 'bg-green-400'];
  const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.terms) {
      toast.error('Please fill in all required fields and accept terms');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (isRecruiter && (!formData.company || !formData.companySize)) {
      toast.error('Company details are required for recruiters');
      return;
    }

    try {
      setIsLoading(true);
      
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role.toLowerCase()
      };
      
      if (isRecruiter) {
        payload.company = formData.company;
        payload.companySize = formData.companySize;
      }
      
      await registerUser(payload);
      
      toast.success('Account created successfully!');
      navigate(isRecruiter ? '/recruiter/dashboard' : '/candidate/dashboard');
    } catch (error) {
       toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
       setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b] relative overflow-hidden py-12 px-4 selection:bg-[#6366f1]/30 selection:text-[#fafafa]">
      {/* Subtle Animated Gradient Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[#09090b] fixed">
        <div className={`absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen opacity-10 transition-all duration-[2000ms] ease-in-out animate-pulse ${isRecruiter ? 'bg-[#6366f1]' : 'bg-[#8b5cf6]'}`}></div>
        <div className={`absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] rounded-full blur-[150px] mix-blend-screen opacity-10 transition-all duration-[2000ms] ease-in-out ${isRecruiter ? 'bg-[#8b5cf6]' : 'bg-[#6366f1]'}`}></div>
      </div>

      <div className="w-full max-w-[550px] relative z-10 m-auto">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className={`p-2.5 rounded-2xl transition-all duration-700 shadow-lg ${isRecruiter ? 'bg-[#6366f1]/10 text-[#6366f1] shadow-[#6366f1]/15 group-hover:bg-[#6366f1]/20' : 'bg-[#8b5cf6]/10 text-[#8b5cf6] shadow-[#8b5cf6]/15 group-hover:bg-[#8b5cf6]/20'}`}>
              <Brain className="h-8 w-8" />
            </div>
            <span className="text-3xl font-extrabold text-[#fafafa] tracking-tight">HireOS</span>
          </Link>
          <p className="text-[#a1a1aa] font-medium text-base text-center max-w-[300px] leading-relaxed">Create your account to start redefining the way you hire.</p>
        </div>

        {/* Card */}
        <div className="bg-[#18181b]/80 backdrop-blur-2xl border border-[#27272a] rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          
          <div className="mb-8">
             <h2 className="text-xl font-bold text-[#fafafa] mb-4">Choose your goal</h2>
             <div className="grid grid-cols-2 gap-4">
                {/* Recruiter Card */}
                <div onClick={() => setRole('Recruiter')} className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden ${isRecruiter ? 'border-[#6366f1] bg-[#6366f1]/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]' : 'border-[#27272a] bg-[#09090b]/50 hover:border-[#3f3f46] hover:bg-[#18181b]'}`}>
                    {isRecruiter && <div className="absolute top-3 right-3 w-5 h-5 bg-[#6366f1] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white"/></div>}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${isRecruiter ? 'bg-[#6366f1]/20 text-[#6366f1]' : 'bg-[#27272a] text-[#a1a1aa]'}`}>
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className={`font-bold mb-1 ${isRecruiter ? 'text-[#fafafa]' : 'text-[#a1a1aa]'}`}>I want to hire</h3>
                    <p className="text-xs text-[#71717a] font-medium leading-relaxed">Find top talent for my company.</p>
                </div>
                {/* Candidate Card */}
                <div onClick={() => setRole('Candidate')} className={`cursor-pointer border-2 rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300 relative overflow-hidden ${!isRecruiter ? 'border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]' : 'border-[#27272a] bg-[#09090b]/50 hover:border-[#3f3f46] hover:bg-[#18181b]'}`}>
                    {!isRecruiter && <div className="absolute top-3 right-3 w-5 h-5 bg-[#8b5cf6] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white"/></div>}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${!isRecruiter ? 'bg-[#8b5cf6]/20 text-[#8b5cf6]' : 'bg-[#27272a] text-[#a1a1aa]'}`}>
                        <User className="w-6 h-6" />
                    </div>
                    <h3 className={`font-bold mb-1 ${!isRecruiter ? 'text-[#fafafa]' : 'text-[#a1a1aa]'}`}>I want a job</h3>
                    <p className="text-xs text-[#71717a] font-medium leading-relaxed">Find my next career opportunity.</p>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                    </div>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-sm ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`} placeholder="John Doe" required />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-1 sm:col-span-2">
                  <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-sm ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`} placeholder="name@company.com" required />
                  </div>
                </div>

                {isRecruiter && (
                    <>
                        <div className="space-y-1.5 col-span-1 sm:col-span-2">
                          <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Company Name</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Building2 className={`h-5 w-5 transition-colors duration-500 text-[#6366f1]/40 group-focus-within:text-[#6366f1]`} />
                            </div>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-sm focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]`} placeholder="Acme Corp" required={isRecruiter} />
                          </div>
                        </div>
                        <div className="space-y-1.5 col-span-1 sm:col-span-2">
                          <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Company Size</label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <Users2 className={`h-5 w-5 transition-colors duration-500 text-[#6366f1]/40 group-focus-within:text-[#6366f1]`} />
                            </div>
                            <select name="companySize" value={formData.companySize} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] focus:outline-none transition-all shadow-inner font-medium text-sm appearance-none cursor-pointer focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]`} required={isRecruiter}>
                                <option value="" disabled className="text-[#a1a1aa]">Select Size...</option>
                                <option value="1-10">1-10 employees</option>
                                <option value="11-50">11-50 employees</option>
                                <option value="51-200">51-200 employees</option>
                                <option value="201-500">201-500 employees</option>
                                <option value="500+">500+ employees</option>
                            </select>
                          </div>
                        </div>
                    </>
                )}

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                    </div>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-sm tracking-widest ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`} placeholder="••••••••" required />
                  </div>
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.05em] ml-1">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`h-5 w-5 transition-colors duration-500 ${activeColor === 'primary' ? 'text-[#6366f1]/40 group-focus-within:text-[#6366f1]' : 'text-[#8b5cf6]/40 group-focus-within:text-[#8b5cf6]'}`} />
                    </div>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`block w-full pl-12 pr-4 py-3.5 bg-[#09090b]/70 border border-[#27272a] rounded-2xl text-[#fafafa] placeholder-[#71717a] focus:outline-none transition-all shadow-inner font-medium text-sm tracking-widest ${activeColor === 'primary' ? 'focus:border-[#6366f1] hover:border-[#6366f1]/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'focus:border-[#8b5cf6] hover:border-[#8b5cf6]/50 focus:shadow-[0_0_15px_rgba(139,92,246,0.1)]'}`} placeholder="••••••••" required />
                  </div>
                </div>
            </div>

            {/* Password Strength Indicator */}
             {formData.password.length > 0 && (
                <div className="col-span-1 sm:col-span-2 space-y-2 mt-1 px-1">
                    <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[#a1a1aa]">Password Strength</span>
                        <span className={`${strengthColors[strength].replace('bg-', 'text-')}`}>{strengthText[strength]}</span>
                    </div>
                    <div className="flex gap-1 h-1.5 w-full bg-[#18181b] rounded-full overflow-hidden">
                        {[1, 2, 3, 4, 5].map((index) => (
                           <div key={index} className={`flex-1 transition-all duration-300 ${strength >= index ? strengthColors[strength] : 'bg-[#27272a]'}`}></div>
                        ))}
                    </div>
                </div>
             )}

             {/* Terms */}
             <div className="col-span-1 sm:col-span-2 pt-2">
                 <label className="flex items-start gap-3 cursor-pointer group">
                     <div className="relative flex items-center justify-center mt-0.5">
                        <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="sr-only" required />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${formData.terms ? (activeColor === 'primary' ? 'border-[#6366f1] bg-[#6366f1]' : 'border-[#8b5cf6] bg-[#8b5cf6]') : 'border-[#3f3f46] bg-[#18181b] group-hover:border-[#71717a]'}`}>
                            {formData.terms && <Check className="w-3.5 h-3.5 text-white stroke-[3]"/>}
                        </div>
                     </div>
                     <span className="text-sm text-[#a1a1aa] font-medium leading-relaxed">I agree to the <a href="#" className={`font-bold hover:underline transition-colors ${activeColor === 'primary' ? 'text-[#6366f1]' : 'text-[#8b5cf6]'}`}>Terms of Service</a> and <a href="#" className={`font-bold hover:underline transition-colors ${activeColor === 'primary' ? 'text-[#6366f1]' : 'text-[#8b5cf6]'}`}>Privacy Policy</a>.</span>
                 </label>
             </div>

            <div className="pt-4">
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
                   <>Create Account <ArrowRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#a1a1aa] font-medium">
              Already have an account?{' '}
              <Link to="/login" className={`font-bold hover:underline transition-colors ${activeColor === 'primary' ? 'text-[#6366f1] hover:text-[#818cf8]' : 'text-[#8b5cf6] hover:text-[#a78bfa]'}`}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
