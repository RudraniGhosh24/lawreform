import React from 'react'

export default function Avatar({ isSpeaking, size = 220 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {isSpeaking && (
        <>
          <div className="absolute inset-[-8px] rounded-2xl border-2 border-brand-400/30 animate-ping" style={{ animationDuration: '2.5s' }} />
          <div className="absolute inset-[-4px] rounded-2xl border border-brand-300/20" />
        </>
      )}

      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 rounded-2xl"
        role="img"
        aria-label="Lawreformer AI Assistant"
      >
        <defs>
          <radialGradient id="bg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fdf2f8" />
            <stop offset="100%" stopColor="#f0e0ef" />
          </radialGradient>
          <radialGradient id="skin" cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#EDCBA8" />
            <stop offset="70%" stopColor="#D4A87A" />
            <stop offset="100%" stopColor="#C49468" />
          </radialGradient>
          <linearGradient id="hair" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#4a2c17" />
            <stop offset="50%" stopColor="#3b2010" />
            <stop offset="100%" stopColor="#2a1508" />
          </linearGradient>
          <linearGradient id="hairShine" x1="0.3" y1="0" x2="0.7" y2="0.5">
            <stop offset="0%" stopColor="#6b3d22" opacity="0.6" />
            <stop offset="100%" stopColor="#3b2010" opacity="0" />
          </linearGradient>
          <linearGradient id="lip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e84878" />
            <stop offset="100%" stopColor="#c43060" />
          </linearGradient>
          <radialGradient id="iris" cx="45%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#5a3a1a" />
            <stop offset="100%" stopColor="#2a1a08" />
          </radialGradient>
          <linearGradient id="top" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect width="400" height="400" rx="20" fill="url(#bg)" />
        {/* Subtle radial lines like the reference */}
        {[...Array(16)].map((_, i) => (
          <line key={i} x1="200" y1="200" x2={200 + 250 * Math.cos(i * Math.PI / 8)} y2={200 + 250 * Math.sin(i * Math.PI / 8)} stroke="#e8c8d8" strokeWidth="1" opacity="0.3" />
        ))}

        {/* Neck */}
        <path d="M170 295 Q175 330 180 350 L220 350 Q225 330 230 295" fill="url(#skin)" />
        {/* Neck shadow */}
        <path d="M175 300 Q200 310 225 300" fill="none" stroke="#b8845a" strokeWidth="0.8" opacity="0.3" />

        {/* Top / clothing */}
        <path d="M130 350 Q155 330 180 345 L220 345 Q245 330 270 350 L280 400 L120 400 Z" fill="url(#top)" />
        <path d="M155 340 Q200 355 245 340" fill="none" stroke="#991b1b" strokeWidth="1" opacity="0.4" />

        {/* Hair behind — full volume */}
        <path d="M90 170 Q85 100 130 60 Q170 35 200 33 Q230 35 270 60 Q315 100 310 170 Q315 240 305 290 Q300 310 290 320 L280 300 Q290 250 288 200 Q285 150 270 120" fill="url(#hair)" />
        <path d="M90 170 Q85 240 95 290 Q100 310 110 320 L120 300 Q112 250 112 200 Q115 150 130 120" fill="url(#hair)" />

        {/* Face */}
        <ellipse cx="200" cy="200" rx="75" ry="88" fill="url(#skin)" />

        {/* Face contour shadow */}
        <path d="M130 180 Q128 220 135 260 Q145 285 170 295" fill="none" stroke="#b8845a" strokeWidth="1" opacity="0.15" />
        <path d="M270 180 Q272 220 265 260 Q255 285 230 295" fill="none" stroke="#b8845a" strokeWidth="1" opacity="0.15" />

        {/* Hair front — side-parted, flowing */}
        <path d="M125 155 Q120 110 145 75 Q170 50 200 45 Q230 50 255 75 Q280 110 275 155 Q270 130 255 105 Q235 80 200 72 Q165 80 145 105 Q130 130 125 155Z" fill="url(#hair)" />
        {/* Hair shine streak */}
        <path d="M160 60 Q170 55 185 52 Q190 70 180 95 Q170 80 160 60Z" fill="url(#hairShine)" />

        {/* Left hair flowing down */}
        <path d="M125 155 Q115 180 110 220 Q108 260 112 300 Q115 310 120 300 Q116 260 118 220 Q120 185 130 160Z" fill="url(#hair)" />
        {/* Right hair flowing down */}
        <path d="M275 155 Q285 180 290 220 Q292 260 288 300 Q285 310 280 300 Q284 260 282 220 Q280 185 270 160Z" fill="url(#hair)" />

        {/* Ears */}
        <ellipse cx="126" cy="200" rx="8" ry="14" fill="#D4A87A" />
        <ellipse cx="274" cy="200" rx="8" ry="14" fill="#D4A87A" />

        {/* Eyebrows — defined arch */}
        <path d="M148 168 Q162 157 182 163" fill="none" stroke="#3d2010" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M218 163 Q238 157 252 168" fill="none" stroke="#3d2010" strokeWidth="3.5" strokeLinecap="round" />

        {/* Eyes — large, expressive, almond */}
        {/* Left eye */}
        <path d="M145 185 Q165 172 188 185 Q165 196 145 185Z" fill="white" />
        <circle cx="168" cy="185" r="11" fill="url(#iris)" />
        <circle cx="168" cy="185" r="6" fill="#1a0f05" />
        <circle cx="172" cy="181" r="3.5" fill="white" opacity="0.9" />
        <circle cx="164" cy="188" r="1.5" fill="white" opacity="0.5" />
        {/* Upper eyelid line */}
        <path d="M145 185 Q165 172 188 185" fill="none" stroke="#2a1508" strokeWidth="2.5" strokeLinecap="round" />
        {/* Lower lash line */}
        <path d="M150 187 Q165 194 185 187" fill="none" stroke="#3d2010" strokeWidth="1" opacity="0.4" />
        {/* Eyelashes */}
        <path d="M145 185 Q141 179 139 174" fill="none" stroke="#2a1508" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M150 181 Q148 176 146 172" fill="none" stroke="#2a1508" strokeWidth="1" strokeLinecap="round" />

        {/* Right eye */}
        <path d="M212 185 Q235 172 255 185 Q235 196 212 185Z" fill="white" />
        <circle cx="232" cy="185" r="11" fill="url(#iris)" />
        <circle cx="232" cy="185" r="6" fill="#1a0f05" />
        <circle cx="236" cy="181" r="3.5" fill="white" opacity="0.9" />
        <circle cx="228" cy="188" r="1.5" fill="white" opacity="0.5" />
        <path d="M212 185 Q235 172 255 185" fill="none" stroke="#2a1508" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M215 187 Q235 194 250 187" fill="none" stroke="#3d2010" strokeWidth="1" opacity="0.4" />
        <path d="M255 185 Q259 179 261 174" fill="none" stroke="#2a1508" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M250 181 Q252 176 254 172" fill="none" stroke="#2a1508" strokeWidth="1" strokeLinecap="round" />

        {/* Bindi */}
        <circle cx="200" cy="155" r="4.5" fill="#dc2626" />

        {/* Nose */}
        <path d="M198 205 L194 228 Q197 233 200 234 Q203 233 206 228 L202 205" fill="none" stroke="#b8845a" strokeWidth="1.5" strokeLinecap="round" />
        {/* Nose tip highlight */}
        <ellipse cx="200" cy="226" rx="5" ry="3" fill="#D4A87A" opacity="0.5" />

        {/* Mouth — BIG and visible for lip sync */}
        {isSpeaking ? (
          <g>
            {/* Open mouth */}
            <ellipse cx="200" cy="258" rx="22" ry="12" fill="url(#lip)">
              <animate attributeName="ry" values="12;6;15;7;12" dur="0.3s" repeatCount="indefinite" />
              <animate attributeName="rx" values="22;18;25;19;22" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
            {/* Teeth */}
            <rect x="185" y="250" width="30" height="8" rx="3" fill="white" opacity="0.85">
              <animate attributeName="height" values="8;4;10;4;8" dur="0.3s" repeatCount="indefinite" />
            </rect>
            {/* Lip shine */}
            <ellipse cx="195" cy="254" rx="6" ry="2" fill="white" opacity="0.2">
              <animate attributeName="ry" values="2;1;3;1;2" dur="0.3s" repeatCount="indefinite" />
            </ellipse>
          </g>
        ) : (
          <g>
            {/* Closed smile — full lips */}
            <path d="M178 254 Q188 248 200 247 Q212 248 222 254" fill="url(#lip)" />
            <path d="M178 254 Q188 264 200 266 Q212 264 222 254" fill="url(#lip)" />
            {/* Lip line */}
            <path d="M178 254 Q190 258 200 257 Q210 258 222 254" fill="none" stroke="#c43060" strokeWidth="0.8" />
            {/* Lip shine */}
            <ellipse cx="195" cy="252" rx="8" ry="2.5" fill="white" opacity="0.2" />
          </g>
        )}

        {/* Blush */}
        <circle cx="155" cy="225" r="15" fill="#e8a0a0" opacity="0.12" />
        <circle cx="245" cy="225" r="15" fill="#e8a0a0" opacity="0.12" />
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
