import React from 'react'

export default function Avatar({ isSpeaking, size = 220 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {isSpeaking && (
        <div className="absolute inset-[-4px] rounded-2xl border-2 border-brand-400/30 animate-pulse" />
      )}

      <svg
        viewBox="0 0 400 450"
        width={size}
        height={size * 1.125}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 rounded-2xl"
        role="img"
        aria-label="Lawreformer AI Assistant"
      >
        <defs>
          <radialGradient id="bg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fef7ff" />
            <stop offset="100%" stopColor="#f3e8f9" />
          </radialGradient>
          <radialGradient id="skin" cx="48%" cy="38%" r="52%">
            <stop offset="0%" stopColor="#F2D0A9" />
            <stop offset="80%" stopColor="#DDB88C" />
            <stop offset="100%" stopColor="#CCA070" />
          </radialGradient>
          <linearGradient id="hair" x1="0.2" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#5C3317" />
            <stop offset="40%" stopColor="#3E2210" />
            <stop offset="100%" stopColor="#2A160A" />
          </linearGradient>
          <linearGradient id="hairHL" x1="0.3" y1="0" x2="0.6" y2="0.6">
            <stop offset="0%" stopColor="#7A4A28" opacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8507A" />
            <stop offset="100%" stopColor="#D03A62" />
          </linearGradient>
          <radialGradient id="iris" cx="42%" cy="38%" r="50%">
            <stop offset="0%" stopColor="#6B4226" />
            <stop offset="100%" stopColor="#2E1A0B" />
          </radialGradient>
          <linearGradient id="top" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="450" rx="16" fill="url(#bg)" />

        {/* ===== HAIR BACK — smooth, voluminous, frames the face ===== */}
        <path d="
          M95 160
          Q90 120 110 80
          Q140 35 200 28
          Q260 35 290 80
          Q310 120 305 160
          Q310 220 308 280
          Q306 330 300 370
          Q295 390 285 395
          L275 380
          Q282 340 284 290
          Q286 230 282 180
          Q278 140 260 115
          Q240 90 200 82
          Q160 90 140 115
          Q122 140 118 180
          Q114 230 116 290
          Q118 340 125 380
          L115 395
          Q105 390 100 370
          Q94 330 92 280
          Q90 220 95 160
          Z" fill="url(#hair)" />
        {/* Hair shine */}
        <path d="
          M150 45
          Q165 38 185 34
          Q190 55 182 85
          Q172 70 160 52
          Z" fill="url(#hairHL)" />

        {/* Neck + shoulders */}
        <path d="M172 310 Q178 345 182 370 L218 370 Q222 345 228 310" fill="url(#skin)" />
        <path d="M100 390 Q140 360 182 370 L218 370 Q260 360 300 390 L310 450 L90 450 Z" fill="url(#top)" />
        {/* Neckline */}
        <path d="M165 370 Q200 385 235 370" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.5" />

        {/* ===== FACE ===== */}
        <ellipse cx="200" cy="210" rx="80" ry="95" fill="url(#skin)" />

        {/* Jaw definition */}
        <path d="M130 230 Q140 290 175 310 Q200 320 225 310 Q260 290 270 230" fill="none" stroke="#C49468" strokeWidth="1" opacity="0.2" />

        {/* ===== HAIR FRONT — covers forehead properly ===== */}
        <path d="
          M118 175
          Q115 135 130 100
          Q150 65 200 55
          Q250 65 270 100
          Q285 135 282 175
          Q275 145 258 120
          Q238 95 200 85
          Q162 95 142 120
          Q125 145 118 175
          Z" fill="url(#hair)" />

        {/* Side hair — smooth, flowing, not sticking out */}
        <path d="
          M118 175
          Q112 200 110 235
          Q108 270 112 310
          Q115 340 120 360
          Q122 370 126 365
          Q120 340 118 310
          Q115 270 117 235
          Q119 205 124 180
          Z" fill="url(#hair)" />
        <path d="
          M282 175
          Q288 200 290 235
          Q292 270 288 310
          Q285 340 280 360
          Q278 370 274 365
          Q280 340 282 310
          Q285 270 283 235
          Q281 205 276 180
          Z" fill="url(#hair)" />

        {/* ===== EYEBROWS ===== */}
        <path d="M152 178 Q168 167 190 173" fill="none" stroke="#3E2210" strokeWidth="3" strokeLinecap="round" />
        <path d="M210 173 Q232 167 248 178" fill="none" stroke="#3E2210" strokeWidth="3" strokeLinecap="round" />

        {/* ===== EYES — bigger, wider apart ===== */}
        {/* Left eye */}
        <path d="M142 195 Q165 180 192 195 Q165 208 142 195Z" fill="white" />
        <circle cx="167" cy="195" r="12" fill="url(#iris)" />
        <circle cx="167" cy="195" r="6.5" fill="#1a0f05" />
        <circle cx="171" cy="190" r="3.5" fill="white" opacity="0.9" />
        <circle cx="163" cy="198" r="1.5" fill="white" opacity="0.4" />
        <path d="M142 195 Q165 180 192 195" fill="none" stroke="#2A160A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M145 197 Q165 206 189 197" fill="none" stroke="#3E2210" strokeWidth="0.8" opacity="0.3" />
        {/* Lashes */}
        <path d="M142 195 Q138 188 136 182" fill="none" stroke="#2A160A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M148 190 Q145 184 144 179" fill="none" stroke="#2A160A" strokeWidth="1" strokeLinecap="round" />
        <path d="M155 186 Q153 181 152 177" fill="none" stroke="#2A160A" strokeWidth="0.8" strokeLinecap="round" />

        {/* Right eye */}
        <path d="M208 195 Q235 180 258 195 Q235 208 208 195Z" fill="white" />
        <circle cx="233" cy="195" r="12" fill="url(#iris)" />
        <circle cx="233" cy="195" r="6.5" fill="#1a0f05" />
        <circle cx="237" cy="190" r="3.5" fill="white" opacity="0.9" />
        <circle cx="229" cy="198" r="1.5" fill="white" opacity="0.4" />
        <path d="M208 195 Q235 180 258 195" fill="none" stroke="#2A160A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M211 197 Q235 206 255 197" fill="none" stroke="#3E2210" strokeWidth="0.8" opacity="0.3" />
        <path d="M258 195 Q262 188 264 182" fill="none" stroke="#2A160A" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M252 190 Q255 184 256 179" fill="none" stroke="#2A160A" strokeWidth="1" strokeLinecap="round" />
        <path d="M245 186 Q247 181 248 177" fill="none" stroke="#2A160A" strokeWidth="0.8" strokeLinecap="round" />

        {/* ===== NOSE ===== */}
        <path d="M197 215 Q199 235 196 248 Q198 252 200 253 Q202 252 204 248 Q201 235 203 215" fill="none" stroke="#C49468" strokeWidth="1.2" strokeLinecap="round" />

        {/* ===== MOUTH ===== */}
        {isSpeaking ? (
          <g>
            <ellipse cx="200" cy="272" rx="20" ry="11" fill="url(#lip)">
              <animate attributeName="ry" values="11;5;14;6;11" dur="0.3s" repeatCount="indefinite" />
              <animate attributeName="rx" values="20;16;23;17;20" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            <rect x="188" y="265" width="24" height="7" rx="2" fill="white" opacity="0.8">
              <animate attributeName="height" values="7;3;9;3;7" dur="0.3s" repeatCount="indefinite" />
            </rect>
            <ellipse cx="196" cy="268" rx="5" ry="2" fill="white" opacity="0.15">
              <animate attributeName="ry" values="2;1;2.5;1;2" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
        ) : (
          <g>
            {/* Closed smile */}
            <path d="M180 268 Q190 263 200 262 Q210 263 220 268" fill="url(#lip)" />
            <path d="M180 268 Q190 278 200 280 Q210 278 220 268" fill="url(#lip)" />
            <path d="M180 268 Q190 272 200 271 Q210 272 220 268" fill="none" stroke="#C43060" strokeWidth="0.6" />
            <ellipse cx="196" cy="266" rx="7" ry="2" fill="white" opacity="0.15" />
          </g>
        )}

        {/* Blush */}
        <circle cx="152" cy="235" r="14" fill="#E8A0A0" opacity="0.1" />
        <circle cx="248" cy="235" r="14" fill="#E8A0A0" opacity="0.1" />
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
