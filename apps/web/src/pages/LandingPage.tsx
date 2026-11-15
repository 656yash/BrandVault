import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  Layers, 
  BarChart3, 
  Lock, 
  Cpu, 
  AlertTriangle, 
  Check, 
  Zap, 
  Eye, 
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Users
} from 'lucide-react';
import { BrandVaultLogo } from '../components/BrandVaultLogo';
import { ChromePaperPlane, ChromeShield, CircularToolBadge } from '../components/ChromeIcons';

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
  onExplorePlatform: () => void;
}

export const LandingPage: React.FC<Props> = ({
  onGetStarted,
  onSignIn,
  onExplorePlatform,
}) => {
  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-slate-800">
      {/* Adwise Ambient Pastel Background Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[550px] h-[550px] bg-pink-soft/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[650px] h-[650px] bg-blue-sky/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[35%] right-[15%] w-[450px] h-[450px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full px-6 py-3.5 bg-white/40 backdrop-blur-2xl border-b border-white/50 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandVaultLogo size="md" showTagline={false} />

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 glass-capsule rounded-full">
            <a href="#product" className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-colors">
              Product
            </a>
            <a href="#features" className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-colors">
              How It Works
            </a>
            <a href="#security" className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 rounded-full transition-colors">
              Security
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSignIn}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-white/50 rounded-full transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={onGetStarted}
              className="glass-button flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-28">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-7 pt-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-white text-xs font-mono font-bold text-slate-800 shadow-sm animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>AI-Powered Brand Intelligence &amp; Governance Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto font-sans leading-[1.1]">
            Protect Your Brand. <br />
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Govern Every Story.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Your Brand. Your Standards. Always Consistent. <br />
            BrandVault acts as your enterprise automated Brand Compliance Officer, pre-flighting marketing copy, documents, and creative assets against verified guidelines before release.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="glass-button flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-900 shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplorePlatform}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-800 bg-white/75 hover:bg-white border border-white shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Explore Platform</span>
            </button>
          </div>

          {/* Interactive Hero Mockup Preview */}
          <div className="pt-8 max-w-5xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 space-y-6 shadow-2xl border border-white relative group">
              <div className="flex items-center justify-between border-b border-white/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400" />
                    <span className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 bg-white/70 px-3 py-1 rounded-full border border-white">
                    BrandVault AI Pre-Flight Monitor
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                  98/100 Brand Health Score
                </span>
              </div>

              {/* Grid Demo Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Tone &amp; Voice Purity</span>
                    <span className="text-pink-600 font-mono">96%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[96%] h-full bg-pink-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-500">Zero condescension or aggressive sales urgency detected.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Substantiated Claims</span>
                    <span className="text-purple-600 font-mono">100%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-purple-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-500">Superlatives backed by verified corporate audit citations.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/70 border border-white space-y-2 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Visual &amp; A11y Standards</span>
                    <span className="text-blue-600 font-mono">WCAG AA</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-blue-500 rounded-full" />
                  </div>
                  <p className="text-[11px] text-slate-500">Logo clear-space 28px (&gt;24px spec) &amp; 5.8:1 contrast ratio.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM & SOLUTION SECTION */}
        <section id="product" className="space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-pink-600 font-bold">
              The Brand Governance Moat
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why High-Growth Brands Drift
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              As decentralized marketing and creator teams scale, maintaining brand standards becomes an impossible manual bottleneck.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Inconsistent Voice',
                desc: 'Scattered copywriters, agencies, and regional teams dilute brand tone with hyperbolic puffery or unprofessional slang.',
                fix: 'Tone Agent checks real-time voice & emotional alignment.',
                icon: AlertTriangle,
                color: 'text-amber-600',
                bg: 'bg-amber-100',
              },
              {
                title: 'Outdated & Risky Claims',
                desc: 'Unsubstantiated market leadership superlatives ("No. 1") create immediate consumer advertising liability.',
                fix: 'Claims Agent verifies legal documentation & audit citations.',
                icon: ShieldCheck,
                color: 'text-rose-600',
                bg: 'bg-rose-100',
              },
              {
                title: 'Vocabulary Contamination',
                desc: 'Discouraged synonyms ("cheap" instead of "cost-effective") and competitor disparagement degrade positioning.',
                fix: 'Terminology Agent suggests context-preserving corrections.',
                icon: BookOpen,
                color: 'text-purple-600',
                bg: 'bg-purple-100',
              },
              {
                title: 'Visual Misalignment',
                desc: 'Mismatched brand palettes, truncated clear-space margins, and low accessibility contrast pass into public campaigns.',
                fix: 'Visual & A11y Agent inspects contrast & margin specs.',
                icon: Eye,
                color: 'text-blue-600',
                bg: 'bg-blue-100',
              },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`${idx % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-6 space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-md flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-xs`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/50 text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item.fix}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6 PRODUCT FEATURES */}
        <section id="features" className="space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-purple-600 font-bold">
              Autonomous Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Enterprise Brand Intelligence Engine
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Everything your organization needs to review, govern, and approve content before public distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'AI Content Review Studio',
                desc: 'Sub-second pre-flight inspection for social media, marketing copy, and publishing documents with live character and word diagnostics.',
                icon: ChromePaperPlane,
              },
              {
                title: 'Brand Knowledge Centre',
                desc: 'Centralized registry of approved corporate facts, brand guidelines, terminology dictionaries, and reusable vector design assets.',
                icon: BookOpen,
              },
              {
                title: 'Intelligent Suggestions',
                desc: 'Context-preserving 1-click replacements that preserve marketing rhythm while enforcing brand standards without forced overrides.',
                icon: Sparkles,
              },
              {
                title: 'Authorised Approval Workflows',
                desc: 'Human-in-the-loop review queue for compliance officers and brand directors, stamped with immutable cryptographic seals.',
                icon: ShieldCheck,
              },
              {
                title: 'Governance Analytics',
                desc: 'Track brand health trends, recurring terminology drift, departmental compliance velocity, and contested guideline ambiguity.',
                icon: BarChart3,
              },
              {
                title: 'Immutable Audit Trail',
                desc: 'SOC 2 Type II compliant chronological audit records tracking every scan, guideline modification, and human sign-off decision.',
                icon: Lock,
              },
            ].map((feat, idx) => (
              <div 
                key={idx} 
                className={`${idx % 2 === 0 ? 'glass-panel' : 'glass-panel-alt'} p-7 space-y-4 hover:scale-[1.02] transition-transform duration-300 shadow-lg`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white flex items-center justify-center text-pink-600 shadow-sm">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs uppercase font-mono tracking-widest text-blue-600 font-bold">
              Seamless 5-Step Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Draft to Sealed Publication
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Define Standards', desc: 'Add or import brand guidelines, prohibited terminology, and verified corporate facts.' },
              { step: '02', title: 'Draft or Upload', desc: 'Paste marketing copy, upload documents, or upload creative banners in Studio.' },
              { step: '03', title: 'AI Pre-Flight', desc: 'Sub-second multi-agent diagnostics evaluate voice, claims, facts, and accessibility.' },
              { step: '04', title: 'Refine & Control', desc: 'Review explainable findings and apply 1-click suggestions with total creator autonomy.' },
              { step: '05', title: 'Cryptographic Seal', desc: 'Authorised compliance directors sign off and issue a verified compliance stamp.' },
            ].map((step, idx) => (
              <div key={idx} className="glass-panel p-5 space-y-3 relative shadow-md flex flex-col justify-between">
                <span className="text-2xl font-black font-mono text-pink-500/80">{step.step}</span>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECURITY & GOVERNANCE */}
        <section id="security" className="glass-panel p-8 sm:p-12 space-y-8 shadow-2xl border border-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-700 font-bold">
                Enterprise Trust Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Zero-Retention AI &amp; Cloudflare Edge Isolation
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Your unreleased marketing campaigns, proprietary guidelines, and confidential corporate communications never leave your isolated tenant boundary.
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs border border-emerald-300">
              <Lock className="w-4 h-4" />
              <span>SOC 2 Type II Certified Process</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/50 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" />
                <span>Volatile Memory Processing</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Content is scanned in transient memory and never used to train external foundational AI models.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-pink-600" />
                <span>Multi-Tenant Boundary</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Brand workspaces operate in strict cryptographic database isolation with encrypted cloud storage.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                <span>Cryptographic Audit Seals</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Every release is stamped with a non-repudiable cryptographic seal guaranteeing governance sign-off.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="glass-panel-alt p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
            Ready to Protect Your Brand at Scale?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium">
            Join enterprise compliance directors and forward-thinking marketing teams ensuring every word reflects approved standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onGetStarted}
              className="glass-button flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-slate-900 shadow-xl hover:scale-105 transition-all cursor-pointer"
            >
              <span>Create Your Brand Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onExplorePlatform}
              className="px-8 py-3.5 rounded-full text-sm font-bold text-slate-800 bg-white/80 hover:bg-white border border-white shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              Explore Live Demo
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/50 bg-white/40 backdrop-blur-md py-8 px-6 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandVaultLogo size="sm" showTagline={false} />
          <p className="font-medium text-[11px]">
            © {new Date().getFullYear()} BrandVault AI. Intelligent Brand Governance &amp; Compliance Platform.
          </p>
          <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-700">
            <a href="#product" className="hover:text-slate-900">Product</a>
            <a href="#security" className="hover:text-slate-900">Security</a>
            <button onClick={onSignIn} className="hover:text-slate-900 cursor-pointer">Sign In</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
