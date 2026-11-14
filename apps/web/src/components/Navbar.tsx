import React, { useState } from 'react';
import { Sparkles, ChevronDown, CheckCircle, Shield } from 'lucide-react';
import type { UserRole } from '@brandvault/shared';
import { AIDisclosureModal } from './AIDisclosureModal';
import { ChromeShield } from './ChromeIcons';

export type NavTab = 'dashboard' | 'studio' | 'reviews' | 'knowledge' | 'analytics' | 'audit';

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
    { id: 'audit' as NavTab, label: 'Audit & Trust' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full px-6 py-3.5 bg-white/35 backdrop-blur-2xl border-b border-white/50 flex items-center justify-between shadow-sm">
        {/* Left: Brand Identity with Adwise Pastel Emblem */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_10px_rgba(205,180,219,0.5)] transition-transform group-hover:scale-105" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-800 font-sans">
                BrandVault
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/70 text-slate-800 border border-white/90 font-bold shadow-sm">
                Adwise AI
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              {brandName || 'Nexus Enterprise AI'}
            </div>
          </div>
        </div>

        {/* Center: Adwise Floating Glass Capsule Bar */}
        <nav className="flex items-center gap-1 p-1.5 glass-capsule rounded-full overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'sidebar-active text-slate-900 font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-white/30 font-medium'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#FFAFCC] text-slate-900 shadow-sm">
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
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/50 border border-white/80 text-slate-700 hover:bg-white/80 transition-all cursor-pointer shadow-sm backdrop-blur-md"
            title="Click to view AI Transparency & Responsible Governance disclosures"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-600" />
            <span className="font-mono text-[11px]">Zero-Retention</span>
          </button>

          {/* User Persona & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/80 hover:bg-white/80 transition-all text-left shadow-sm cursor-pointer backdrop-blur-md"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-bold text-slate-800">{currentUser.name}</span>
                <span className="text-[10px] text-slate-600 ml-1.5 capitalize">({currentRole})</span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-600" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 font-mono">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left text-xs transition-colors mt-1 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-pink-soft/30 to-blue-sky/30 text-slate-900 font-bold border border-white/80 shadow-sm' 
                          : 'text-slate-700 hover:bg-white/50'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-300" />
                      <div className="flex-1">
                        <div className="text-slate-900 text-xs font-semibold">{u.name}</div>
                        <div className="text-[10px] text-slate-500">{u.title}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-pink-600" />}
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
