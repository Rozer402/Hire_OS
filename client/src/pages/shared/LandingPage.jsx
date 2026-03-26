import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Brain, Shield, BarChart3, Users, CheckCircle, ArrowRight, Star, Quote, Twitter, Linkedin, Github } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] overflow-hidden selection:bg-[#6366f1]/30 selection:text-[#fafafa]">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#18181b]/80 backdrop-blur-md border-b border-[#27272a]">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">HireOS</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#6366f1] bg-[#6366f1]/10 border border-[#6366f1]/20 px-2 py-0.5 rounded-full ml-1">AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-semibold text-[#a1a1aa] hover:text-[#fafafa] transition-colors">Login</Link>
            <Link to="/register">
              <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold shadow-lg shadow-[#6366f1]/20 group border-none">
                Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex items-center justify-center min-h-[90vh]">
        {/* Animated Background Mesh Gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#6366f1]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '4s' }}></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
           {/* Particles grid effect from index.css applies over this automatically */}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/30 text-[#6366f1] text-xs font-bold uppercase tracking-[0.05em] px-4 py-1.5 rounded-full mb-8 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Star className="w-3.5 h-3.5" /> Next-Gen AI Recruiting
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
             Hire the best talent <br />
             <span style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} className="filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
               without bias.
             </span>
          </h1>
          <p className="text-[#a1a1aa] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            HireOS replaces manual screening with AI. Automatically parse resumes, conduct initial interviews, and rank candidates with zero bias.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link to="/register?role=recruiter" className="w-full sm:w-auto">
              <Button size="lg" className="w-full text-base font-bold shadow-xl shadow-[#6366f1]/25 px-8 h-14 group">
                Start Hiring Free <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register?role=candidate" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full text-base font-bold px-8 h-14 bg-[#18181b] border-[#27272a] hover:bg-[#27272a]">
                I'm a Candidate
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By Logos */}
      <section className="py-10 border-y border-[#27272a] bg-[#18181b]/50">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[0.75rem] font-bold text-[#a1a1aa] uppercase tracking-[0.1em] mb-6">Trusted by innovative teams</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="text-xl font-bold font-serif">Acme Corp</span>
             <span className="text-xl font-extrabold tracking-tighter">GLOBAL</span>
             <span className="text-xl font-semibold italic">TechFlow</span>
             <span className="text-xl font-black">NEXUS</span>
             <span className="text-xl font-medium tracking-widest">AETHER</span>
             <span className="text-xl font-bold">Quantum</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How HireOS works</h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto font-medium">A completely automated pipeline from application to shortlisting.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { step: '01', icon: Brain, title: 'AI Resume Parsing', desc: 'Candidates upload their resumes. Our AI instantly extracts skills, experience, and generates a structured profile.' },
             { step: '02', icon: Zap, title: 'Smart Pre-Screening', desc: 'HireOS conducts an automated async interview, asking contextual questions based on the candidate\'s unique background.' },
             { step: '03', icon: BarChart3, title: 'Scoring & Ranking', desc: 'You get a ranked list of candidates with a detailed 0-100 score, complete with AI reasoning and bias checks.' }
           ].map((item, i) => (
             <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-8 relative overflow-hidden group hover:border-[#6366f1]/50 transition-colors">
               <div className="absolute top-0 right-0 p-6 text-6xl font-black text-[#27272a]/30 group-hover:text-[#6366f1]/10 transition-colors pointer-events-none">
                 {item.step}
               </div>
               <div className="w-12 h-12 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-xl flex items-center justify-center mb-6">
                 <item.icon className="w-6 h-6 text-[#6366f1]" />
               </div>
               <h3 className="text-xl font-bold text-[#fafafa] mb-3 relative z-10">{item.title}</h3>
               <p className="text-[#a1a1aa] font-medium leading-relaxed relative z-10">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section className="py-24 px-6 bg-[#18181b] border-y border-[#27272a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Recruiters</h2>
            <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto font-medium">Don't just take our word for it.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { text: "HireOS completely eliminated our manual screening phase. We're interviewing candidates 4 days faster than before.", author: "Sarah Jenkins", role: "Head of Talent at Nexus" },
              { text: "The AI interview guide generated for each candidate is scary good. It gives our engineering managers exactly what to ask.", author: "David Chen", role: "VP Engineering at Acme Corp" },
              { text: "We used to struggle with biased keyword scanning. HireOS scores candidates holistically and the matching is incredibly accurate.", author: "Elena Rodriguez", role: "Recruiting Manager at TechFlow" }
            ].map((review, i) => (
              <div key={i} className="bg-[#09090b] border border-[#27272a] rounded-[12px] p-8 flex flex-col">
                <Quote className="w-8 h-8 text-[#6366f1]/40 mb-4" />
                <p className="text-[#fafafa] font-medium leading-relaxed mb-8 flex-1">"{review.text}"</p>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-[#6366f1] text-[#6366f1]" />)}
                </div>
                <div>
                  <p className="font-bold text-[#fafafa]">{review.author}</p>
                  <p className="text-sm text-[#a1a1aa] font-medium">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-[#a1a1aa] text-lg max-w-2xl mx-auto font-medium">Start for free, upgrade when you need to scale.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {/* Free Tier */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#fafafa] mb-2">Starter</h3>
            <p className="text-[#a1a1aa] font-medium text-sm mb-6">Perfect for solo recruiters & small teams.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$0</span>
              <span className="text-[#a1a1aa] font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 3 active jobs', 'Basic AI resume parsing', '50 candidates/month', 'Community support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 text-[#fafafa] font-medium text-sm">
                   <div className="mt-0.5 rounded-full bg-[#10b981]/10 p-0.5"><CheckCircle className="w-3.5 h-3.5 text-[#10b981]" /></div>
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="secondary" className="w-full bg-[#27272a] hover:bg-[#3f3f46] font-bold">Get Started</Button>
          </div>

          {/* Growth Tier (Highlighted) */}
          <div className="bg-[#18181b] border-2 border-[#6366f1] rounded-[12px] p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-[#6366f1]/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#6366f1] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">Most Popular</div>
            <h3 className="text-xl font-bold text-[#fafafa] mb-2">Growth</h3>
            <p className="text-[#a1a1aa] font-medium text-sm mb-6">For growing companies hiring at scale.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$99</span>
              <span className="text-[#a1a1aa] font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Up to 10 active jobs', 'Full AI resume parsing', '200 candidates/month', 'Basic bias detection', 'Email support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 text-[#fafafa] font-medium text-sm">
                   <div className="mt-0.5 rounded-full bg-[#10b981]/10 p-0.5"><CheckCircle className="w-3.5 h-3.5 text-[#10b981]" /></div>
                   {feature}
                 </li>
              ))}
            </ul>
            <Button className="w-full font-bold shadow-lg shadow-[#6366f1]/20">Start 14-Day Free Trial</Button>
          </div>

          {/* Pro Tier */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#fafafa] mb-2">Pro</h3>
            <p className="text-[#a1a1aa] font-medium text-sm mb-6">Advanced features for power users.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$199</span>
              <span className="text-[#a1a1aa] font-medium">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Unlimited active jobs', 'Advanced AI scoring & ranking', 'Automated AI interviews', 'Unlimited candidates', 'Priority email support'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 text-[#fafafa] font-medium text-sm">
                   <div className="mt-0.5 rounded-full bg-[#10b981]/10 p-0.5"><CheckCircle className="w-3.5 h-3.5 text-[#10b981]" /></div>
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="secondary" className="w-full bg-[#27272a] hover:bg-[#3f3f46] font-bold">Upgrade to Pro</Button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-[#18181b] border border-[#27272a] rounded-[12px] p-8 flex flex-col">
            <h3 className="text-xl font-bold text-[#fafafa] mb-2">Enterprise</h3>
            <p className="text-[#a1a1aa] font-medium text-sm mb-6">Custom limits and enterprise features.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">Custom</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {['Everything in Pro', 'Custom API integrations', 'Dedicated account manager', 'SSO / SAML login', 'Uptime SLA'].map(feature => (
                 <li key={feature} className="flex items-start gap-3 text-[#fafafa] font-medium text-sm">
                   <div className="mt-0.5 rounded-full bg-[#10b981]/10 p-0.5"><CheckCircle className="w-3.5 h-3.5 text-[#10b981]" /></div>
                   {feature}
                 </li>
              ))}
            </ul>
            <Button variant="secondary" className="w-full bg-[#27272a] hover:bg-[#3f3f46] font-bold">Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Advanced Footer */}
      <footer className="bg-[#18181b] border-t border-[#27272a] pt-16 pb-8 px-6 text-sm">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-md flex items-center justify-center">
                  <Zap className="w-3 h-3 text-white" />
                </div>
                <span className="font-bold text-lg">HireOS</span>
              </div>
              <p className="text-[#a1a1aa] max-w-xs font-medium leading-relaxed">
                The AI-powered hiring platform designed to eliminate bias and accelerate the recruiting pipeline.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a href="#" className="text-[#a1a1aa] hover:text-[#fafafa]"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-[#a1a1aa] hover:text-[#fafafa]"><Linkedin className="w-5 h-5" /></a>
                <a href="#" className="text-[#a1a1aa] hover:text-[#fafafa]"><Github className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#fafafa] uppercase tracking-[0.05em] text-xs mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Features</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Pricing</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Integrations</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#fafafa] uppercase tracking-[0.05em] text-xs mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">About Us</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Careers</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Blog</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#fafafa] uppercase tracking-[0.05em] text-xs mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[#a1a1aa] font-medium hover:text-[#fafafa] transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#27272a] pt-8 flex flex-col md:flex-row items-center justify-between">
             <p className="text-[#a1a1aa] font-medium mb-4 md:mb-0">© 2025 HireOS Inc. All rights reserved.</p>
             <div className="flex items-center gap-2 text-[#a1a1aa] font-medium">
                <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                All systems operational
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
