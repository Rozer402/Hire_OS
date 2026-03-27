import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, Brain, Shield, BarChart3, Users, CheckCircle, ArrowRight, Star, Quote, Twitter, Linkedin, Github, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function LandingPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.hash === '#features') {
      const section = document.getElementById('features');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleNav = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">HireOS</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full ml-1">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <button onClick={(e) => handleNav('features')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer">Features</button>
            <button onClick={(e) => handleNav('how-it-works')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer">How it Works</button>
            <button onClick={(e) => handleNav('pricing')} className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer">Pricing</button>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Login</Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-100 group border-none">
                Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-[120px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-50 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <Star className="w-3.5 h-3.5" /> Next-Gen AI Recruiting
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-slate-900">
             Hire the best talent <br />
             <span className="text-indigo-600">
               without bias.
             </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            HireOS replaces manual screening with AI. Conduct automated interviews, parse resumes instantly, and rank candidates with zero bias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link to="/register?role=recruiter" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base font-bold shadow-md shadow-indigo-100 px-8 h-14 group bg-indigo-600 text-white">
                Start Hiring Free <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register?role=candidate" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full text-base font-bold px-8 h-14 border-slate-200 text-slate-600 hover:bg-slate-50">
                I'm a Candidate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-500 text-lg font-medium">Everything you need to build a high-performing team.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Job Management</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Post jobs, manage applicants, and track hiring stages with a intuitive dashboard.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Matching</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Automatically match candidates with jobs using our proprietary smart scoring engine.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Interview Scheduling</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Schedule and manage interviews seamlessly with built-in calendar integrations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-12 border-y border-slate-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by innovative teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-xl font-bold font-serif text-slate-900">Acme Corp</span>
             <span className="text-xl font-extrabold tracking-tighter text-slate-900">GLOBAL</span>
             <span className="text-xl font-semibold italic text-slate-900">TechFlow</span>
             <span className="text-xl font-black text-slate-900">NEXUS</span>
             <span className="text-xl font-medium tracking-widest text-slate-900">AETHER</span>
             <span className="text-xl font-bold text-slate-900">Quantum</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How HireOS works</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">A completely automated pipeline from application to shortlisting.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { step: '01', icon: Brain, title: 'AI Resume Parsing', desc: 'Candidates upload their resumes. Our AI instantly extracts skills, experience, and generates a structured profile.' },
             { step: '02', icon: Zap, title: 'Smart Pre-Screening', desc: 'HireOS conducts an automated async interview, asking contextual questions based on the candidate\'s unique background.' },
             { step: '03', icon: BarChart3, title: 'Scoring & Ranking', desc: 'You get a ranked list of candidates with a detailed 0-100 score, complete with AI reasoning and bias checks.' }
           ].map((item, i) => (
             <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 relative overflow-hidden group hover:border-indigo-300 transition-all duration-200 shadow-sm hover:shadow-md">
               <div className="absolute top-0 right-0 p-6 text-6xl font-black text-slate-50 group-hover:text-indigo-50 transition-colors pointer-events-none">
                 {item.step}
               </div>
               <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center mb-6">
                 <item.icon className="w-6 h-6 text-indigo-600" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">{item.title}</h3>
               <p className="text-slate-500 font-medium leading-relaxed relative z-10">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-6 bg-slate-100 border-y border-slate-200">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Recruiters</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Don't just take our word for it.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "HireOS completely eliminated our manual screening phase. We're interviewing candidates 4 days faster than before.", author: "Sarah Jenkins", role: "Head of Talent at Nexus" },
              { text: "The AI interview guide generated for each candidate is scary good. It gives our engineering managers exactly what to ask.", author: "Chen Wei", role: "VP Engineering at Acme Corp" },
              { text: "We used to struggle with biased keyword scanning. HireOS scores candidates holistically and the matching is incredibly accurate.", author: "Elena Rodriguez", role: "Recruiting Manager at TechFlow" }
            ].map((review, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <Quote className="w-8 h-8 text-indigo-500/20 mb-4" />
                <p className="text-slate-700 font-medium leading-relaxed mb-8 flex-1">"{review.text}"</p>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{review.author}</p>
                  <p className="text-sm text-slate-500 font-medium">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Start for free, upgrade when you need to scale.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-slate-900">
          {/* Free Tier */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">Perfect for solo recruiters & small teams.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-slate-500 font-medium decoration-none">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 3 active jobs', 'Basic AI resume parsing', '50 candidates/month', 'Community support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 font-medium text-sm text-slate-600">
                   <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50">Get Started</Button>
          </div>

          {/* Growth Tier (Highlighted) */}
          <div className="bg-white border-2 border-indigo-600 rounded-xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-xl shadow-indigo-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">Most Popular</div>
            <h3 className="text-xl font-bold mb-2">Growth</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">For growing companies hiring at scale.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-indigo-600">$99</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 10 active jobs', 'Full AI resume parsing', '200 candidates/month', 'Basic bias detection', 'Email support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 font-medium text-sm text-slate-600">
                   <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                   {feature}
                 </li>
              ))}
            </ul>
            <Button className="w-full font-extrabold bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-none">Start 14-Day Free Trial</Button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">Advanced features for power users.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$199</span>
              <span className="text-slate-500 font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited active jobs', 'Advanced AI scoring & ranking', 'Automated AI interviews', 'Unlimited candidates', 'Priority email support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 font-medium text-sm text-slate-600">
                   <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50">Upgrade to Pro</Button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col shadow-sm">
            <h3 className="text-xl font-bold mb-2">Enterprise</h3>
            <p className="text-slate-500 font-medium text-sm mb-6">Custom limits and enterprise features.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Everything in Pro', 'Custom API integrations', 'Dedicated account manager', 'SSO / SAML login', 'Uptime SLA'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 font-medium text-sm text-slate-600">
                   <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full border-slate-200 text-slate-600 font-bold hover:bg-slate-50">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-20 pb-10 px-6 text-sm">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl text-slate-900">HireOS</span>
              </div>
              <p className="text-slate-500 max-w-xs font-medium leading-relaxed">
                The AI-powered hiring platform designed to eliminate bias and accelerate the recruiting pipeline.
              </p>
              <div className="flex items-center gap-5">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            {/* ... other link columns ... */}
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-6">Product</h4>
              <ul className="space-y-4">
                <li><button onClick={(e) => handleNav('features')} className="text-slate-500 font-medium hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer p-0">Features</button></li>
                <li><button onClick={(e) => handleNav('pricing')} className="text-slate-500 font-medium hover:text-indigo-600 transition-colors border-none bg-transparent cursor-pointer p-0">Pricing</button></li>
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-widest text-[10px] mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="text-slate-500 font-medium hover:text-indigo-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-slate-400 font-medium">© 2025 HireOS Inc. All rights reserved.</p>
             <div className="flex items-center gap-2 text-slate-400 font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                All systems operational
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
