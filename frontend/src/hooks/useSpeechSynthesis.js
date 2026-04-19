import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CODES = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
}

export default function useSpeechSynthesis(language = 'English') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const utteranceRef = useRef(null)

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  // Find the best voice for the language
  const getVoice = useCallback(() => {
    if (!isSupported) return null
    const voices = window.speechSynthesis.getVoices()
    const langCode = LANG_CODES[language] || 'en-IN'
    // Prefer a voice matching the exact locale, then the language prefix
    return (
      voices.find((v) => v.lang === langCode) ||
      voices.find((v) => v.lang.startsWith(langCode.split('-')[0])) ||
      null
    )
  }, [language, isSupported])

  const speak = useCallback(
    (text) => {
      if (!isSupported || !text) return
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = LANG_CODES[language] || 'en-IN'
      utterance.rate = rate
      utterance.pitch = 1

      const voice = getVoice()
      if (voice) utterance.voice = voice

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }
      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [language, rate, getVoice, isSupported]
  )

  const pause = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [isSupported])

  // Load voices (some browsers load them async)
  useEffect(() => {
    if (isSupported) {
      window.speechSynthesis.getVoices()
      window.speechSynthesis.onvoiceschanged = () => {}
    }
  }, [isSupported])

  return {
    speak,
    pause,
    resume,
    stop,
    isSpeaking,
    isPaused,
    rate,
    setRate,
    isSupported,
  }
}
