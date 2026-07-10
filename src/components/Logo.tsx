/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  lightMode?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  settings?: any;
}

export default function Logo({
  className = '',
  showWordmark = true,
  lightMode = false,
  size = 'md',
  settings
}: LogoProps) {
  // Dimensions based on size
  const sizes = {
    sm: { svg: 'h-10 w-10', text: 'text-lg', subtext: 'text-[8px]' },
    md: { svg: 'h-14 w-14', text: 'text-2xl', subtext: 'text-[10px]' },
    lg: { svg: 'h-24 w-24', text: 'text-4xl', subtext: 'text-xs' },
    xl: { svg: 'h-36 w-36', text: 'text-5xl', subtext: 'text-sm' }
  };

  const dim = sizes[size];

  // Dynamic branding
  const orgName = settings?.orgName || 'Green Earth';
  const tagline = settings?.tagline || 'Cleaner, Greener & Sustainable';

  const words = orgName.split(' ');
  const firstWord = words[0] || '';
  const restOfName = words.slice(1).join(' ') || '';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="ge-logo">
      {/* SVG Icon part of the Logo */}
      <div className={`relative ${dim.svg} flex items-center justify-center`}>
        {settings?.logoUrl ? (
          <img
            src={settings.logoUrl}
            alt={orgName}
            className="w-full h-full object-cover rounded-full shadow-sm border border-gray-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full transform transition-transform hover:rotate-3 duration-500"
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            {/* Soft background Sunburst gradient */}
            <radialGradient id="sunburstGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="#FFFEE8" stopOpacity="1" />
              <stop offset="50%" stopColor="#FFF9C4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            
            {/* Earth Blue-Green Gradient */}
            <linearGradient id="earthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90E2" />
              <stop offset="40%" stopColor="#34A853" />
              <stop offset="80%" stopColor="#1B5E20" />
              <stop offset="100%" stopColor="#0D3B11" />
            </linearGradient>

            {/* Leaf Lighter Green Gradient */}
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#81C784" />
              <stop offset="100%" stopColor="#4CAF50" />
            </linearGradient>

            {/* Dark Leaf Forest Gradient */}
            <linearGradient id="leafDarkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4CAF50" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>

          {/* 1. Background Sunburst/Rays */}
          <g id="sunburst-rays" opacity="0.85">
            {/* Circle backing to give warmth */}
            <circle cx="250" cy="250" r="230" fill="url(#sunburstGrad)" />
            {/* Radial Rays */}
            <g stroke="#FDD835" strokeWidth="4" strokeLinecap="round" opacity="0.6">
              <line x1="250" y1="250" x2="250" y2="30" />
              <line x1="250" y1="250" x2="405" y2="95" />
              <line x1="250" y1="250" x2="470" y2="250" />
              <line x1="250" y1="250" x2="405" y2="405" />
              <line x1="250" y1="250" x2="250" y2="470" />
              <line x1="250" y1="250" x2="95" y2="405" />
              <line x1="250" y1="250" x2="30" y2="250" />
              <line x1="250" y1="250" x2="95" y2="95" />
              {/* Intermediary rays */}
              <line x1="250" y1="250" x2="330" y2="55" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="445" y2="160" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="445" y2="340" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="330" y2="445" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="170" y2="445" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="55" y2="340" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="55" y2="160" strokeWidth="2.5" opacity="0.5" />
              <line x1="250" y1="250" x2="170" y2="55" strokeWidth="2.5" opacity="0.5" />
            </g>
          </g>

          {/* 2. Earth Globe */}
          <circle cx="250" cy="250" r="140" fill="url(#earthGrad)" stroke="#E0E0E0" strokeWidth="2" />
          {/* Subtle Grid / Longitude lines */}
          <path d="M 250 110 A 140 140 0 0 1 250 390 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.15" />
          <path d="M 250 110 A 80 140 0 0 1 250 390 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.15" />
          <path d="M 250 110 A 80 140 0 0 0 250 390 Z" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.15" />
          <line x1="110" y1="250" x2="390" y2="250" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.15" />

          {/* 3. Growing Tree */}
          {/* Trunk */}
          <path d="M 240 350 L 260 350 L 255 230 L 245 230 Z" fill="#6B4226" />
          <path d="M 250 250 Q 230 200 200 190 Q 225 210 248 235 Z" fill="#6B4226" /> {/* Left branch */}
          <path d="M 250 240 Q 275 195 305 180 Q 280 205 252 230 Z" fill="#6B4226" /> {/* Right branch */}
          <path d="M 250 220 Q 240 170 250 140 Q 260 170 250 210 Z" fill="#6B4226" /> {/* Center branch */}

          {/* Tree Canopy Leaves (Group) */}
          <g id="tree-canopy">
            {/* Center top leaf cluster */}
            <path d="M 250 140 Q 235 110 250 85 Q 265 110 250 140 Z" fill="#6BBF3A" />
            <path d="M 250 140 Q 225 125 220 100 Q 245 115 250 140 Z" fill="#2E7D32" />
            <path d="M 250 140 Q 275 125 280 100 Q 255 115 250 140 Z" fill="#81C784" />

            {/* Left cluster */}
            <path d="M 200 190 Q 170 175 175 150 Q 200 170 200 190 Z" fill="#6BBF3A" />
            <path d="M 185 175 Q 160 195 145 180 Q 170 175 185 175 Z" fill="#2E7D32" />
            
            {/* Right cluster */}
            <path d="M 305 180 Q 335 165 330 140 Q 305 160 305 180 Z" fill="#2E7D32" />
            <path d="M 320 165 Q 345 185 360 170 Q 335 165 320 165 Z" fill="#81C784" />
          </g>

          {/* 4. Two Large Cradling Green Leaves */}
          {/* Left leaf */}
          <path
            d="M 250 410 Q 150 400 110 320 Q 100 240 170 230 Q 180 320 250 410 Z"
            fill="url(#leafDarkGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          {/* Right leaf */}
          <path
            d="M 250 410 Q 350 400 390 320 Q 400 240 330 230 Q 320 320 250 410 Z"
            fill="url(#leafGrad)"
            stroke="#FFFFFF"
            strokeWidth="3"
          />

          {/* 5. Small Eco Icons woven onto the Globe */}
          {/* A: Wind Turbine (Left) */}
          <g id="icon-turbine" transform="translate(170, 250) scale(0.65)" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round">
            {/* Tower */}
            <line x1="0" y1="40" x2="0" y2="-10" strokeWidth="3" />
            {/* Blades */}
            <g transform="translate(0, -10)">
              {/* Rotate effect would be nice but static is clean */}
              <path d="M 0 0 L 0 -35 L 5 -15 Z" fill="#FFFFFF" stroke="none" />
              <path d="M 0 0 L -30 18 L -15 8 Z" fill="#FFFFFF" stroke="none" />
              <path d="M 0 0 L 30 18 L 10 20 Z" fill="#FFFFFF" stroke="none" />
              <circle cx="0" cy="0" r="3" fill="#6BBF3A" />
            </g>
          </g>

          {/* B: Solar Panel (Bottom-Left) */}
          <g id="icon-solar" transform="translate(200, 290) scale(0.4)" fill="#FFFFFF" stroke="#1F5E2E" strokeWidth="2">
            {/* Stand */}
            <path d="M 30 50 L 50 50 L 40 30 Z" fill="#6B4226" stroke="none" />
            {/* Blue solar panel box */}
            <polygon points="10,30 70,30 80,5 0,5" fill="#1565C0" stroke="#FFFFFF" strokeWidth="3" />
            {/* Grid lines */}
            <line x1="40" y1="5" x2="40" y2="30" stroke="#FFFFFF" strokeWidth="2" />
            <line x1="20" y1="5" x2="15" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="60" y1="5" x2="65" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
            <line x1="5" y1="17" x2="75" y2="17" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* C: Water Droplet & Recycling Arrow (Right) */}
          <g id="icon-water-recycle" transform="translate(285, 240) scale(0.7)" fill="none" strokeWidth="2.5">
            {/* Water droplet shape */}
            <path
              d="M 20 5 C 20 5 35 22 35 30 C 35 38 28 45 20 45 C 12 45 5 38 5 30 C 5 22 20 5 20 5 Z"
              fill="#E1F5FE"
              stroke="#0288D1"
              strokeWidth="3"
            />
            {/* Droplet reflections */}
            <path d="M 14 28 Q 11 34 16 38" stroke="#FFFFFF" strokeLinecap="round" />
            
            {/* Recycling Arrow wrapping around */}
            <path
              d="M 38 35 A 25 25 0 0 1 -10 32"
              stroke="#4CAF50"
              strokeLinecap="round"
              strokeDasharray="4 2"
              opacity="0.8"
            />
          </g>
        </svg>
        )}
      </div>

      {/* Wordmark (Green Earth) */}
      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-sans font-extrabold leading-none tracking-tight ${dim.text} flex items-center gap-1`}>
            <span className="text-[#6BBF3A]">{firstWord}</span>
            <span className={`${lightMode ? 'text-white' : 'text-[#1F5E2E]'}`}>{restOfName}</span>
          </span>
          <span className={`font-mono tracking-wider font-semibold uppercase opacity-90 ${dim.subtext} ${lightMode ? 'text-green-200' : 'text-gray-500'}`}>
            {tagline}
          </span>
        </div>
      )}
    </div>
  );
}
