import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CONFIG = {
  English: {
    codes: ['en-IN', 'en'],
    rate: 0.95,
    pitch: 1.1,
    preferred: ['Google India English Female', 'Microsoft Heera', 'Veena', 'Lekha', 'Google India English'],
  },
  Hindi: {
    codes: ['hi-IN', 'hi'],
    rate: 0.9,
    pitch: 1.1,
    preferred: ['Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Swati'],
  },
  Bengali: {
    codes: ['bn-IN', 'bn-BD', 'bn'],
    rate: 0.85,
    pitch: 1.1,
    preferred: ['Google বাংলা', 'Piya', 'Tanishaa'],
    fallbackCodes: ['hi-IN', 'hi'],
  },
}

// Female voice filter
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

  // Load voices
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

    // Only cancel if WE are currently speaking (not on random touches)
    if (speakingRef.current) {
      window.speechSynthesis.cancel()
    }

    const config = LANG_CONFIG[language] || LANG_CONFIG.English

    // Split into chunks for mobile compatibility
    const sentences = text.match(/[^.!?।]+[.!?।]?\s*/g) || [text]
    const chunks = []
    let cur = ''
    for (const s of sentences) {
      if ((cur + s).length > 200 && cur) { chunks.push(cur.trim()); cur = s }
      else cur += s
    }
    if (cur.trim()) chunks.push(cur.trim())

    let i = 0
    const next = () => {
      if (i >= chunks.length) {
        speakingRef.current = false
        setIsSpeaking(false)
        setIsPaused(false)
        return
      }
      const u = new SpeechSynthesisUtterance(chunks[i])
      u.lang = config.codes[0]
      u.rate = rate !== 1 ? rate : config.rate
      u.pitch = config.pitch
      const voice = getVoice()
      if (voice) { u.voice = voice; u.lang = voice.lang }
      u.onstart = () => { speakingRef.current = true; setIsSpeaking(true); setIsPaused(false) }
      u.onend = () => { i++; next() }
      u.onerror = () => { speakingRef.current = false; setIsSpeaking(false); setIsPaused(false) }
      utteranceRef.current = u
      window.speechSynthesis.speak(u)
    }
    next()
  }, [language, rate, getVoice, isSupported])

  const pause = useCallback(() => {
    if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) }
  }, [isSupported])

  const resume = useCallback(() => {
    if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) }
  }, [isSupported])

  const stop = useCallback(() => {
    if (isSupported) { window.speechSynthesis.cancel(); speakingRef.current = false; setIsSpeaking(false); setIsPaused(false) }
  }, [isSupported])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
