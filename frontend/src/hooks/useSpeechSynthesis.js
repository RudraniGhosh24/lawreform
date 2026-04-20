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
  const voicesRef = useRef([])
  const resumeTimer = useRef(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Load voices eagerly on mount — so they're ready when speak is called
  useEffect(() => {
    if (!isSupported) return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) voicesRef.current = v
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [isSupported])

  // Chrome Mac keep-alive hack
  const startKeepAlive = useCallback(() => {
    if (resumeTimer.current) clearInterval(resumeTimer.current)
    resumeTimer.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause()
        window.speechSynthesis.resume()
      }
    }, 5000)
  }, [])

  const stopKeepAlive = useCallback(() => {
    if (resumeTimer.current) { clearInterval(resumeTimer.current); resumeTimer.current = null }
  }, [])

  useEffect(() => () => stopKeepAlive(), [stopKeepAlive])

  // SYNCHRONOUS speak — no async, no await, works in click handlers on all browsers
  const speak = useCallback((text) => {
    if (!isSupported || !text) return

    const synth = window.speechSynthesis

    // If voices aren't loaded yet, try one more time
    if (voicesRef.current.length === 0) {
      voicesRef.current = synth.getVoices()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_CODES[language] || 'en-US'
    utterance.rate = rate || 0.9
    utterance.pitch = 1.1

    // Pick a female voice — prefer Google or Samantha voices
    const voices = voicesRef.current
    if (voices.length > 0) {
      const prefix = (LANG_CODES[language] || 'en-US').split('-')[0]
      const langVoices = voices.filter(v => v.lang.startsWith(prefix))
      
      // Prefer known good female voices
      const goodNames = ['samantha', 'karen', 'victoria', 'susan', 'fiona', 'moira', 'tessa', 'google', 'microsoft', 'kalpana', 'lekha', 'swati']
      const good = langVoices.find(v => goodNames.some(n => v.name.toLowerCase().includes(n)))
      if (good) {
        utterance.voice = good
      } else {
        // Pick first non-novelty voice for this language
        const normal = langVoices.find(v => 
          !/\b(bad news|bells|boing|bubbles|cellos|good news|hysterical|junior|organ|superstar|trinoids|whisper|wobble|zarvox|albert|ralph|fred)\b/i.test(v.name) &&
          !/\b(ravi|hemant|david|james|rishi|kumar|raj|daniel|thomas|george|aaron)\b/i.test(v.name)
        )
        if (normal) utterance.voice = normal
        else if (langVoices.length > 0) utterance.voice = langVoices[0]
      }
    }

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); startKeepAlive() }
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); stopKeepAlive() }
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); stopKeepAlive() }

    // DO NOT call cancel() before speak on Mac Chrome — it kills the user gesture
    synth.speak(utterance)
  }, [language, rate, isSupported, startKeepAlive, stopKeepAlive])

  const pause = useCallback(() => {
    if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) {
      // Use pause first, then cancel after a tick (Mac Chrome compat)
      window.speechSynthesis.pause()
      setTimeout(() => window.speechSynthesis.cancel(), 50)
      setIsSpeaking(false); setIsPaused(false); stopKeepAlive()
    }
  }, [isSupported, stopKeepAlive])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
