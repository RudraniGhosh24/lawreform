import React from 'react'

export default function VoiceButton({ isListening, onToggle, isSupported }) {
  if (!isSupported) return null

  return (
    <button
      onClick={onToggle}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 min-w-[64px] min-h-[64px] border-2 ${
        isListening
          ? 'bg-red-500 border-red-400 text-white mic-pulse shadow-lg shadow-red-500/30'
          : 'bg-brand-600 border-brand-500 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/30'
      }`}
      aria-label={isListening ? 'Stop recording' : 'Start recording'}
      aria-pressed={isListening}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isListening ? (
          <rect x="6" y="6" width="12" height="12" rx="2" />
        ) : (
          <>
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </>
        )}
      </svg>
    </button>
  )
}
