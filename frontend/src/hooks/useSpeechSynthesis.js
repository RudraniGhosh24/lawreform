import { useState, useCallback, useEffect, useRef } from 'react'

const LANG_CODES = {
  English: 'en-US',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
  Tamil: 'ta-IN',
  Telugu: 'te-IN',
  Marathi: 'mr-IN',
  Kannada: 'kn-IN',
  Gujarati: 'gu-IN',
}

export default function useSpeechSynthesis(language = 'English') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const resumeInterval = useRef(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Chrome Mac bug: speechSynthesis gets stuck. Periodic resume() fixes it.
  const startResumeHack = useCallback(() => {
    if (resumeInterval.current) clearInterval(resumeInterval.current)
    resumeInterval.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 5000)
  }, [])

  const stopResumeHack = useCallback(() => {
    if (resumeInterval.current) {
      clearInterval(resumeInterval.current)
      resumeInterval.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopResumeHack()
  }, [stopResumeHack])

  const speak = useCallback((text) => {
    if (!isSupported || !text) return

    const synth = window.speechSynthesis
    synth.cancel()

    // Wait a tick after cancel (Chrome needs this)
    requestAnimationFrame(() => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANG_CODES[language] || 'en-US'
      utterance.rate = rate || 0.9
      utterance.pitch = 1.1

      // Pick a female voice
      const voices = synth.getVoices()
      if (voices.length > 0) {
        const langCode = LANG_CODES[language] || 'en-US'
        const prefix = langCode.split('-')[0]
        const female = voices.find(v =>
          v.lang.startsWith(prefix) &&
          !/\b(ravi|hemant|david|james|rishi|kumar|raj|male|daniel|thomas|george)\b/i.test(v.name)
        )
        if (female) utterance.voice = female
      }

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        startResumeHack()
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        stopResumeHack()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsPaused(false)
        stopResumeHack()
      }

      synth.speak(utterance)
    })
  }, [language, rate, isSupported, startResumeHack, stopResumeHack])

  const pause = useCallback(() => {
    if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false); stopResumeHack() }
  }, [isSupported, stopResumeHack])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
