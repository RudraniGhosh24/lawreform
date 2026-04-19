import React from 'react'

export default function Avatar({ isSpeaking, size = 220 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {isSpeaking && (
        <div className="absolute inset-[-4px] rounded-2xl border-2 border-brand-400/30 animate-pulse" />
      )}

      <svg
        viewBox="0 0 400 480"
        width={size}
        height={size * 1.2}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 rounded-2xl"
        role="img"
        aria-label="Lawreformer AI Assistant"
      >
        <defs>
          <radialGradient id="bg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fef7ff" />
            <stop offset="100%" stopColor="#f0e4f5" />
          </radialGradient>
          <radialGradient id="skin" cx="48%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F2D0A9" />
            <stop offset="100%" stopColor="#D4A87A" />
          </radialGradient>
          <linearGradient id="hair" x1="0.2" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#5C3A1E" />
            <stop offset="50%" stopColor="#3E2210" />
            <stop offset="100%" stopColor="#2A160A" />
          </linearGradient>
          <linearGradient id="hairHL" x1="0.2" y1="0" x2="0.8" y2="0.4">
            <stop offset="0%" stopColor="#7A5030" opacity="0.4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8507A" />
            <stop offset="100%" stopColor="#D03A62" />
          </linearGradient>
          <radialGradient id="iris" cx="42%" cy="38%" r="50%">
            <stop offset="0%" stopColor="#7090C0" />
            <stop offset="100%" stopColor="#3A5A8A" />
          </radialGradient>
          <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          {/* Clip for face area so hair can overlap */}
          <clipPath id="faceClip">
            <ellipse cx="200" cy="230" rx="82" ry="100" />
          </clipPath>
        </defs>

        {/* Background with subtle rays */}
        <rect width="400" height="480" rx="16" fill="url(#bg)" />
        {[...Array(20)].map((_, i) => (
          <line key={i} x1="200" y1="240" x2={200 + 300 * Math.cos(i * Math.PI / 10)} y2={240 + 300 * Math.sin(i * Math.PI / 10)} stroke="#e0c8e0" strokeWidth="1.5" opacity="0.15" />
        ))}

        {/* ===== LAYER 1: Hair back (behind everything) ===== */}
        <path d="
          M100 180 Q95 130 115 85 Q145 35 200 25 Q255 35 285 85 Q305 130 300 180
          Q305 260 300 340 Q295 400 280 430
          L270 420 Q280 380 282 330 Q285 260 280 190
          Z" fill="url(#hair)" />
        <path d="
          M100 180 Q95 260 100 340 Q105 400 120 430
          L130 420 Q120 380 118 330 Q115 260 120 190
          Z" fill="url(#hair)" />

        {/* ===== LAYER 2: Neck + Body ===== */}
        <rect x="175" y="320" width="50" height="50" rx="10" fill="url(#skin)" />
        <path d="M110 400 Q150 370 185 380 L215 380 Q250 370 290 400 L300 480 L100 480 Z" fill="url(#top)" />

        {/* ===== LAYER 3: Face ===== */}
        <ellipse cx="200" cy="230" rx="82" ry="100" fill="url(#skin)" />

        {/* Face shadow for depth */}
        <ellipse cx="200" cy="235" rx="80" ry="98" fill="none" stroke="#C49468" strokeWidth="1" opacity="0.1" />

        {/* ===== Eyebrows ===== */}
        <path d="M148 195 Q165 184 188 190" fill="none" stroke="#3E2210" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M212 190 Q235 184 252 195" fill="none" stroke="#3E2210" strokeWidth="3.2" strokeLinecap="round" />

        {/* ===== Eyes — large, expressive like reference ===== */}
        {/* Left eye white */}
        <path d="M140 210 Q167 194 195 210 Q167 224 140 210Z" fill="white" />
        {/* Left iris — big */}
        <circle cx="168" cy="210" r="13" fill="url(#iris)" />
        <circle cx="168" cy="210" r="7" fill="#1E3050" />
        {/* Shine */}
        <circle cx="173" cy="205" r="4" fill="white" opacity="0.85" />
        <circle cx="163" cy="214" r="2" fill="white" opacity="0.4" />
        {/* Upper lid — thick like reference */}
        <path d="M140 210 Q167 194 195 210" fill="none" stroke="#2A160A" strokeWidth="3" strokeLinecap="round" />
        {/* Lower lid subtle */}
        <path d="M145 213 Q167 222 192 213" fill="none" stroke="#5C3A1E" strokeWidth="1" opacity="0.3" />
        {/* Lashes — outer corner flick like reference */}
        <path d="M140 210 Q135 203 132 196" fill="none" stroke="#2A160A" strokeWidth="2" strokeLinecap="round" />
        <path d="M146 205 Q143 199 141 194" fill="none" stroke="#2A160A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M153 201 Q151 196 150 192" fill="none" stroke="#2A160A" strokeWidth="1" strokeLinecap="round" />

        {/* Right eye white */}
        <path d="M205 210 Q233 194 260 210 Q233 224 205 210Z" fill="white" />
        <circle cx="232" cy="210" r="13" fill="url(#iris)" />
        <circle cx="232" cy="210" r="7" fill="#1E3050" />
        <circle cx="237" cy="205" r="4" fill="white" opacity="0.85" />
        <circle cx="227" cy="214" r="2" fill="white" opacity="0.4" />
        <path d="M205 210 Q233 194 260 210" fill="none" stroke="#2A160A" strokeWidth="3" strokeLinecap="round" />
        <path d="M208 213 Q233 222 257 213" fill="none" stroke="#5C3A1E" strokeWidth="1" opacity="0.3" />
        <path d="M260 210 Q265 203 268 196" fill="none" stroke="#2A160A" strokeWidth="2" strokeLinecap="round" />
        <path d="M254 205 Q257 199 259 194" fill="none" stroke="#2A160A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M247 201 Q249 196 250 192" fill="none" stroke="#2A160A" strokeWidth="1" strokeLinecap="round" />

        {/* ===== Nose — defined like reference ===== */}
        <path d="M200 230 L196 258" fill="none" stroke="#C49468" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M190 260 Q196 266 200 267 Q204 266 210 260" fill="none" stroke="#C49468" strokeWidth="1.5" strokeLinecap="round" />

        {/* ===== Mouth ===== */}
        {isSpeaking ? (
          <g>
            <ellipse cx="200" cy="290" rx="22" ry="12" fill="url(#lip)">
              <animate attributeName="ry" values="12;5;15;6;12" dur="0.3s" repeatCount="indefinite" />
              <animate attributeName="rx" values="22;17;25;18;22" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            <rect x="186" y="282" width="28" height="8" rx="3" fill="white" opacity="0.85">
              <animate attributeName="height" values="8;3;10;3;8" dur="0.3s" repeatCount="indefinite" />
            </rect>
          </g>
        ) : (
          <g>
            {/* Slight smile showing teeth — like reference */}
            <path d="M178 286 Q190 280 200 279 Q210 280 222 286" fill="url(#lip)" />
            <path d="M178 286 Q190 296 200 298 Q210 296 222 286" fill="url(#lip)" />
            {/* Teeth peek */}
            <path d="M184 286 Q200 282 216 286" fill="white" opacity="0.6" />
            <path d="M184 286 Q200 290 216 286" fill="white" opacity="0.3" />
            {/* Lip line */}
            <path d="M178 286 Q190 289 200 288 Q210 289 222 286" fill="none" stroke="#C43060" strokeWidth="0.6" />
            {/* Lip shine */}
            <ellipse cx="195" cy="283" rx="8" ry="2" fill="white" opacity="0.15" />
          </g>
        )}

        {/* Blush */}
        <circle cx="155" cy="250" r="16" fill="#E8A0A0" opacity="0.08" />
        <circle cx="245" cy="250" r="16" fill="#E8A0A0" opacity="0.08" />

        {/* ===== LAYER 4: Hair FRONT — overlaps face sides + forehead ===== */}
        {/* This is the key — hair goes ON TOP of the face */}

        {/* Left side hair — falls over face edge */}
        <path d="
          M100 180
          Q95 130 115 85 Q140 45 175 35
          Q155 55 140 90 Q125 125 118 170
          Q112 210 108 260 Q105 310 110 360 Q115 400 120 430
          L105 435 Q95 400 92 350 Q88 290 92 230 Q95 200 100 180
          Z" fill="url(#hair)" />

        {/* Right side hair — falls over face edge */}
        <path d="
          M300 180
          Q305 130 285 85 Q260 45 225 35
          Q245 55 260 90 Q275 125 282 170
          Q288 210 292 260 Q295 310 290 360 Q285 400 280 430
          L295 435 Q305 400 308 350 Q312 290 308 230 Q305 200 300 180
          Z" fill="url(#hair)" />

        {/* Top hair — covers forehead, side-parted */}
        <path d="
          M118 170
          Q115 130 130 95 Q150 60 200 48 Q250 60 270 95 Q285 130 282 170
          Q275 140 260 115 Q240 88 200 78 Q160 88 140 115 Q125 140 118 170
          Z" fill="url(#hair)" />

        {/* Hair shine highlight */}
        <path d="
          M155 42 Q175 36 195 35 Q200 50 195 75 Q180 60 165 48 Z
        " fill="url(#hairHL)" />

        {/* Part line */}
        <path d="M200 48 Q198 60 197 78" fill="none" stroke="#1A0E05" strokeWidth="1.2" opacity="0.3" />

        {/* Hair strand details */}
        <path d="M130 100 Q135 140 132 180" fill="none" stroke="#4A2A12" strokeWidth="0.8" opacity="0.2" />
        <path d="M270 100 Q265 140 268 180" fill="none" stroke="#4A2A12" strokeWidth="0.8" opacity="0.2" />
      </svg>

      {size >= 100 && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-full px-4 py-1 shadow-md z-20">
          <span className="text-xs font-medium text-brand-700 dark:text-brand-300 whitespace-nowrap">
            {isSpeaking ? '🗣️ Speaking...' : '⚖️ Lawreformer AI'}
          </span>
        </div>
      )}
    </div>
  )
}
