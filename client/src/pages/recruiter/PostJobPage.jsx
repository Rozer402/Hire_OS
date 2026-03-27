import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, ArrowRight, Brain, Check, X, ShieldAlert, Sparkles, Loader2, Save } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../components/ui/Toast';
import api from '../../services/api';

const inputClass = "block w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm font-medium text-sm";
const labelClass = "block text-sm font-bold text-slate-700 mb-1.5";

export function PostJobPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ title: '', department: '', location: '', type: 'Full-time', salaryMin: 90, salaryMax: 150, description: '', experience: 'Mid-Level', skills: [] });
  const [skillInput, setSkillInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biasResults, setBiasResults] = useState(null);
  const navigate = useNavigate();

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const removeSkill = (s) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(sk => sk !== s) }));

  const triggerAiScan = () => {
    setIsScanning(true);
    setBiasResults(null);
    setTimeout(() => {
      const hasBias = formData.description.toLowerCase().includes('ninja') || formData.description.toLowerCase().includes('rockstar') || formData.description.length < 50;
      setBiasResults(hasBias ? [
        { word: 'ninja', suggestion: 'engineer', type: 'gender-coded', severity: 'high' },
        { word: 'rockstar', suggestion: 'expert', type: 'exclusionary', severity: 'medium' },
        { word: 'young', suggestion: 'early-career', type: 'ageism', severity: 'high' }
      ].filter(b => formData.description.toLowerCase().includes(b.word)) : []);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => { if (step === 3) triggerAiScan(); }, [step]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await api.post('/jobs', {
        title: formData.title, department: formData.department, location: formData.location,
        type: formData.type.toLowerCase().replace(/\s+/g, '-'), salaryMin: formData.salaryMin,
        salaryMax: formData.salaryMax, description: formData.description,
        experienceLevel: formData.experience, skills: formData.skills
      });
      toast.success('Job posted successfully!');
      navigate('/recruiter/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = ['Job Details', 'Requirements', 'AI Review'];

  return (
    <div className="max-w-3xl mx-auto pb-24 px-4 sm:px-6 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Create New Job Posting</h1>
        <p className="text-slate-500 font-medium text-sm">Follow the steps to configure and publish an optimized job listing.</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex justify-between relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
          <div className="absolute top-5 left-0 h-0.5 bg-indigo-600 transition-all duration-500 ease-in-out -translate-y-1/2 z-0" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          {steps.map((label, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm ${step > idx + 1 ? 'border-indigo-600 bg-indigo-600 text-white' : (step === idx + 1 ? 'border-indigo-600 bg-white text-indigo-600 ring-4 ring-indigo-50' : 'border-slate-200 bg-white text-slate-400')}`}>
                {step > idx + 1 ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.1em] transition-colors ${step >= idx + 1 ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-1">
        <div className="p-8 sm:p-10 bg-white">

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelClass}>Job Title</label><input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClass} placeholder="e.g. Senior Frontend Engineer" /></div>
                <div><label className={labelClass}>Department</label><input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className={inputClass} placeholder="e.g. Engineering" /></div>
                <div><label className={labelClass}>Location</label><input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputClass} placeholder="e.g. San Francisco, CA" /></div>
                <div>
                  <label className={labelClass}>Job Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={`${inputClass} cursor-pointer appearance-none`}>
                    <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Remote</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className={labelClass + " mb-0"}>Salary Range (Annual, USD)</label>
                  <span className="font-bold text-indigo-600 text-base">${formData.salaryMin}k — ${formData.salaryMax}k</span>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Min: ${formData.salaryMin}k</span>
                    <input type="range" min="30" max="300" step="5" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: parseInt(e.target.value)})} className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2 block">Max: ${formData.salaryMax}k</span>
                    <input type="range" min="30" max="400" step="5" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: Math.max(parseInt(e.target.value), formData.salaryMin)})} className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className={labelClass + " mb-0"}>Job Description</label>
                  <span className="text-xs font-semibold text-slate-400">{formData.description.length} chars</span>
                </div>
                <textarea rows="7" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the role, responsibilities... (try 'ninja' or 'rockstar' to test AI bias detection)"
                  className={`${inputClass} resize-y leading-relaxed`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <label className={labelClass}>Required Skills</label>
                  <form onSubmit={addSkill} className="flex gap-2 mb-3">
                    <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} placeholder="e.g. React, Python" className={`${inputClass} flex-1`} />
                    <Button type="submit" variant="outline" className="border-slate-200 text-slate-700 font-bold hover:bg-slate-50 shrink-0">Add</Button>
                  </form>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-3 border border-slate-200 rounded-xl bg-slate-50">
                    {formData.skills.map(skill => (
                      <Badge key={skill} className="px-3 py-1.5 text-sm font-semibold bg-white border border-slate-200 text-slate-700 gap-1.5 shadow-sm cursor-default">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer ml-0.5"><X className="w-3.5 h-3.5" /></button>
                      </Badge>
                    ))}
                    {formData.skills.length === 0 && <span className="text-sm text-slate-400 font-medium">No skills added yet.</span>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Experience Level</label>
                  <select value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className={`${inputClass} cursor-pointer appearance-none`}>
                    <option>Entry Level</option><option>Junior</option><option>Mid-Level</option><option>Senior</option><option>Lead / Manager</option><option>Executive</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 - AI Bias Detection */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 min-h-[350px]">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 transition-all duration-500 ${isScanning ? 'bg-indigo-50 border border-indigo-200' : (biasResults?.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200')}`}>
                  {isScanning ? <Brain className="w-8 h-8 text-indigo-500 animate-pulse" /> : (biasResults?.length > 0 ? <ShieldAlert className="w-8 h-8 text-red-500" /> : <Sparkles className="w-8 h-8 text-emerald-500" />)}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isScanning ? 'Scanning for unconscious bias...' : (biasResults?.length > 0 ? `${biasResults.length} Issue${biasResults.length > 1 ? 's' : ''} Detected` : 'No Bias Detected!')}
                </h3>
                <p className="text-slate-500 font-medium text-sm max-w-md mx-auto">
                  {isScanning ? 'Analyzing your text for exclusionary language patterns.' : 'We recommend addressing flagged terms to attract a more diverse talent pool.'}
                </p>
              </div>

              {!isScanning && biasResults && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                  {biasResults.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-600 px-2.5 py-1 bg-red-50 border border-red-100 rounded-lg">{biasResults.length} {biasResults.length === 1 ? 'issue' : 'issues'} found</span>
                        <Button variant="outline" size="sm" className="font-bold border-slate-200 text-slate-600 hover:bg-white h-8" onClick={triggerAiScan}><Sparkles className="w-3.5 h-3.5 mr-1.5"/>Rescan</Button>
                      </div>
                      {biasResults.map((flag, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white border border-slate-200 rounded-xl gap-4 shadow-sm hover:border-red-200 transition-colors">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 line-through decoration-red-400 decoration-2">"{flag.word}"</span>
                              <Badge className="bg-red-50 text-red-600 border border-red-100 text-[10px] font-bold uppercase tracking-widest">{flag.type}</Badge>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">This phrasing can be exclusionary. Consider a more inclusive alternative.</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 bg-emerald-50 border border-emerald-100 py-2.5 px-4 rounded-xl w-full sm:w-auto">
                            <ArrowRight className="w-4 h-4 text-slate-400" />
                            <div>
                              <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Suggested</span>
                              <span className="font-bold text-slate-900 text-sm">"{flag.suggestion}"</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center mx-auto mb-3">
                        <Check className="w-7 h-7 text-emerald-600 stroke-[2.5]" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Inclusion score: 100/100</h4>
                      <p className="text-slate-500 font-medium text-sm">Your job description uses highly inclusive language. Great work!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t border-slate-100">
            <Button variant="outline" onClick={() => setStep(p => Math.max(p - 1, 1))} disabled={step === 1 || isScanning}
              className={`font-semibold gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep(p => Math.min(p + 1, 3))} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 px-6 shadow-sm">
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isScanning || isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 px-6 shadow-sm">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? 'Publishing...' : 'Publish Job'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostJobPage;
