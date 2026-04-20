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

function getVoicesAsync() {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(voices)
      return
    }
    // Chrome loads voices async — wait for them
    const onVoicesChanged = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
        resolve(v)
      }
    }
    window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
    // Timeout fallback — resolve with empty after 3s
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 3000)
  })
}

export default function useSpeechSynthesis(language = 'English') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const resumeTimer = useRef(null)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  // Chrome Mac bug: speech gets stuck after ~15s. Periodic resume fixes it.
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

  const speak = useCallback(async (text) => {
    if (!isSupported || !text) return

    const synth = window.speechSynthesis
    synth.cancel()

    // Wait for voices to be available (critical for Chrome Mac)
    const voices = await getVoicesAsync()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = LANG_CODES[language] || 'en-US'
    utterance.rate = rate || 0.9
    utterance.pitch = 1.1

    // Pick a female voice
    if (voices.length > 0) {
      const prefix = (LANG_CODES[language] || 'en-US').split('-')[0]
      const female = voices.find(v =>
        v.lang.startsWith(prefix) &&
        !/\b(ravi|hemant|david|james|rishi|kumar|raj|male|daniel|thomas|george|aaron|fred)\b/i.test(v.name)
      )
      if (female) {
        utterance.voice = female
      } else {
        // Any voice for this language
        const any = voices.find(v => v.lang.startsWith(prefix))
        if (any) utterance.voice = any
      }
    }

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false); startKeepAlive() }
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); stopKeepAlive() }
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false); stopKeepAlive() }

    synth.speak(utterance)
  }, [language, rate, isSupported, startKeepAlive, stopKeepAlive])

  const pause = useCallback(() => {
    if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false); stopKeepAlive() }
  }, [isSupported, stopKeepAlive])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
