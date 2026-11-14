import React from 'react';

// Adwise Pastel Glass Avatar Icon
export const ChromeAvatar: React.FC<{ className?: string }> = ({ className = "w-9 h-9" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="adwiseAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#CDB4DB" />
        <stop offset="50%" stopColor="#FFC8DD" />
        <stop offset="100%" stopColor="#A2D2FF" />
      </linearGradient>
      <filter id="avatarDrop" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#CDB4DB" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#avatarDrop)">
      <circle cx="32" cy="22" r="13" fill="url(#adwiseAvatarGrad)" stroke="#ffffff" strokeWidth="2" />
      <ellipse cx="28" cy="18" rx="4" ry="6" fill="#ffffff" opacity="0.6" />
      <path
        d="M14 50C14 40.0589 22.0589 35 32 35C41.9411 35 50 40.0589 50 50V53C50 54.1046 49.1046 55 48 55H16C14.8954 55 14 54.1046 14 53V50Z"
        fill="url(#adwiseAvatarGrad)"
        stroke="#ffffff"
        strokeWidth="2"
      />
    </g>
  </svg>
);

// Adwise Pastel Airplane Icon
export const ChromePaperPlane: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="planeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFAFCC" />
        <stop offset="100%" stopColor="#A2D2FF" />
      </linearGradient>
      <linearGradient id="planeGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFC8DD" />
        <stop offset="100%" stopColor="#BDE0FE" />
      </linearGradient>
    </defs>
    <g transform="rotate(-15 32 32)">
      <polygon points="56,8 32,56 28,34" fill="url(#planeGrad1)" stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="56,8 8,26 28,34" fill="url(#planeGrad2)" stroke="#ffffff" strokeWidth="1.2" />
      <polygon points="28,34 32,56 36,36" fill="#CDB4DB" />
      <line x1="56" y1="8" x2="28" y2="34" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

// Adwise Pastel Glass Shield
export const ChromeShield: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFC8DD" />
        <stop offset="40%" stopColor="#CDB4DB" />
        <stop offset="100%" stopColor="#A2D2FF" />
      </linearGradient>
    </defs>
    <path
      d="M32 6L52 14V30C52 44 43 54 32 58C21 54 12 44 12 30V14L32 6Z"
      fill="url(#shieldGrad)"
      stroke="#ffffff"
      strokeWidth="2.5"
    />
    <path
      d="M32 12V52C40 48 46 40 46 30V18L32 12Z"
      fill="#ffffff"
      opacity="0.35"
    />
    <circle cx="32" cy="28" r="5" fill="#ffffff" />
    <path d="M32 33V39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Outline Design Tools in soft slate
export const OutlinePenTool: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-slate-400" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 36L8 40L12 44L16 40L12 36Z" strokeLinejoin="round" />
    <path d="M12 36L34 14C36 12 38 12 40 14C42 16 42 18 40 20L18 42L12 36Z" strokeLinejoin="round" />
    <circle cx="37" cy="17" r="2" fill="currentColor" />
  </svg>
);

export const OutlineBezierNodes: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-slate-400" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="8" y="8" width="8" height="8" strokeDasharray="2 2" />
    <rect x="32" y="8" width="8" height="8" strokeDasharray="2 2" />
    <rect x="8" y="32" width="8" height="8" strokeDasharray="2 2" />
    <path d="M32 32L40 40M40 32L32 40" strokeLinecap="round" />
    <path d="M16 12H32M12 16V32" strokeDasharray="3 3" />
  </svg>
);

export const OutlineEyedropper: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-slate-400" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M28 8L38 18L34 22L30 18L18 30V34H22L34 22" strokeLinejoin="round" />
    <path d="M18 34L14 38H10V34L14 30L18 34Z" strokeLinejoin="round" />
    <path d="M8 44C8 42 10 40 12 40C14 40 16 42 16 44C16 46 12 48 12 48C12 48 8 46 8 44Z" fill="currentColor" />
  </svg>
);

export const OutlineMagicWand: React.FC<{ className?: string }> = ({ className = "w-10 h-10 text-slate-400" }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="8" y1="40" x2="32" y2="16" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 14L34 18" strokeWidth="2" />
    <path d="M38 8V12M36 10H40" strokeLinecap="round" />
    <path d="M18 6V10M16 8H20" strokeLinecap="round" />
    <path d="M42 22V26M40 24H44" strokeLinecap="round" />
  </svg>
);

// Adwise Glass Sticker Badge
export const TiltedSticker: React.FC<{ text: string; subtext?: string; className?: string }> = ({
  text,
  subtext,
  className = ""
}) => (
  <div className={`inline-block transform rotate-3 hover:rotate-0 transition-transform duration-300 ${className}`}>
    <div className="bg-gradient-to-r from-[#FFC8DD] to-[#A2D2FF] text-slate-900 px-4 py-2 rounded-2xl shadow-lg border border-white/80 font-sans font-bold text-xs uppercase tracking-tight flex flex-col items-center leading-none">
      <span className="text-xs font-black tracking-tight text-slate-800">{text}</span>
      {subtext && <span className="text-[9px] font-semibold tracking-wider text-slate-600 mt-0.5">{subtext}</span>}
    </div>
  </div>
);

// Circular Tool Badge with Adwise Pastel Progress Ring
export const CircularToolBadge: React.FC<{
  title: string;
  label: string;
  percentage?: number;
  iconBgColor?: string;
  iconContent: React.ReactNode;
}> = ({ title, label, percentage = 92, iconBgColor = "rgba(255, 255, 255, 0.6)", iconContent }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="url(#adwiseRingGrad)"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
          <defs>
            <linearGradient id="adwiseRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFAFCC" />
              <stop offset="100%" stopColor="#A2D2FF" />
            </linearGradient>
          </defs>
        </svg>

        <div
          className="absolute w-12 h-12 rounded-full flex items-center justify-center shadow-inner border border-white/80 backdrop-blur-md"
          style={{ backgroundColor: iconBgColor }}
        >
          {iconContent}
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold text-slate-800 tracking-tight">{title}</div>
        <div className="text-[10px] text-slate-600 capitalize font-medium">{label}</div>
      </div>
    </div>
  );
};
