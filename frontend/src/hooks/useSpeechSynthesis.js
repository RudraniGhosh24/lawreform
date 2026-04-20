import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CONFIG = {
  English: { codes: ['en-US', 'en'], rate: 0.95, pitch: 1.1, preferred: ['Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria'] },
  Hindi: { codes: ['hi-IN', 'hi'], rate: 0.9, pitch: 1.1, preferred: ['Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Swati'] },
  Bengali: { codes: ['bn-IN', 'bn-BD', 'bn'], rate: 0.85, pitch: 1.1, preferred: ['Google বাংলা'], fallbackCodes: ['hi-IN'] },
  Tamil: { codes: ['ta-IN', 'ta'], rate: 0.85, pitch: 1.1, preferred: ['Google தமிழ்'], fallbackCodes: ['en-IN'] },
  Telugu: { codes: ['te-IN', 'te'], rate: 0.85, pitch: 1.1, preferred: ['Google తెలుగు'], fallbackCodes: ['en-IN'] },
  Marathi: { codes: ['mr-IN', 'mr'], rate: 0.85, pitch: 1.1, preferred: ['Google मराठी'], fallbackCodes: ['hi-IN'] },
  Gujarati: { codes: ['gu-IN', 'gu'], rate: 0.85, pitch: 1.1, preferred: ['Google ગુજરાતી'], fallbackCodes: ['hi-IN'] },
  Kannada: { codes: ['kn-IN', 'kn'], rate: 0.85, pitch: 1.1, preferred: ['Google ಕನ್ನಡ'], fallbackCodes: ['en-IN'] },
  Malayalam: { codes: ['ml-IN', 'ml'], rate: 0.85, pitch: 1.1, preferred: ['Google മലയാളം'], fallbackCodes: ['en-IN'] },
  Punjabi: { codes: ['pa-IN', 'pa'], rate: 0.85, pitch: 1.1, preferred: ['Google ਪੰਜਾਬੀ'], fallbackCodes: ['hi-IN'] },
  Odia: { codes: ['or-IN', 'or'], rate: 0.85, pitch: 1.1, preferred: [], fallbackCodes: ['hi-IN'] },
  Assamese: { codes: ['as-IN', 'as'], rate: 0.85, pitch: 1.1, preferred: [], fallbackCodes: ['bn-IN', 'hi-IN'] },
  Urdu: { codes: ['ur-IN', 'ur-PK', 'ur'], rate: 0.85, pitch: 1.1, preferred: ['Google اردو'], fallbackCodes: ['hi-IN'] },
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
  const [pendingText, setPendingText] = useState(null)
  const utteranceRef = useRef(null)

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
    // Last resort: any female voice
    return voices.find(v => isFemaleVoice(v)) || voices[0] || null
  }, [language, voices])

  const doSpeak = useCallback((text) => {
    if (!isSupported || !text) return
    window.speechSynthesis.cancel()

    const config = LANG_CONFIG[language] || LANG_CONFIG.English
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
      if (i >= chunks.length) { setIsSpeaking(false); setIsPaused(false); return }
      const u = new SpeechSynthesisUtterance(chunks[i])
      u.lang = config.codes[0]
      u.rate = rate !== 1 ? rate : config.rate
      u.pitch = config.pitch
      const voice = getVoice()
      if (voice) { u.voice = voice; u.lang = voice.lang }
      u.onstart = () => { setIsSpeaking(true); setIsPaused(false) }
      u.onend = () => { i++; next() }
      u.onerror = () => { setIsSpeaking(false); setIsPaused(false) }
      utteranceRef.current = u
      window.speechSynthesis.speak(u)
    }
    next()
  }, [language, rate, getVoice, isSupported])

  // Queue text for speaking
  const speak = useCallback((text) => {
    if (!isSupported || !text) return
    doSpeak(text)
  }, [isSupported, doSpeak])

  const pause = useCallback(() => { if (isSupported) { window.speechSynthesis.pause(); setIsPaused(true) } }, [isSupported])
  const resume = useCallback(() => { if (isSupported) { window.speechSynthesis.resume(); setIsPaused(false) } }, [isSupported])
  const stop = useCallback(() => { if (isSupported) { window.speechSynthesis.cancel(); setIsSpeaking(false); setIsPaused(false) } }, [isSupported])

  // Warm up speech synthesis on any user interaction so future speaks work
  useEffect(() => {
    if (!isSupported) return
    const warmUp = () => {
      const u = new SpeechSynthesisUtterance('')
      u.volume = 0
      try { window.speechSynthesis.speak(u) } catch {}
    }
    document.addEventListener('click', warmUp, { once: true })
    document.addEventListener('touchstart', warmUp, { once: true })
    return () => {
      document.removeEventListener('click', warmUp)
      document.removeEventListener('touchstart', warmUp)
    }
  }, [isSupported])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
