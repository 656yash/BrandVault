import React, { useState } from 'react';
import { Shield, Sparkles, CheckCircle, ChevronDown, User, Activity } from 'lucide-react';
import type { UserRole } from '@brandvault/shared';
import { AIDisclosureModal } from './AIDisclosureModal';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  brandName: string;
}

const USERS_BY_ROLE: Record<UserRole, { name: string; title: string; avatar: string }> = {
  admin: {
    name: 'Alice Vance',
    title: 'Brand Compliance Director',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120'
  },
  manager: {
    name: 'Bob Chen',
    title: 'Senior Marketing Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120'
  },
  creator: {
    name: 'Clara Oswald',
    title: 'Content Creator & Copywriter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'
  },
  compliance_officer: {
    name: 'Sarah Connor',
    title: 'Legal Compliance Officer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'
  }
};

export const Navbar: React.FC<Props> = ({ currentRole, onRoleChange, brandName }) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const currentUser = USERS_BY_ROLE[currentRole] || USERS_BY_ROLE.admin;

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
        {/* BrandVault Brand */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield className="w-5 h-5 fill-current/20" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
                BrandVault
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-semibold">
                  AI
                </span>
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
            <span className="text-slate-500 font-medium">Workspace:</span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-200 border border-slate-700/60 font-medium">
              {brandName || 'Nexus Enterprise AI'}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* AI Disclosure Pill */}
          <button
            onClick={() => setShowDisclosure(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-indigo-950/40 border border-indigo-800/50 text-indigo-300 hover:bg-indigo-900/40 hover:border-indigo-700 transition-all cursor-pointer"
            title="Click to view AI Transparency & Responsible Governance disclosures"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>BrandVault AI • Groq Zero-Retention</span>
          </button>

          {/* Health Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 font-medium">
            <Activity className="w-3.5 h-3.5" />
            <span>Health: 88%</span>
          </div>

          {/* User Persona & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 transition-all text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/30"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">{currentUser.name}</div>
                <div className="text-[10px] text-slate-400 capitalize">{currentRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Active Role (RBAC Demo)
                </div>
                {(['admin', 'manager', 'creator'] as UserRole[]).map((r) => {
                  const u = USERS_BY_ROLE[r];
                  const isSelected = currentRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-colors mt-1 ${
                        isSelected 
                          ? 'bg-indigo-600/20 text-indigo-300 font-semibold' 
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-md object-cover" />
                      <div className="flex-1">
                        <div className="text-white text-xs">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.title}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-4 h-4 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </header>

      <AIDisclosureModal isOpen={showDisclosure} onClose={() => setShowDisclosure(false)} />
    </>
  );
};
