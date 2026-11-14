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
      <header className="sticky top-0 z-40 w-full px-6 py-4 bg-[#050507]/80 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between">
        {/* Left: Brand Identity with 3D Chrome Shield */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <ChromeShield className="w-8 h-8 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)] transition-transform group-hover:scale-105" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                BrandVault
              </span>
              <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 border border-white/20 font-bold">
                AI
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-medium">
              {brandName || 'Nexus Enterprise AI'}
            </div>
          </div>
        </div>

        {/* Center: The Floating Glassmorphic Capsule Navigation Bar (Primary Site Navigation) */}
        <nav className="flex items-center gap-1 p-1.5 bg-zinc-950/70 rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-x-auto max-w-full">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-4 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white/15 text-white border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-white/20 text-white border border-white/30">
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
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/[0.04] border border-white/10 text-zinc-300 hover:border-white/25 hover:text-white transition-all cursor-pointer shadow-sm backdrop-blur-lg"
            title="Click to view AI Transparency & Responsible Governance disclosures"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
            <span className="font-mono text-[11px]">Zero-Retention Engine</span>
          </button>

          {/* User Persona & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all text-left shadow-sm cursor-pointer backdrop-blur-lg"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
              />
              <div className="hidden sm:block">
                <span className="text-xs font-semibold text-white">{currentUser.name}</span>
                <span className="text-[10px] text-zinc-400 ml-1.5 capitalize">({currentRole})</span>
              </div>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#09090d]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/[0.08] font-mono">
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
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-colors mt-1 cursor-pointer ${
                        isSelected 
                          ? 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm' 
                          : 'text-zinc-400 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20" />
                      <div className="flex-1">
                        <div className="text-white text-xs">{u.name}</div>
                        <div className="text-[10px] text-zinc-400">{u.title}</div>
                      </div>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
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
