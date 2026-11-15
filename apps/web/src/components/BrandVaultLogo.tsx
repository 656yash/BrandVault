import React from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandVaultLogo: React.FC<Props> = ({ 
  className = '', 
  size = 'md',
  showTagline = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Vault Icon with Pastel Glass Shimmer */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 64 64" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(205,180,219,0.55)]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="vaultOuterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#CDB4DB" />
              <stop offset="25%" stopColor="#FFC8DD" />
              <stop offset="50%" stopColor="#FFAFCC" />
              <stop offset="75%" stopColor="#BDE0FE" />
              <stop offset="100%" stopColor="#A2D2FF" />
            </linearGradient>
            <linearGradient id="vaultInnerGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Outer Rounded Shield / Vault Silhouette */}
          <path
            d="M32 4L10 12V28C10 44.5 19.5 56 32 60C44.5 56 54 44.5 54 28V12L32 4Z"
            fill="url(#vaultOuterGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Frosted Inner Vault Plate */}
          <circle
            cx="32"
            cy="30"
            r="14"
            fill="url(#vaultInnerGrad)"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          {/* Vault Locking Nodes & Central Indicator */}
          <circle cx="32" cy="30" r="5" fill="#475569" opacity="0.8" />
          <line x1="32" y1="20" x2="32" y2="24" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="32" y1="36" x2="32" y2="40" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="22" y1="30" x2="26" y2="30" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="38" y1="30" x2="42" y2="30" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="32" cy="30" r="2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Modern Typographic Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black ${textSizes[size]} tracking-tight text-slate-900 font-sans`}>
            Brand<span className="text-pink-600 font-extrabold">Vault</span>
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-soft/35 text-slate-800 border border-white/80 shadow-xs">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 font-medium tracking-tight -mt-0.5">
            Your Brand. Your Standards. Always Consistent.
          </span>
        )}
      </div>
    </div>
  );
};
