import React, { useState } from 'react'

export default function SpeechPlayer({ text, language }) {
  const [playing, setPlaying] = useState(false)

  if (typeof window === 'undefined' || !window.speechSynthesis) return null

  const handleListen = () => {
    const synth = window.speechSynthesis
    synth.cancel()

    const clean = text
      .replace(/\[([^\]]+)\]/g, '')
      .replace(/[*#_~`|→•]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .replace(/\s{2,}/g, ' ')
      .trim()
    if (!clean) return

    const u = new SpeechSynthesisUtterance(clean)
    u.lang = { English: 'en-IN', Hindi: 'hi-IN', Bengali: 'bn-IN', Tamil: 'ta-IN', Telugu: 'te-IN', Marathi: 'mr-IN', Kannada: 'kn-IN', Gujarati: 'gu-IN' }[language] || 'en-IN'
    u.rate = 0.9
    u.pitch = 1.1

    u.onstart = () => setPlaying(true)
    u.onend = () => setPlaying(false)
    u.onerror = () => setPlaying(false)

    synth.speak(u)
  }

  const handleStop = () => {
    window.speechSynthesis.cancel()
    setPlaying(false)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!playing ? (
        <button onClick={handleListen}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
          aria-label="Read aloud">
          🔊 Listen
        </button>
      ) : (
        <button onClick={handleStop}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[36px]"
          aria-label="Stop">
          ⏹ Stop
        </button>
      )}
    </div>
  )
}
