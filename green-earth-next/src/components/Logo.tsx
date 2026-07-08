import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export default function Logo({ size = 'md', showWordmark = true }: LogoProps) {
  const sizeMap = {
    xs: { icon: 28, text: 'text-sm' },
    sm: { icon: 38, text: 'text-lg' },
    md: { icon: 54, text: 'text-2xl' },
    lg: { icon: 84, text: 'text-4xl' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm filter transition-transform hover:scale-105 duration-300"
      >
        {/* Background Sunburst Grid */}
        <circle cx="50" cy="50" r="48" fill="#FAFAF7" stroke="#E2E8F0" strokeWidth="1" />
        <g opacity="0.15">
          <line x1="50" y1="2" x2="50" y2="98" stroke="#6BBF3A" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="2" y1="50" x2="98" y2="50" stroke="#6BBF3A" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="16" y1="16" x2="84" y2="84" stroke="#6BBF3A" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="16" y1="84" x2="84" y2="16" stroke="#6BBF3A" strokeWidth="2" strokeDasharray="3 3" />
        </g>

        {/* Global Globe Circle */}
        <circle cx="50" cy="50" r="30" fill="#EBF5EC" stroke="#6BBF3A" strokeWidth="2" />
        {/* Latitude/Longitude lines inside the globe */}
        <path d="M20 50C20 33.4 33.4 20 50 20C66.6 20 80 33.4 80 50" stroke="#6BBF3A" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
        <path d="M30 50C30 39 39 30 50 30C61 30 70 39 70 50" stroke="#6BBF3A" strokeWidth="1.5" opacity="0.3" />
        <path d="M50 20C50 20 40 32 40 50C40 68 50 80 50 80" stroke="#2E7D32" strokeWidth="1.5" opacity="0.3" />
        <path d="M50 20C50 20 60 32 60 50C60 68 50 80 50 80" stroke="#2E7D32" strokeWidth="1.5" opacity="0.3" />
        <line x1="20" y1="50" x2="80" y2="50" stroke="#2E7D32" strokeWidth="1.5" opacity="0.3" />

        {/* Cradling Leaves (Surrounding bottom & sides of Globe) */}
        {/* Left Leaf */}
        <path
          d="M14 50C14 74 36 84 50 84C40 84 22 72 22 50C22 34 30 26 30 26C30 26 14 34 14 50Z"
          fill="#2E7D32"
          opacity="0.9"
        />
        {/* Right Leaf */}
        <path
          d="M86 50C86 74 64 84 50 84C60 84 78 72 78 50C78 34 70 26 70 26C70 26 86 34 86 50Z"
          fill="#6BBF3A"
          opacity="0.9"
        />

        {/* Tree Growing from Globe Center */}
        {/* Trunk */}
        <path
          d="M48 64C48 64 49 52 46 44C44 40 42 38 42 38H46L49 32L52 38H56C56 38 54 40 52 44C49 52 50 64 50 64H48Z"
          fill="#6B4226"
        />
        {/* Foliage - Inner Cloud Layers */}
        <circle cx="50" cy="26" r="11" fill="#2E7D32" />
        <circle cx="42" cy="31" r="8" fill="#6BBF3A" />
        <circle cx="58" cy="31" r="8" fill="#6BBF3A" />
        {/* Central Bud Accent */}
        <path d="M50 15C50 15 53 21 50 24C47 21 50 15 50 15Z" fill="#FAFAF7" />

        {/* Tech Badges (Water Drop, Wind Turbine, Solar Panel) */}
        {/* 1. Water Drop / Recycle (Bottom Center) */}
        <path
          d="M50 93C52.2 93 54 91.2 54 89C54 86.8 50 82 50 82C50 82 46 86.8 46 89C46 91.2 47.8 93 50 93Z"
          fill="#3B82F6"
        />
        {/* Recycle arrows or simple leaf shape overlay */}
        <circle cx="50" cy="89" r="1.5" fill="#FAFAF7" />

        {/* 2. Tiny Wind Turbine (Top Left Overlay) */}
        <g transform="translate(26, 44)">
          {/* Mast */}
          <line x1="0" y1="12" x2="-2" y2="0" stroke="#718096" strokeWidth="1" />
          {/* Blades */}
          <path d="M-2 0 L-2 -6 L-1 -6 Z" fill="#94A3B8" />
          <path d="M-2 0 L4 3 L4 4 Z" fill="#94A3B8" />
          <path d="M-2 0 L-6 4 L-7 3 Z" fill="#94A3B8" />
          <circle cx="-2" cy="0" r="1" fill="#475569" />
        </g>

        {/* 3. Tiny Solar Panel (Top Right Overlay) */}
        <g transform="translate(64, 42)">
          {/* Grid Panel Base */}
          <rect x="0" y="0" width="10" height="7" rx="1" fill="#1E3A8A" stroke="#94A3B8" strokeWidth="0.5" transform="rotate(15)" />
          <line x1="2" y1="2" x2="8" y2="4" stroke="#FAFAF7" strokeWidth="0.5" opacity="0.6" />
          <line x1="4" y1="-1" x2="2" y2="7" stroke="#FAFAF7" strokeWidth="0.5" opacity="0.6" />
        </g>
      </svg>

      {showWordmark && (
        <div className="flex flex-col leading-none">
          <span className={`font-sans font-extrabold tracking-tight text-[#1F5E2E] ${currentSize.text}`}>
            Green Earth
          </span>
          <span className="text-[9px] font-mono font-bold text-[#6B4226] tracking-widest uppercase">
            Bangladesh
          </span>
        </div>
      )}
    </div>
  );
}
