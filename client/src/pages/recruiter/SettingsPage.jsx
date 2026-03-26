import React, { useState } from 'react';
import { User, Building2, Bell, CreditCard, Shield, Plug, CheckCircle2, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuthStore } from '../../hooks/useAuthStore';
import { authService } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { Loader2 } from 'lucide-react';

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Profile');
  const [formData, setFormData] = useState({ name: '', email: '', company: '', phone: '', linkedIn: '', github: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdatePassword = () => {
    setIsUpdatingPassword(true);
    setTimeout(() => {
      toast.success('Password updated successfully!');
      setIsUpdatingPassword(false);
    }, 1000);
  };
  
  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        setIsLoading(true);
        const res = await authService.getMe();
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || '',
            email: res.data.email || '',
            company: res.data.company || 'HireOS Default Company',
            phone: res.data.phone || '',
            linkedIn: res.data.linkedIn || '',
            github: res.data.github || ''
          });
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
        // Ideally update user in store
        const meRes = await authService.getMe();
        if (meRes.success && meRes.data) setUser(meRes.data);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
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

  return (
    <div className="p-8 max-w-[1200px] mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-[2rem] font-bold text-[#fafafa] tracking-tight">Settings</h1>
        <p className="text-[#a1a1aa] font-medium mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Nav */}
        <div className="w-full md:w-64 flex flex-col gap-1 hide-scrollbar overflow-x-auto md:overflow-visible shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${activeTab === tab.name ? 'bg-[#6366f1]/10 text-[#6366f1]' : 'text-[#a1a1aa] hover:text-[#fafafa] hover:bg-white/[0.03]'}`}
            >
              <tab.icon className="w-5 h-5 shrink-0" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 w-full">
          {activeTab === 'Profile' && (
            <Card className="shadow-xl">
              <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                <CardTitle className="text-lg font-bold text-[#fafafa]">Personal Information</CardTitle>
                <CardDescription className="text-sm text-[#a1a1aa] mt-1">Update your photo and personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="Avatar" className="w-24 h-24 rounded-full border-2 border-[#27272a] shadow-md" />
                  <div className="flex gap-3">
                    <Button>Change avatar</Button>
                    <Button variant="ghost">Remove</Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isLoading ? (
                    <div className="col-span-2 flex justify-center py-6"><Loader2 className="w-8 h-8 text-[#6366f1] animate-spin" /></div>
                  ) : (
                  <>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Phone Number</label>
                    <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">LinkedIn URL</label>
                    <input type="url" value={formData.linkedIn} onChange={e => setFormData({...formData, linkedIn: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">GitHub URL</label>
                    <input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Role</label>
                    <input type="text" readOnly defaultValue={user?.role || 'recruiter'} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#a1a1aa] focus:outline-none focus:border-[#6366f1] transition-colors opacity-70" />
                  </div>
                  </>
                  )}
                </div>

                <div className="flex justify-end border-t border-[#27272a] pt-6">
                  <Button onClick={handleSaveProfile} disabled={isSaving || isLoading} className="w-32 bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Company' && (
            <Card className="shadow-xl">
              <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                <CardTitle className="text-lg font-bold text-[#fafafa]">Company Profile</CardTitle>
                <CardDescription className="text-sm text-[#a1a1aa] mt-1">This information is visible to candidates.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Company Name</label>
                  <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div className="space-y-2">
                  <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Website</label>
                  <input type="url" defaultValue="https://techcorp.com" className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Company Size</label>
                    <select className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors cursor-pointer" defaultValue="51-200">
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Industry</label>
                    <input type="text" defaultValue="Enterprise Software" className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                </div>
                <div className="flex justify-end border-t border-[#27272a] pt-6">
                  <Button onClick={handleSaveProfile} disabled={isSaving || isLoading} className="w-32 bg-[#6366f1] hover:bg-[#4f46e5] text-white">Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'Notifications' && (
            <Card className="shadow-xl">
              <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                <CardTitle className="text-lg font-bold text-[#fafafa]">Email Notifications</CardTitle>
                <CardDescription className="text-sm text-[#a1a1aa] mt-1">Choose what updates you want to receive.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { id: 'n1', label: 'New Applications', desc: 'Receive an email when a new candidate applies.', defaultOn: true },
                  { id: 'n2', label: 'Interview Reminders', desc: 'Get a 30-minute heads-up before an interview starts.', defaultOn: true },
                  { id: 'n3', label: 'Daily Digest', desc: 'A summary email of the day’s hiring velocity.', defaultOn: false },
                  { id: 'n4', label: 'AI Match Alerts', desc: 'Immediate alert when a candidate scores above 90.', defaultOn: true }
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#fafafa]">{item.label}</p>
                      <p className="text-sm text-[#a1a1aa] font-medium">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultOn} />
                      <div className="w-11 h-6 bg-[#27272a] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#d4d4d8] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6366f1] border border-[#3f3f46]"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'Billing' && (
            <div className="space-y-6">
              <Card className="shadow-xl">
                <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                  <CardTitle className="text-lg font-bold text-[#fafafa]">Current Plan</CardTitle>
                  <CardDescription className="text-sm text-[#a1a1aa] mt-1">Manage your subscription and usage.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#09090b] p-6 rounded-xl border border-[#27272a]">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-[#fafafa]">Pro Plan</h3>
                        <Badge variant="primary" className="shadow-sm">Active</Badge>
                      </div>
                      <p className="text-[#a1a1aa] font-medium text-sm">Billed annually at $2,400/year. Renews on Oct 12, 2024.</p>
                    </div>
                    <Button variant="secondary" className="shrink-0 font-bold bg-[#27272a]">Manage Plan</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                  <CardTitle className="text-lg font-bold text-[#fafafa]">Invoices</CardTitle>
                  <CardDescription className="text-sm text-[#a1a1aa] mt-1">View and download previous billing statements.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#18181b]">
                      <tr>
                        <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Date</th>
                        <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Amount</th>
                        <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase">Status</th>
                        <th className="px-6 py-4 text-[#a1a1aa] text-[0.75rem] font-semibold tracking-[0.05em] uppercase text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {[
                        { date: 'Oct 12, 2023', amount: '$2,400.00', status: 'Paid' },
                        { date: 'Oct 12, 2022', amount: '$2,400.00', status: 'Paid' },
                        { date: 'Oct 12, 2021', amount: '$2,000.00', status: 'Paid' }
                      ].map((invoice, i) => (
                        <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                          <td className="px-6 py-4 text-sm font-bold text-[#fafafa]">{invoice.date}</td>
                          <td className="px-6 py-4 text-sm font-medium text-[#a1a1aa]">{invoice.amount}</td>
                          <td className="px-6 py-4"><Badge variant="success" className="opacity-80 scale-90 origin-left">{invoice.status}</Badge></td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-[#a1a1aa] hover:text-[#fafafa]"><Download className="w-3.5 h-3.5" /> PDF</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <Card className="shadow-xl">
                <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                  <CardTitle className="text-lg font-bold text-[#fafafa]">Change Password</CardTitle>
                  <CardDescription className="text-sm text-[#a1a1aa] mt-1">Ensure your account remains highly secure.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  <div className="space-y-2 max-w-md">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-[0.75rem] font-semibold text-[#a1a1aa] tracking-[0.05em] uppercase">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-[#27272a] border border-[#3f3f46] rounded-lg text-sm text-[#fafafa] focus:outline-none focus:border-[#6366f1] transition-colors" />
                  </div>
                  <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword} className="mt-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white">
                    {isUpdatingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Update Password'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                  <CardTitle className="text-lg font-bold text-[#fafafa]">Active Sessions</CardTitle>
                  <CardDescription className="text-sm text-[#a1a1aa] mt-1">Devices heavily active on this account.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-[#27272a]">
                    <div className="p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                      <div>
                        <p className="font-bold text-[#fafafa] flex items-center gap-2">Windows PC • Chrome <Badge variant="success" className="text-[10px] h-5 scale-90">Current</Badge></p>
                        <p className="text-xs font-medium text-[#a1a1aa] mt-1">San Francisco, CA • Active Now</p>
                      </div>
                    </div>
                    <div className="p-6 flex items-center justify-between hover:bg-white/[0.03] transition-colors">
                      <div>
                        <p className="font-bold text-[#fafafa]">MacBook Pro • Safari</p>
                        <p className="text-xs font-medium text-[#a1a1aa] mt-1">San Jose, CA • Last active 2 hours ago</p>
                      </div>
                      <Button variant="ghost" className="text-[#f43f5e] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10">Revoke</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'Integrations' && (
            <Card className="shadow-xl">
              <CardHeader className="border-b border-[#27272a] bg-[#18181b] pb-4">
                <CardTitle className="text-lg font-bold text-[#fafafa]">Integrations</CardTitle>
                <CardDescription className="text-sm text-[#a1a1aa] mt-1">Connect with other apps you rely on daily.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-[#10b981]/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#10b981]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#fafafa] mb-2">Integrations Active</h3>
                  <p className="text-[#a1a1aa] font-medium max-w-sm mx-auto">Your Zoom, Slack, and Outlook systems are currently monitored by IT parameters.</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
