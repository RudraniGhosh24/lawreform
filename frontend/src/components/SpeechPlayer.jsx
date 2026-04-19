import React from 'react'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis'

export default function SpeechPlayer({ text, language }) {
  const { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported } =
    useSpeechSynthesis(language)

  if (!isSupported) return null

  // Strip citation brackets for cleaner TTS
  const cleanText = text.replace(/\[([^\]]+)\]/g, '$1')

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isSpeaking ? (
        <button
          onClick={() => speak(cleanText)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 dark:text-saffron-400 text-xs font-medium hover:bg-saffron-100 dark:hover:bg-saffron-900/40 transition-colors min-h-[36px]"
          aria-label="Read aloud"
        >
          🔊 Listen
        </button>
      ) : (
        <>
          <button
            onClick={isPaused ? resume : pause}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-saffron-50 dark:bg-saffron-900/20 text-saffron-600 dark:text-saffron-400 text-xs font-medium hover:bg-saffron-100 dark:hover:bg-saffron-900/40 transition-colors min-h-[36px]"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={stop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors min-h-[36px]"
            aria-label="Stop"
          >
            ⏹️ Stop
          </button>
        </>
      )}

      {/* Speed control */}
      <select
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="text-xs bg-transparent border border-gray-200 dark:border-gray-600 rounded-full px-2 py-1 text-gray-600 dark:text-gray-300 min-h-[36px]"
        aria-label="Speech speed"
      >
        <option value={0.75}>0.75×</option>
        <option value={1}>1×</option>
        <option value={1.25}>1.25×</option>
        <option value={1.5}>1.5×</option>
      </select>
    </div>
  )
}
