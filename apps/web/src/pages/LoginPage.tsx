import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BrandVaultLogo } from '../components/BrandVaultLogo';
import type { UserRole } from '@brandvault/shared';

interface Props {
  onSuccess: () => void;
  onAddInitialBrand?: (brand: any) => void;
  onBackToLanding?: () => void;
  onExploreDemo?: () => void;
}

export const LoginPage: React.FC<Props> = ({ 
  onSuccess, 
  onAddInitialBrand,
  onBackToLanding,
  onExploreDemo 
}) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (isForgotPassword) {
      setTimeout(() => {
        setLoading(false);
        setSuccessMsg(`Password reset instructions sent to ${email}. Check your inbox.`);
      }, 700);
      return;
    }

    try {
      if (isRegister) {
        await register(email, password, name || email.split('@')[0], newBrandName);
        if (newBrandName && onAddInitialBrand) {
          onAddInitialBrand({
            id: `brand_${Date.now()}`,
            name: newBrandName,
            description: `${newBrandName} corporate brand workspace.`,
            primaryColor: '#FFAFCC',
            secondaryColor: '#BDE0FE',
            accentColor: '#CDB4DB',
            toneKeywords: ['innovative', 'trustworthy', 'empowering'],
            restrictedTopics: ['unsubstantiated claims'],
          });
        }
      } else {
        await login(email, password);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 font-sans text-slate-800">
      {/* Adwise Ambient Organic Pastel Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[460px] h-[460px] bg-pink-soft/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[560px] h-[560px] bg-blue-sky/35 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[30%] right-[15%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar for Navigating Back */}
      {onBackToLanding && (
        <div className="fixed top-6 left-6 z-20">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 hover:bg-white text-xs font-bold text-slate-700 border border-white shadow-sm transition-all hover:scale-105 cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 md:p-10 relative z-10 space-y-6 shadow-2xl border border-white animate-in fade-in duration-300">
        {/* Header with BrandVault Logo */}
        <div className="flex flex-col items-center text-center space-y-2">
          <BrandVaultLogo size="lg" showTagline={false} />
          <p className="text-xs text-slate-600 font-medium max-w-xs mt-1">
            {isForgotPassword
              ? 'Enter your work email to receive password reset instructions.'
              : isRegister
              ? 'Create your organization account and brand governance workspace.'
              : 'Sign in to access your brand intelligence and compliance workbench.'}
          </p>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-white shadow-sm mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-600 font-bold">
              Firestore Secure Auth • Multi-Tenant
            </span>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register (Hidden if in Forgot Password mode) */}
        {!isForgotPassword && (
          <div className="flex items-center p-1 rounded-2xl bg-white/60 border border-white text-xs font-bold shadow-inner">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(null); setSuccessMsg(null); }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback Alerts */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && !isForgotPassword && (
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
              />
            </div>
          </div>

          {!isForgotPassword && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-slate-700 font-bold">Password</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }}
                    className="text-[11px] text-pink-600 hover:text-pink-700 font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {isRegister && !isForgotPassword && (
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Initial Brand Workspace Name</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Acme Global or MyBrand AI"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full glass-button flex items-center justify-center gap-2 py-3 rounded-xl text-slate-900 font-bold shadow-lg hover:scale-[1.02] transition-all cursor-pointer mt-2 disabled:opacity-70"
          >
            <span>
              {loading
                ? 'Processing...'
                : isForgotPassword
                ? 'Send Reset Link'
                : isRegister
                ? 'Register & Enter Workspace'
                : 'Sign In to Workspace'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </form>

        {isForgotPassword && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => { setIsForgotPassword(false); setError(null); }}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Demo Exploration Link */}
        {onExploreDemo && (
          <div className="pt-3 border-t border-white/60 text-center">
            <button
              type="button"
              onClick={onExploreDemo}
              className="w-full py-2.5 rounded-xl bg-white/60 hover:bg-white text-slate-700 hover:text-slate-900 text-xs font-bold border border-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Explore Live Platform Demo (No Login Required)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

