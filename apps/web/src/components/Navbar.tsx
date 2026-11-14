import React, { useState } from 'react';
import { Sparkles, ChevronDown, CheckCircle, Shield } from 'lucide-react';
import type { UserRole } from '@brandvault/shared';
import { AIDisclosureModal } from './AIDisclosureModal';
import { ChromeShield } from './ChromeIcons';
import type { NavTab } from './Sidebar';

interface Props {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  brandName: string;
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingReviewsCount?: number;
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

export const Navbar: React.FC<Props> = ({ 
  currentRole, 
  onRoleChange, 
  brandName, 
  currentTab, 
  onTabChange,
  pendingReviewsCount = 0
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showDisclosure, setShowDisclosure] = useState(false);

  const currentUser = USERS_BY_ROLE[currentRole] || USERS_BY_ROLE.admin;

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Overview' },
    { id: 'studio' as NavTab, label: 'Studio' },
    { id: 'reviews' as NavTab, label: 'Reviews', badge: pendingReviewsCount > 0 ? pendingReviewsCount : null },
    { id: 'knowledge' as NavTab, label: 'Knowledge' },
    { id: 'analytics' as NavTab, label: 'Analytics' },
    { id: 'audit' as NavTab, label: 'Audit & AI' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-6 py-4 bg-[#08080a]/90 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between">
        {/* Left: Brand Identity with 3D Chrome Shield */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <ChromeShield className="w-8 h-8 filter drop-shadow-md transition-transform group-hover:scale-105" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                BrandVault
              </span>
              <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold">
                AI
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium">
              {brandName || 'Nexus Enterprise AI'}
            </div>
          </div>
        </div>

        {/* Center: The Floating Capsule Navigation Bar (as seen in all FLK reference images) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-[#121217]/95 rounded-full border border-white/10 shadow-2xl backdrop-blur-xl">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1e1e27] text-white border border-white/20 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* AI Transparency Button */}
          <button
            onClick={() => setShowDisclosure(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#14141c] border border-white/10 text-slate-300 hover:border-amber-500/40 hover:text-amber-300 transition-all cursor-pointer shadow-sm"
            title="Click to view AI Transparency & Responsible Governance disclosures"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-[11px]">Groq Zero-Retention</span>
          </button>

          {/* User Persona & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121217] border border-white/10 hover:border-white/20 transition-all text-left shadow-sm"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-amber-500/40"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-slate-500 ml-1.5 capitalize">({currentRole})</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0e0e13] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-white/[0.06] font-mono">
                  Switch Active Persona
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors mt-1 ${
                        isSelected 
                          ? 'bg-[#1e1e27] text-white font-semibold border border-white/10' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10" />
                      <div className="flex-1">
                        <div className="text-white text-xs">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.title}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
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
