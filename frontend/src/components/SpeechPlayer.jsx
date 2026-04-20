import React from 'react'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis'

export default function SpeechPlayer({ text, language }) {
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } =
    useSpeechSynthesis(language)

  if (!isSupported) return null

  const handleListen = () => {
    // Clean text inline at click time
    const clean = text
      .replace(/\[([^\]]+)\]/g, '')
      .replace(/[*#_~`|→•]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (clean) speak(clean)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isSpeaking ? (
        <button onClick={handleListen}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
          aria-label="Read aloud">
          🔊 Listen
        </button>
      ) : (
        <>
          <button onClick={isPaused ? resume : pause}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
            aria-label={isPaused ? 'Resume' : 'Pause'}>
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </button>
          <button onClick={stop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[36px]"
            aria-label="Stop">
            ⏹ Stop
          </button>
        </>
      )}
    </div>
  )
}
