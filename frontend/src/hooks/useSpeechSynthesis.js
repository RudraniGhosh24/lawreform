import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CONFIG = {
  English: { codes: ['en-US', 'en'], rate: 0.95, pitch: 1.1, preferred: ['Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria'] },
  Hindi: { codes: ['hi-IN', 'hi'], rate: 0.9, pitch: 1.1, preferred: ['Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Swati'] },
  Bengali: { codes: ['bn-IN', 'bn-BD', 'bn'], rate: 0.85, pitch: 1.1, preferred: ['Google বাংলা', 'Piya', 'Tanishaa'], fallbackCodes: ['hi-IN'] },
  Tamil: { codes: ['ta-IN', 'ta'], rate: 0.85, pitch: 1.1, preferred: ['Google தமிழ்', 'Microsoft Valluvar'], fallbackCodes: ['en-IN'] },
  Telugu: { codes: ['te-IN', 'te'], rate: 0.85, pitch: 1.1, preferred: ['Google తెలుగు'], fallbackCodes: ['en-IN'] },
  Marathi: { codes: ['mr-IN', 'mr'], rate: 0.85, pitch: 1.1, preferred: ['Google मराठी'], fallbackCodes: ['hi-IN'] },
  Kannada: { codes: ['kn-IN', 'kn'], rate: 0.85, pitch: 1.1, preferred: ['Google ಕನ್ನಡ'], fallbackCodes: ['en-IN'] },
  Gujarati: { codes: ['gu-IN', 'gu'], rate: 0.85, pitch: 1.1, preferred: ['Google ગુજરાતી'], fallbackCodes: ['hi-IN'] },
}

const isFemaleVoice = (v) => {
  const n = v.name.toLowerCase()
  if (/\b(male|ravi|hemant|david|james|mark|daniel|george|richard|thomas|rishi|aaron|adam|brian|chris|fred|guy|kumar|mohan|raj)\b/.test(n)) return false
  return true
}

export default function useSpeechSynthesis(language = 'English') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [voices, setVoices] = useState([])
  const utteranceRef = useRef(null)
  const speakingRef = useRef(false)

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!isSupported) return
    const load = () => { const v = window.speechSynthesis.getVoices(); if (v.length) setVoices(v) }
    load()
    window.speechSynthesis.onvoiceschanged = load
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [isSupported])

  const getVoice = useCallback(() => {
    if (voices.length === 0) return null
    const config = LANG_CONFIG[language] || LANG_CONFIG.English
    for (const name of config.preferred) {
      const m = voices.find(v => v.name.includes(name) && isFemaleVoice(v))
      if (m) return m
    }
    for (const code of config.codes) {
      const r = voices.find(v => v.lang === code && !v.localService && isFemaleVoice(v))
      if (r) return r
      const l = voices.find(v => v.lang === code && isFemaleVoice(v))
      if (l) return l
    }
    const prefix = config.codes[0].split('-')[0]
    const p = voices.find(v => v.lang.startsWith(prefix) && isFemaleVoice(v))
    if (p) return p
    if (config.fallbackCodes) {
      for (const code of config.fallbackCodes) {
        const f = voices.find(v => v.lang === code && isFemaleVoice(v))
        if (f) return f
      }
    }
    return null
  }, [language, voices])

  const speak = useCallback((text) => {
    if (!isSupported || !text) return
    window.speechSynthesis.cancel()

    const config = LANG_CONFIG[language] || LANG_CONFIG.English

    // Chrome desktop bug: speak() silently fails after cancel() without delay
    const doSpeak = () => {
      const u = new SpeechSynthesisUtterance(text.slice(0, 500))
      u.lang = config.codes[0]
      u.rate = rate !== 1 ? rate : config.rate
      u.pitch = config.pitch

      const voice = getVoice()
      if (voice) { u.voice = voice; u.lang = voice.lang }

      u.onstart = () => { speakingRef.current = true; setIsSpeaking(true); setIsPaused(false) }
      u.onend = () => { speakingRef.current = false; setIsSpeaking(false); setIsPaused(false) }
      u.onerror = (e) => { console.error('TTS error:', e); speakingRef.current = false; setIsSpeaking(false); setIsPaused(false) }

      utteranceRef.current = u
      window.speechSynthesis.speak(u)

      // Chrome bug workaround: resume if paused after 100ms
      setTimeout(() => {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume()
      }, 100)
    }

    // Delay after cancel for Chrome desktop
    setTimeout(doSpeak, 50)
  }, [language, rate, getVoice, isSupported])

  const pause = useCallback(() => { if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) } }, [isSupported])
  const resume = useCallback(() => { if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) } }, [isSupported])
  const stop = useCallback(() => { if (isSupported) { window.speechSynthesis.cancel(); speakingRef.current = false; setIsSpeaking(false); setIsPaused(false) } }, [isSupported])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
