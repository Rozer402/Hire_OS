import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, ArrowRight, Brain, Check, X, ShieldAlert, Sparkles, Loader2, Save } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/ui/Toast';
import api from '../../services/api';

export function PostJobPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    salaryMin: 90,
    salaryMax: 150,
    description: '',
    experience: 'Mid-Level',
    skills: []
  });
  const [skillInput, setSkillInput] = useState('');
  
  // AI Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biasResults, setBiasResults] = useState(null);
  const navigate = useNavigate();

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
  
  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const triggerAiScan = () => {
    setIsScanning(true);
    setBiasResults(null);
    setTimeout(() => {
      // Mock AI detection logic based on description length/content
      const hasBias = formData.description.toLowerCase().includes('ninja') || formData.description.toLowerCase().includes('rockstar') || formData.description.length < 50;
      
      setBiasResults(hasBias ? [
        { word: 'ninja', suggestion: 'engineer', type: 'gender-coded', severity: 'high' },
        { word: 'rockstar', suggestion: 'expert', type: 'exclusionary', severity: 'medium' },
        { word: 'young', suggestion: 'early-career', type: 'ageism', severity: 'high' }
      ].filter(b => formData.description.toLowerCase().includes(b.word)) : []);
      
      setIsScanning(false);
    }, 2500); // simulate thinking
  };

  // Trigger scan when entering step 3
  useEffect(() => {
    if (step === 3) {
      triggerAiScan();
    }
  }, [step]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/jobs', {
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type.toLowerCase().replace(/\s+/g, '-'),
        salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax,
        description: formData.description,
        experienceLevel: formData.experience,
        skills: formData.skills
      });
      toast.success('Job posted successfully to HireOS network!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      console.error('Failed to post job:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-10 max-w-3xl mx-auto">
      <div className="flex justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -translate-y-1/2 z-0 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-primary-500 transition-all duration-500 ease-in-out -translate-y-1/2 z-0 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.5)]" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
        
        {['Job Details', 'Requirements', 'AI Review'].map((label, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
             <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-lg transition-all duration-500 shadow-sm ${step > idx + 1 ? 'border-primary-500 bg-primary-500 text-white' : (step === idx + 1 ? 'border-primary-500 bg-gray-950 text-primary-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-gray-800 bg-gray-900 text-gray-500')}`}>
                {step > idx + 1 ? <Check className="w-5 h-5 stroke-[3]" /> : idx + 1}
             </div>
             <span className={`text-xs uppercase tracking-wider font-bold transition-colors ${step >= idx + 1 ? 'text-white' : 'text-gray-500'}`}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 px-4 sm:px-6">
      <div className="mb-8 mt-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">Create New Job Posting</h1>
        <p className="text-gray-400 font-medium">Follow the steps to configure and publish an AI-optimized job.</p>
      </div>

      {renderProgressBar()}

      <Card className="border-gray-800 shadow-2xl bg-gray-950 overflow-hidden relative border-t-4 border-t-primary-500 transition-all duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <CardContent className="p-8 sm:p-12 relative z-10">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input label="Job Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior Frontend Engineer" />
                <Input label="Department" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. Engineering" />
                <Input label="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. San Francisco, CA (or Remote)" />
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-300 ml-1">Job Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="block w-full px-4 py-3.5 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner font-medium appearance-none cursor-pointer hover:border-gray-700 transition-colors"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-800/80">
                <div className="flex justify-between items-center">
                   <label className="text-sm font-bold text-gray-300 ml-1">Salary Range (Annual, USD)</label>
                   <span className="font-extrabold text-primary-400 text-lg">${formData.salaryMin}k - ${formData.salaryMax}k</span>
                </div>
                <div className="flex items-center gap-6 px-2">
                  <div className="flex-1">
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block min-w-[50px]">Min: ${formData.salaryMin}k</span>
                     <input type="range" min="30" max="300" step="5" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: parseInt(e.target.value)})} className="w-full accent-primary-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div className="flex-1">
                     <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 block min-w-[50px]">Max: ${formData.salaryMax}k</span>
                     <input type="range" min="30" max="400" step="5" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: Math.max(parseInt(e.target.value), formData.salaryMin)})} className="w-full accent-primary-500 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="space-y-2">
                 <div className="flex justify-between items-center mb-1">
                   <label className="text-sm font-bold text-gray-300 ml-1">Job Description</label>
                   <span className="text-xs font-semibold text-gray-500">{formData.description.length} chars</span>
                 </div>
                 <textarea 
                   rows="8" 
                   value={formData.description} 
                   onChange={e => setFormData({...formData, description: e.target.value})}
                   placeholder="Describe the role, responsibilities, and ideal candidate profile... (Try including words like 'ninja' or 'rockstar' to test bias detection)"
                   className="w-full px-5 py-4 bg-gray-900 border border-gray-800 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner font-medium resize-y hover:border-gray-700 transition-colors leading-relaxed"
                 />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-800/80">
                 <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-300 ml-1">Required Skills</label>
                   <form onSubmit={addSkill} className="flex gap-2 relative">
                     <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="e.g. React, Python" className="w-full px-4 py-3.5 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner font-medium pr-24" />
                     <Button type="submit" variant="secondary" className="absolute right-1 top-1 bottom-1 text-xs font-bold px-4 bg-gray-800 hover:bg-gray-700 border-none rounded-lg text-white">Add</Button>
                   </form>
                   <div className="flex flex-wrap gap-2 mt-4 min-h-[40px] p-4 border border-gray-800/60 rounded-xl bg-gray-900/30">
                     {formData.skills.map(skill => (
                       <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 gap-2 transition-colors cursor-default shadow-sm group">
                         {skill}
                         <button onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-red-400 transition-colors bg-gray-900 group-hover:bg-gray-800 rounded-full p-0.5 outline-none">
                           <X className="w-3.5 h-3.5" />
                         </button>
                       </Badge>
                     ))}
                     {formData.skills.length === 0 && <span className="text-sm text-gray-500 font-medium my-auto">No skills added yet.</span>}
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-bold text-gray-300 ml-1">Experience Level</label>
                   <select 
                     value={formData.experience} 
                     onChange={e => setFormData({...formData, experience: e.target.value})}
                     className="block w-full px-4 py-3.5 bg-gray-900 border border-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-inner font-medium appearance-none cursor-pointer hover:border-gray-700 transition-colors"
                   >
                     <option>Entry Level</option>
                     <option>Junior</option>
                     <option>Mid-Level</option>
                     <option>Senior</option>
                     <option>Lead / Manager</option>
                     <option>Executive</option>
                   </select>
                 </div>
               </div>
            </div>
          )}

          {/* STEP 3 - AI Bias Detection */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 min-h-[400px]">
               <div className="text-center mb-8">
                  <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-6 transition-all duration-1000 ${isScanning ? 'bg-accent-900/40 border border-accent-800 shadow-[0_0_40px_rgba(139,92,246,0.3)]' : (biasResults && biasResults.length > 0 ? 'bg-red-950/40 border border-red-900 shadow-[0_0_40px_rgba(239,68,68,0.2)]' : 'bg-green-950/40 border border-green-900 shadow-[0_0_40px_rgba(34,197,94,0.2)]')}`}>
                     {isScanning ? (
                        <div className="relative">
                           <Brain className="w-10 h-10 text-accent-500 animate-pulse" />
                           <div className="absolute inset-0 bg-accent-400 blur-xl opacity-50 animate-pulse"></div>
                        </div>
                     ) : (
                        biasResults && biasResults.length > 0 ? <ShieldAlert className="w-10 h-10 text-red-500" /> : <Sparkles className="w-10 h-10 text-green-500" />
                     )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                     {isScanning ? 'Scanning for unconscious bias...' : (biasResults?.length > 0 ? 'Bias Detected in Job Description' : 'Looking Great! No strict bias detected.')}
                  </h3>
                  <p className="text-gray-400 font-medium max-w-lg mx-auto">
                     {isScanning ? 'Our HireOS Engine is analyzing your text against millions of data points to ensure inclusive language.' : 'We recommend addressing flagged terminology to attract the most diverse talent pool.'}
                  </p>
               </div>

               {!isScanning && biasResults && (
                 <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                    {biasResults.length > 0 ? (
                       <div className="space-y-4 relative z-10">
                          <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold uppercase tracking-wider text-red-400 px-3 py-1 bg-red-950/30 border border-red-900/50 rounded-lg">{biasResults.length} issues found</span>
                              <Button variant="secondary" size="sm" className="font-bold bg-gray-800 hover:bg-gray-700 text-white h-9" onClick={triggerAiScan}><Sparkles className="w-3.5 h-3.5 mr-1.5"/> Rescan Text</Button>
                          </div>
                          {biasResults.map((flag, i) => (
                             <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-gray-950 border border-gray-800 rounded-2xl gap-4 hover:border-red-900/50 transition-colors group shadow-inner">
                                <div>
                                   <div className="flex items-center gap-3 mb-1.5">
                                      <span className="font-extrabold text-white text-lg line-through decoration-red-500 decoration-2">"{flag.word}"</span>
                                      <Badge variant="red" className="text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">{flag.type}</Badge>
                                   </div>
                                   <p className="text-sm text-gray-400 font-medium">This phrasing can be exclusionary. Consider using a more inclusive alternative.</p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 bg-gray-900 py-3 px-5 rounded-xl border border-gray-800 group-hover:border-green-900/50 transition-colors w-full sm:w-auto">
                                   <ArrowRight className="w-5 h-5 text-gray-600" />
                                   <div>
                                     <span className="block text-xs font-bold text-green-500 uppercase tracking-widest mb-0.5">Suggested</span>
                                     <span className="font-bold text-white">"{flag.suggestion}"</span>
                                   </div>
                                </div>
                             </div>
                          ))}
                       </div>
                    ) : (
                       <div className="text-center py-8 relative z-10">
                          <Check className="w-16 h-16 text-green-500 mx-auto mb-4 p-4 bg-green-950/30 rounded-full border border-green-900/50 shadow-inner" />
                          <h4 className="text-xl font-bold text-gray-100 mb-2">Inclusion score: 100/100</h4>
                          <p className="text-gray-400 font-medium">Your job description uses highly inclusive language.</p>
                       </div>
                    )}
                 </div>
               )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-10 mt-10 border-t border-gray-800/80">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              disabled={step === 1 || isScanning}
              className={`font-bold h-12 px-6 gap-2 text-base ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white bg-gray-900/30 hover:bg-gray-800 border border-gray-800'}`}
            >
              <ArrowLeft className="w-5 h-5" /> Back
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNext} className="h-12 px-8 font-bold gap-2 text-base shadow-lg shadow-primary-900/30 bg-primary-600 hover:bg-primary-500 transition-all hover:scale-105 active:scale-95">
                Next Step <ArrowRight className="w-5 h-5" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isScanning || isSubmitting} className="h-12 px-8 font-bold gap-2 text-base shadow-lg shadow-green-900/30 bg-green-600 hover:bg-green-500 border border-green-500 transition-all hover:scale-105 active:scale-95 text-white">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSubmitting ? 'Publishing...' : 'Publish Job'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PostJobPage;
