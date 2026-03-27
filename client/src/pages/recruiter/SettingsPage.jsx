import React, { useState } from 'react';
import { User, Building2, Bell, CreditCard, Shield, Plug, CheckCircle2, Download, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../hooks/useAuthStore';
import { authService } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const inputClass = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-sm placeholder-slate-400";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5";

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', linkedIn: '', github: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => { toast.success('Password updated successfully!'); setIsUpdatingPassword(false); }, 1000);
  };

  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        setIsLoading(true);
        const res = await authService.getMe();
        if (res.success && res.data) {
          setFormData({ name: res.data.name || '', email: res.data.email || '', company: res.data.company || '', phone: res.data.phone || '', linkedIn: res.data.linkedIn || '', github: res.data.github || '' });
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const res = await authService.updateProfile(formData);
      if (res.success) {
        toast.success('Profile saved!');
        const meRes = await authService.getMe();
        if (meRes.success && meRes.data) setUser(meRes.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { name: 'Profile', icon: User },
    { name: 'Company', icon: Building2 },
    { name: 'Notifications', icon: Bell },
    { name: 'Billing', icon: CreditCard },
    { name: 'Security', icon: Shield },
    { name: 'Integrations', icon: Plug }
  ];

  const SectionCard = ({ title, description, children }) => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-500 font-medium mt-0.5">{description}</p>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Nav */}
        <div className="w-full md:w-56 shrink-0 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible hide-scrollbar">
          {tabs.map((tab) => (
            <button key={tab.name} onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left whitespace-nowrap cursor-pointer border ${activeTab === tab.name ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50 hover:border-slate-100'}`}>
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 w-full min-w-0">
          {activeTab === 'Profile' && (
            <SectionCard title="Personal Information" description="Update your personal details here.">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}`} alt="Avatar" className="w-20 h-20 rounded-full border border-slate-200 object-cover shadow-sm" />
                <div className="flex gap-2"><Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm">Change photo</Button><Button variant="outline" className="border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50">Remove</Button></div>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-7 h-7 text-indigo-600 animate-spin" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div><label className={labelClass}>Full Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClass} /></div>
                  <div><label className={labelClass}>Email Address</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={inputClass} /></div>
                  <div><label className={labelClass}>Phone Number</label><input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={inputClass} placeholder="+1 555 000 0000" /></div>
                  <div><label className={labelClass}>LinkedIn URL</label><input type="url" value={formData.linkedIn} onChange={e => setFormData({...formData, linkedIn: e.target.value})} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
                  <div className="md:col-span-2"><label className={labelClass}>GitHub URL</label><input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className={inputClass} placeholder="https://github.com/..." /></div>
                  <div className="md:col-span-2"><label className={labelClass}>Role</label><input type="text" readOnly defaultValue={user?.role || 'recruiter'} className={`${inputClass} opacity-60 cursor-not-allowed capitalize`} /></div>
                </div>
              )}
              <div className="flex justify-end border-t border-slate-100 pt-5 mt-5">
                <Button onClick={handleSaveProfile} disabled={isSaving || isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm px-6">
                  {isSaving ? <><Loader2 className="w-4 h-4 animate-spin mr-1.5" />Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </SectionCard>
          )}

          {activeTab === 'Company' && (
            <SectionCard title="Company Profile" description="This information is visible to candidates.">
              <div className="space-y-5">
                <div><label className={labelClass}>Company Name</label><input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={inputClass} /></div>
                <div><label className={labelClass}>Website</label><input type="url" defaultValue="https://techcorp.com" className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-5">
                  <div><label className={labelClass}>Company Size</label>
                    <select className={`${inputClass} cursor-pointer appearance-none`} defaultValue="51-200">
                      <option value="1-50">1-50 employees</option><option value="51-200">51-200 employees</option><option value="201-500">201-500 employees</option><option value="501+">501+ employees</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>Industry</label><input type="text" defaultValue="Enterprise Software" className={inputClass} /></div>
                </div>
                <div className="flex justify-end border-t border-slate-100 pt-5">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm px-6">Save Changes</Button>
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === 'Notifications' && (
            <SectionCard title="Email Notifications" description="Choose what updates you want to receive.">
              <div className="space-y-5 divide-y divide-slate-100">
                {[
                  { id: 'n1', label: 'New Applications', desc: 'Receive an email when a new candidate applies.', defaultOn: true },
                  { id: 'n2', label: 'Interview Reminders', desc: 'Get a 30-minute heads-up before an interview starts.', defaultOn: true },
                  { id: 'n3', label: 'Daily Digest', desc: "A summary email of the day's hiring velocity.", defaultOn: false },
                  { id: 'n4', label: 'AI Match Alerts', desc: 'Immediate alert when a candidate scores above 90.', defaultOn: true }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between pt-5 first:pt-0">
                    <div><p className="font-bold text-slate-900 text-sm">{item.label}</p><p className="text-sm text-slate-500 font-medium mt-0.5">{item.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer ml-6 shrink-0">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultOn} />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 border border-slate-200"></div>
                    </label>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeTab === 'Billing' && (
            <div className="space-y-6">
              <SectionCard title="Current Plan" description="Manage your subscription and usage.">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-50 to-slate-50 p-5 rounded-xl border border-indigo-100">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-slate-900">Pro Plan</h3>
                      <Badge variant="primary" className="bg-indigo-50 text-indigo-700 border border-indigo-200">Active</Badge>
                    </div>
                    <p className="text-slate-500 font-medium text-sm">Billed annually at $2,400/year. Renews Oct 12, 2025.</p>
                  </div>
                  <Button variant="outline" className="shrink-0 font-semibold border-slate-200 text-slate-700 hover:bg-slate-50">Manage Plan</Button>
                </div>
              </SectionCard>

              <SectionCard title="Invoices" description="View and download previous billing statements.">
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50">
                      <tr>
                        {['Date','Amount','Status','Invoice'].map(h => (
                          <th key={h} className="px-6 py-3 text-slate-500 text-xs font-bold tracking-wider uppercase border-b border-slate-200 last:text-right">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[{ date: 'Oct 12, 2023', amount: '$2,400.00', status: 'Paid' }, { date: 'Oct 12, 2022', amount: '$2,400.00', status: 'Paid' }, { date: 'Oct 12, 2021', amount: '$2,000.00', status: 'Paid' }].map((inv, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-slate-900">{inv.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600">{inv.amount}</td>
                          <td className="px-6 py-4"><Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100">{inv.status}</Badge></td>
                          <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm" className="h-8 gap-1.5 text-slate-500 hover:text-slate-900"><Download className="w-3.5 h-3.5" /> PDF</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <SectionCard title="Change Password" description="Ensure your account remains highly secure.">
                <div className="space-y-4 max-w-md">
                  <div><label className={labelClass}>Current Password</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                  <div><label className={labelClass}>New Password</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
                  <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm mt-1">
                    {isUpdatingPassword ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Updating...</> : 'Update Password'}
                  </Button>
                </div>
              </SectionCard>

              <SectionCard title="Active Sessions" description="Devices currently active on this account.">
                <div className="divide-y divide-slate-100 -m-6">
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-2 text-sm">Windows PC · Chrome <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">Current</Badge></p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">San Francisco, CA · Active Now</p>
                    </div>
                  </div>
                  <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">MacBook Pro · Safari</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">San Jose, CA · Last active 2 hours ago</p>
                    </div>
                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold text-sm">Revoke</Button>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === 'Integrations' && (
            <SectionCard title="Integrations" description="Connect with other apps you rely on daily.">
              <div className="flex items-center justify-center min-h-[250px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Integrations Active</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm">Your Zoom, Slack, and Outlook systems are currently active and monitored.</p>
                </div>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
