import React from 'react'

/**
 * Avatar using DiceBear Personas (free, CC0 public domain, no attribution needed).
 * Sound bar animation overlay when speaking.
 */
export default function Avatar({ isSpeaking, size = 220 }) {
  const avatarUrl = `https://api.dicebear.com/9.x/personas/svg?seed=lawreformer-ai&eyes=open&mouth=smile&hair=long&hairColor=6a3520&skinColor=d4a574&clothingColor=9333ea&backgroundColor=f3e8ff&size=${Math.max(size, 200)}`

  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-visible"
      style={{ width: size, height: size }}
    >
      {isSpeaking && (
        <div className="absolute inset-0 rounded-2xl border-2 border-brand-400/40 animate-pulse z-30 pointer-events-none" />
      )}

      <img
        src={avatarUrl}
        alt="Lawreformer AI Assistant"
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-2xl"
        loading="eager"
      />

      {isSpeaking && (
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex gap-[2px] items-end">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[3px] bg-brand-500 rounded-full"
                style={{
                  animation: `soundbar 0.4s ease-in-out ${i * 0.08}s infinite alternate`,
                  height: '8px',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {size >= 100 && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-full px-4 py-1 shadow-md z-30">
          <span className="text-xs font-medium text-brand-700 dark:text-brand-300 whitespace-nowrap">
            {isSpeaking ? '🗣️ Speaking...' : '⚖️ Lawreformer AI'}
          </span>
        </div>
      )}
    </div>
  )
}
