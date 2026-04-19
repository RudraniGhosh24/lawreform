import React from 'react'

/**
 * Animated avatar — professional Indian woman (legal aid worker).
 * Mouth animates when isSpeaking is true.
 * Pure SVG + CSS, no external deps.
 */
export default function Avatar({ isSpeaking, size = 120 }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {/* Subtle glow when speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-full bg-brand-400/20 animate-ping" style={{ animationDuration: '2s' }} />
      )}

      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        role="img"
        aria-label="Lawreformer AI Assistant"
      >
        {/* Background circle */}
        <circle cx="100" cy="100" r="98" fill="#f3e8ff" stroke="#d8b4fe" strokeWidth="2" />

        {/* Hair */}
        <ellipse cx="100" cy="82" rx="58" ry="62" fill="#1a1a2e" />
        <ellipse cx="100" cy="65" rx="52" ry="45" fill="#1a1a2e" />
        {/* Hair sides */}
        <ellipse cx="52" cy="95" rx="18" ry="35" fill="#1a1a2e" />
        <ellipse cx="148" cy="95" rx="18" ry="35" fill="#1a1a2e" />

        {/* Face */}
        <ellipse cx="100" cy="100" rx="45" ry="50" fill="#D4A574" />

        {/* Bindi */}
        <circle cx="100" cy="78" r="3" fill="#dc2626" />

        {/* Eyes */}
        <ellipse cx="82" cy="93" rx="7" ry="5" fill="white" />
        <ellipse cx="118" cy="93" rx="7" ry="5" fill="white" />
        <circle cx="83" cy="93" r="3.5" fill="#1a1a2e" />
        <circle cx="119" cy="93" r="3.5" fill="#1a1a2e" />
        {/* Eye shine */}
        <circle cx="84.5" cy="91.5" r="1.2" fill="white" />
        <circle cx="120.5" cy="91.5" r="1.2" fill="white" />

        {/* Eyebrows */}
        <path d="M72 85 Q82 80 92 85" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
        <path d="M108 85 Q118 80 128 85" fill="none" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />

        {/* Nose */}
        <path d="M97 100 Q100 108 103 100" fill="none" stroke="#b8845a" strokeWidth="1.5" strokeLinecap="round" />

        {/* Mouth — animated when speaking */}
        {isSpeaking ? (
          <ellipse cx="100" cy="118" rx="10" ry="6" fill="#c0392b" className="animate-mouth">
            <animate attributeName="ry" values="6;3;8;4;6" dur="0.4s" repeatCount="indefinite" />
            <animate attributeName="rx" values="10;8;12;9;10" dur="0.4s" repeatCount="indefinite" />
          </ellipse>
        ) : (
          /* Gentle smile */
          <path d="M88 116 Q100 126 112 116" fill="none" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Dupatta / scarf on shoulders */}
        <path d="M48 140 Q60 130 72 145 Q85 155 100 150 Q115 155 128 145 Q140 130 152 140 L160 180 L40 180 Z" fill="#9333ea" opacity="0.9" />
        <path d="M48 140 Q60 132 72 145 Q85 153 100 148" fill="none" stroke="#7c3aed" strokeWidth="1.5" />

        {/* Kurta neckline */}
        <path d="M72 145 Q100 160 128 145" fill="none" stroke="#7c3aed" strokeWidth="1" />

        {/* Earrings */}
        <circle cx="56" cy="105" r="4" fill="#f59e0b" />
        <circle cx="56" cy="112" r="3" fill="#f59e0b" />
        <circle cx="144" cy="105" r="4" fill="#f59e0b" />
        <circle cx="144" cy="112" r="3" fill="#f59e0b" />
      </svg>
    </div>
  )
}
