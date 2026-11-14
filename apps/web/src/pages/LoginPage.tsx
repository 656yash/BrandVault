import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ChromeShield } from '../components/ChromeIcons';
import type { UserRole } from '@brandvault/shared';

interface Props {
  onSuccess: () => void;
  onAddInitialBrand?: (brand: any) => void;
}

export const LoginPage: React.FC<Props> = ({ onSuccess, onAddInitialBrand }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Adwise Ambient Organic Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[420px] h-[420px] bg-pink-soft/45 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[520px] h-[520px] bg-blue-sky/45 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-[30%] right-[15%] w-[380px] h-[380px] bg-primary/25 rounded-full blur-3xl pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md glass-panel p-8 md:p-10 relative z-10 space-y-6 shadow-2xl border border-white">
        {/* Header with Emblem */}
        <div className="flex flex-col items-center text-center space-y-2">
          <ChromeShield className="w-14 h-14 filter drop-shadow-[0_4px_12px_rgba(205,180,219,0.5)] mb-1" />
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight font-sans">
            BrandVault
          </h1>
          <p className="text-xs text-slate-600 font-medium max-w-xs">
            Intelligent brand governance &amp; pre-flight compliance platform.
          </p>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 border border-white shadow-sm mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono text-slate-600 font-bold">
              Firestore Auth • Production Ready
            </span>
          </div>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex items-center p-1 rounded-2xl bg-white/60 border border-white text-xs font-bold shadow-inner">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              !isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
              isRegister ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
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

          <div>
            <label className="block text-slate-700 mb-1 font-bold">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-pink-soft font-medium shadow-sm"
              />
            </div>
          </div>

          {isRegister && (
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
            <span>{loading ? 'Processing...' : isRegister ? 'Register & Enter Workspace' : 'Sign In to Workspace'}</span>
            <ArrowRight className="w-4 h-4 text-slate-900" />
          </button>
        </form>
      </div>
    </div>
  );
};
