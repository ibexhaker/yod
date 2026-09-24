import React from 'react';

interface SnapGridLogoProps {
  variant?: 'icon' | 'full' | 'horizontal' | 'badge';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  size?: number | string;
  showSubtitle?: boolean;
}

export const SnapGridLogo: React.FC<SnapGridLogoProps> = ({
  variant = 'horizontal',
  theme = 'auto',
  className = '',
  size,
  showSubtitle = true,
}) => {
  // Determine stroke/fill colors based on theme
  const strokeColor =
    theme === 'dark' ? '#FFFFFF' : theme === 'light' ? '#1A1A1A' : 'currentColor';
  const bgColor = theme === 'dark' ? '#000000' : theme === 'light' ? '#FFFFFF' : 'transparent';

  // The core SG Icon SVG symbol
  const IconSVG = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full select-none"
      style={{ overflow: 'visible' }}
      aria-label="Snap Grid Logo Mark"
    >
      {/* Outer Viewfinder Frame with left/right notches and rounded corners */}
      <path
        d="M 60 16 
           L 140 16 
           A 44 44 0 0 1 184 60 
           L 184 94 
           M 184 106 
           L 184 140 
           A 44 44 0 0 1 140 184 
           L 60 184 
           A 44 44 0 0 1 16 140 
           L 16 106 
           M 16 94 
           L 16 60 
           A 44 44 0 0 1 60 16 Z"
        stroke={strokeColor}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Top right camera lens dot */}
      <circle
        cx="148"
        cy="52"
        r="10"
        stroke={strokeColor}
        strokeWidth="6"
        fill="none"
      />

      {/* Interlocking 'S' and 'G' monogram glyph */}
      {/* Upper S segment */}
      <path
        d="M 124 58 
           L 68 58 
           A 22 22 0 0 0 46 80 
           L 46 86 
           A 22 22 0 0 0 68 108 
           L 110 108 
           L 110 120 
           A 22 22 0 0 1 88 142 
           L 58 142 
           L 40 156 
           L 88 156 
           A 36 36 0 0 0 124 120 
           L 124 102 
           A 22 22 0 0 0 102 80 
           L 62 80 
           L 62 72 
           L 106 72 
           Z"
        fill={strokeColor}
      />

      {/* Interlocking G segment */}
      <path
        d="M 98 80 
           L 138 80 
           L 156 66 
           L 112 66 
           A 36 36 0 0 0 76 102 
           L 76 116 
           A 22 22 0 0 0 98 138 
           L 136 138 
           L 136 114 
           L 116 114 
           L 116 100 
           L 150 100 
           L 150 144 
           A 22 22 0 0 1 128 166 
           L 74 166 
           A 44 44 0 0 1 30 122 
           L 30 102 
           A 44 44 0 0 1 74 58 
           L 82 58 
           Z"
        fill={strokeColor}
      />
    </svg>
  );

  // Full Poster / Hero Logo Variant (Matches uploaded image exactly)
  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center justify-center p-6 bg-black text-white rounded-2xl shadow-xl select-none ${className}`}
        style={{ width: size || 'auto' }}
      >
        {/* Main Monogram Icon */}
        <div className="w-32 h-32 md:w-40 md:h-40 mb-5 relative flex items-center justify-center">
          {IconSVG}
        </div>

        {/* Brand Text */}
        <h2 className="text-xl md:text-2xl font-black tracking-[0.35em] text-white font-sans uppercase text-center pl-[0.35em]">
          SNAP GRID
        </h2>

        {/* Viewfinder Accent Line */}
        {showSubtitle && (
          <div className="flex items-center gap-3 mt-3 w-full max-w-[200px]">
            <div className="h-[2px] bg-white/80 flex-1" />
            <div className="relative w-5 h-5 flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute inset-0 border border-white/90 scale-90" />
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
            <div className="h-[2px] bg-white/80 flex-1" />
          </div>
        )}
      </div>
    );
  }

  // Dark badge pill / square variant
  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-black text-white p-2.5 rounded-xl border border-white/10 shadow-md ${className}`}
        style={{ width: size || 44, height: size || 44 }}
        title="Snap Grid"
      >
        <div className="w-full h-full flex items-center justify-center">
          {IconSVG}
        </div>
      </div>
    );
  }

  // Icon only
  if (variant === 'icon') {
    return (
      <div
        className={`inline-flex items-center justify-center shrink-0 ${className}`}
        style={{ width: size || 32, height: size || 32 }}
      >
        {IconSVG}
      </div>
    );
  }

  // Horizontal Header Layout (Icon + Styled Logo text)
  return (
    <div
      className={`inline-flex items-center gap-3 select-none cursor-pointer group ${className}`}
    >
      <div
        className="shrink-0 bg-black text-white p-1.5 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
        style={{ width: size || 36, height: size || 36 }}
      >
        <div className="w-full h-full">{IconSVG}</div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className="font-sans font-black tracking-[0.25em] text-sm md:text-base uppercase text-[#1A1A1A]">
            SNAP
          </span>
          <span className="font-sans font-light tracking-[0.25em] text-sm md:text-base uppercase text-[#1A1A1A]/70">
            GRID
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 opacity-40 -mt-0.5">
            <div className="h-[1px] w-3 bg-current" />
            <span className="text-[8px] font-sans uppercase tracking-[0.2em] font-semibold">
              Curator Studio
            </span>
            <div className="h-[1px] w-3 bg-current" />
          </div>
        )}
      </div>
    </div>
  );
};
