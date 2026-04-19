import React from 'react'

/**
 * Animated avatar — friendly Indian professional woman.
 * Refined features, warm expression, lip-sync when speaking.
 */
export default function Avatar({ isSpeaking, size = 160 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {/* Glow ring when speaking */}
      {isSpeaking && (
        <>
          <div className="absolute inset-[-6px] rounded-full border-2 border-brand-400/40 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-[-3px] rounded-full border-2 border-brand-300/30" />
        </>
      )}

      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-lg"
        role="img"
        aria-label="Lawreformer AI Assistant"
      >
        <defs>
          {/* Skin gradient for depth */}
          <radialGradient id="skinGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#E8B88A" />
            <stop offset="100%" stopColor="#C8956A" />
          </radialGradient>
          {/* Hair gradient */}
          <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2d1b0e" />
            <stop offset="100%" stopColor="#1a1008" />
          </linearGradient>
          {/* Dupatta gradient */}
          <linearGradient id="dupattaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          {/* Lip color */}
          <linearGradient id="lipGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4536a" />
            <stop offset="100%" stopColor="#b83a52" />
          </linearGradient>
          {/* Background */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5f0ff" />
            <stop offset="100%" stopColor="#ede5ff" />
          </radialGradient>
        </defs>

        {/* Background circle */}
        <circle cx="150" cy="150" r="148" fill="url(#bgGrad)" stroke="#d8b4fe" strokeWidth="2" />

        {/* Neck */}
        <rect x="130" y="195" width="40" height="30" rx="8" fill="url(#skinGrad)" />

        {/* Dupatta / clothing */}
        <path d="M70 215 Q90 200 115 210 Q150 225 185 210 Q210 200 230 215 L245 300 L55 300 Z" fill="url(#dupattaGrad)" />
        {/* Dupatta fold lines */}
        <path d="M90 225 Q120 235 150 228 Q180 235 210 225" fill="none" stroke="#9333ea" strokeWidth="1" opacity="0.5" />
        <path d="M80 245 Q130 258 150 252 Q170 258 220 245" fill="none" stroke="#9333ea" strokeWidth="0.8" opacity="0.3" />
        {/* Gold border on dupatta */}
        <path d="M70 215 Q90 200 115 210 Q150 225 185 210 Q210 200 230 215" fill="none" stroke="#f59e0b" strokeWidth="1.5" opacity="0.6" />

        {/* Hair back volume */}
        <ellipse cx="150" cy="115" rx="72" ry="78" fill="url(#hairGrad)" />

        {/* Face */}
        <ellipse cx="150" cy="140" rx="55" ry="62" fill="url(#skinGrad)" />

        {/* Hair front — parted in middle */}
        <path d="M78 115 Q85 70 150 60 Q215 70 222 115 Q220 95 200 82 Q175 68 150 65 Q125 68 100 82 Q80 95 78 115Z" fill="url(#hairGrad)" />
        {/* Hair sides flowing down */}
        <path d="M78 115 Q72 140 75 170 Q78 155 82 135 Z" fill="url(#hairGrad)" />
        <path d="M222 115 Q228 140 225 170 Q222 155 218 135 Z" fill="url(#hairGrad)" />
        {/* Hair part line */}
        <line x1="150" y1="62" x2="150" y2="85" stroke="#0f0805" strokeWidth="1" opacity="0.4" />

        {/* Ears */}
        <ellipse cx="95" cy="140" rx="8" ry="12" fill="#D4A574" />
        <ellipse cx="205" cy="140" rx="8" ry="12" fill="#D4A574" />

        {/* Earrings — jhumka style */}
        <circle cx="95" cy="156" r="5" fill="#f59e0b" />
        <circle cx="95" cy="164" r="3.5" fill="#f59e0b" />
        <circle cx="95" cy="170" r="2" fill="#f59e0b" />
        <circle cx="205" cy="156" r="5" fill="#f59e0b" />
        <circle cx="205" cy="164" r="3.5" fill="#f59e0b" />
        <circle cx="205" cy="170" r="2" fill="#f59e0b" />

        {/* Eyebrows — soft arch */}
        <path d="M112 118 Q125 110 140 116" fill="none" stroke="#3d2512" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M160 116 Q175 110 188 118" fill="none" stroke="#3d2512" strokeWidth="2.5" strokeLinecap="round" />

        {/* Eyes — almond shaped */}
        <path d="M115 130 Q128 122 141 130 Q128 137 115 130Z" fill="white" />
        <path d="M159 130 Q172 122 185 130 Q172 137 159 130Z" fill="white" />
        {/* Iris */}
        <circle cx="128" cy="130" r="6" fill="#3d1f0a" />
        <circle cx="172" cy="130" r="6" fill="#3d1f0a" />
        {/* Pupil */}
        <circle cx="128" cy="130" r="3" fill="#1a0f05" />
        <circle cx="172" cy="130" r="3" fill="#1a0f05" />
        {/* Eye shine */}
        <circle cx="131" cy="128" r="2" fill="white" opacity="0.9" />
        <circle cx="175" cy="128" r="2" fill="white" opacity="0.9" />
        {/* Eyelashes — subtle */}
        <path d="M115 130 Q113 126 112 123" fill="none" stroke="#2d1b0e" strokeWidth="1" strokeLinecap="round" />
        <path d="M185 130 Q187 126 188 123" fill="none" stroke="#2d1b0e" strokeWidth="1" strokeLinecap="round" />

        {/* Bindi */}
        <circle cx="150" cy="108" r="4" fill="#dc2626" />
        <circle cx="150" cy="108" r="2.5" fill="#ef4444" />

        {/* Nose — refined */}
        <path d="M148 140 Q150 152 152 140" fill="none" stroke="#b8845a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M144 152 Q150 156 156 152" fill="none" stroke="#b8845a" strokeWidth="1" strokeLinecap="round" />

        {/* Mouth */}
        {isSpeaking ? (
          <g>
            {/* Speaking mouth — animated open/close */}
            <ellipse cx="150" cy="170" rx="14" ry="8" fill="url(#lipGrad)">
              <animate attributeName="ry" values="8;4;10;5;8" dur="0.35s" repeatCount="indefinite" />
              <animate attributeName="rx" values="14;11;16;12;14" dur="0.35s" repeatCount="indefinite" />
            </ellipse>
            {/* Teeth hint */}
            <rect x="142" y="166" width="16" height="4" rx="2" fill="white" opacity="0.7">
              <animate attributeName="height" values="4;2;5;2;4" dur="0.35s" repeatCount="indefinite" />
            </rect>
          </g>
        ) : (
          <g>
            {/* Warm smile */}
            <path d="M134 167 Q142 176 150 177 Q158 176 166 167" fill="url(#lipGrad)" />
            <path d="M134 167 Q150 172 166 167" fill="none" stroke="#c0475c" strokeWidth="0.5" />
          </g>
        )}

        {/* Subtle blush */}
        <circle cx="118" cy="150" r="10" fill="#e8a0a0" opacity="0.15" />
        <circle cx="182" cy="150" r="10" fill="#e8a0a0" opacity="0.15" />
      </svg>

      {/* Name tag */}
      {size >= 100 && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-full px-3 py-0.5 shadow-sm z-20">
          <span className="text-[10px] font-medium text-brand-700 dark:text-brand-300 whitespace-nowrap">
            {isSpeaking ? '🗣️ Speaking...' : '⚖️ Lawreformer AI'}
          </span>
        </div>
      )}
    </div>
  )
}
