import { useState, useRef, useCallback, useEffect } from 'react'

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

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = useCallback((text) => {
    if (!isSupported || !text) return

    // Don't cancel — on Mac Chrome, cancel() resets the audio unlock
    // Instead just let the new utterance queue
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_CODES[language] || 'en-US'
    utterance.rate = rate || 0.9
    utterance.pitch = 1.1

    // Try to pick a female voice
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      const langCode = LANG_CODES[language] || 'en-US'
      const female = voices.find(v =>
        v.lang.startsWith(langCode.split('-')[0]) &&
        !/\b(ravi|hemant|david|james|rishi|kumar|raj|male)\b/i.test(v.name)
      )
      if (female) utterance.voice = female
    }

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false) }
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false) }
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false) }

    window.speechSynthesis.speak(utterance)
  }, [language, rate, isSupported])

  const pause = useCallback(() => {
    if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false) }
  }, [isSupported])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
