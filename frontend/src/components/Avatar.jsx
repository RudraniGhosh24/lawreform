import React, { useState, useEffect } from 'react'

/**
 * Avatar using DiceBear ToonHead style (CC BY 4.0 — Johan Melin).
 * Two states: smiling (idle) and agape (speaking) for lip-sync effect.
 */

const BASE_PARAMS = 'hair=bun&hairColor=5c3317&skinColor=f0c8a0&clothesColor=9333ea&clothes=shirt&eyebrows=happy&eyes=happy&rearHair=longStraight&rearHairProbability=100&backgroundColor=f3e8ff&backgroundType=solid&beard=&beardProbability=0&seed=lawreformer-woman'

const IDLE_URL = `https://api.dicebear.com/9.x/toon-head/svg?${BASE_PARAMS}&mouth=smile`
const SPEAK_URL = `https://api.dicebear.com/9.x/toon-head/svg?${BASE_PARAMS}&mouth=agape`

export default function Avatar({ isSpeaking, size = 220 }) {
  const [showOpen, setShowOpen] = useState(false)

  // Alternate between open/closed mouth when speaking for lip-sync
  useEffect(() => {
    if (!isSpeaking) {
      setShowOpen(false)
      return
    }
    const interval = setInterval(() => {
      setShowOpen(prev => !prev)
    }, 280)
    return () => clearInterval(interval)
  }, [isSpeaking])

  const currentUrl = isSpeaking && showOpen ? SPEAK_URL : IDLE_URL

  return (
    <div
      className="relative flex-shrink-0 rounded-2xl overflow-visible"
      style={{ width: size, height: size }}
    >
      {isSpeaking && (
        <div className="absolute inset-[-3px] rounded-2xl border-2 border-brand-400/40 animate-pulse z-30 pointer-events-none" />
      )}

      {/* Preload both images */}
      <link rel="preload" href={IDLE_URL} as="image" />
      <link rel="preload" href={SPEAK_URL} as="image" />

      <img
        src={currentUrl}
        alt="LawReformer AI Assistant"
        width={size}
        height={size}
        className="w-full h-full object-cover rounded-2xl transition-none"
        loading="eager"
      />

      {size >= 100 && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-full px-4 py-1 shadow-md z-30">
          <span className="text-xs font-medium text-brand-700 dark:text-brand-300 whitespace-nowrap">
            {isSpeaking ? '🗣️ Speaking...' : '⚖️ LawReformer AI'}
          </span>
        </div>
      )}
    </div>
  )
}
