import React from 'react'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis'

export default function SpeechPlayer({ text, language }) {
  const { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported } =
    useSpeechSynthesis(language)

  if (!isSupported) return null

  const cleanText = text
    .replace(/\[([^\]]+)\]/g, '') // Remove citation brackets
    .replace(/[📜✨→•🔊⏸️⏹️▶️🗣️⚖️🤖🎙️📄📋🚨📝⚙️⏰🤪🏠ℹ️]/gu, '') // Remove emojis
    .replace(/[*#_~`|]/g, '') // Remove markdown symbols like * # _ ~ `
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .replace(/\b\d{10,}\b/g, '') // Remove very long numbers (phone etc)
    .replace(/₹\s?(\d)/g, 'rupees $1') // Convert ₹ to "rupees"
    .replace(/\n{2,}/g, '. ') // Double newlines become pauses
    .replace(/\n/g, '. ') // Single newlines too
    .replace(/\s{2,}/g, ' ') // Collapse whitespace
    .replace(/\.\s*\./g, '.') // Remove double periods
    .trim()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isSpeaking ? (
        <button
          onClick={() => speak(cleanText)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
          aria-label="Read aloud"
        >
          🔊 Listen
        </button>
      ) : (
        <>
          <button
            onClick={isPaused ? resume : pause}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={stop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[36px]"
            aria-label="Stop"
          >
            ⏹️ Stop
          </button>
        </>
      )}

      <select
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="text-xs bg-transparent border border-brand-200 dark:border-brand-700 rounded-full px-2 py-1 text-text-muted min-h-[36px]"
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
