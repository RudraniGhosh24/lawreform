import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CONFIG = {
  English: { codes: ['en-US', 'en'], rate: 0.95, pitch: 1.1, preferred: ['Google US English', 'Microsoft Zira', 'Samantha', 'Karen', 'Victoria'] },
  Hindi: { codes: ['hi-IN', 'hi'], rate: 0.9, pitch: 1.1, preferred: ['Google हिन्दी', 'Microsoft Kalpana', 'Lekha', 'Swati'] },
  Bengali: { codes: ['bn-IN', 'bn-BD', 'bn'], rate: 0.85, pitch: 1.1, preferred: ['Google বাংলা', 'Piya', 'Tanishaa'], fallbackCodes: ['hi-IN'] },
  Tamil: { codes: ['ta-IN', 'ta'], rate: 0.85, pitch: 1.1, preferred: ['Google தமிழ்'], fallbackCodes: ['en-IN'] },
  Telugu: { codes: ['te-IN', 'te'], rate: 0.85, pitch: 1.1, preferred: ['Google తెలుగు'], fallbackCodes: ['en-IN'] },
  Kannada: { codes: ['kn-IN', 'kn'], rate: 0.85, pitch: 1.1, preferred: ['Google ಕನ್ನಡ'], fallbackCodes: ['en-IN'] },
  Malayalam: { codes: ['ml-IN', 'ml'], rate: 0.85, pitch: 1.1, preferred: ['Google മലയാളം'], fallbackCodes: ['en-IN'] },
  Marathi: { codes: ['mr-IN', 'mr'], rate: 0.9, pitch: 1.1, preferred: ['Google मराठी'], fallbackCodes: ['hi-IN'] },
  Gujarati: { codes: ['gu-IN', 'gu'], rate: 0.9, pitch: 1.1, preferred: ['Google ગુજરાતી'], fallbackCodes: ['hi-IN'] },
  Punjabi: { codes: ['pa-IN', 'pa'], rate: 0.9, pitch: 1.1, preferred: ['Google ਪੰਜਾਬੀ'], fallbackCodes: ['hi-IN'] },
  Odia: { codes: ['or-IN', 'or'], rate: 0.85, pitch: 1.1, preferred: [], fallbackCodes: ['hi-IN'] },
  Urdu: { codes: ['ur-IN', 'ur-PK', 'ur'], rate: 0.9, pitch: 1.1, preferred: ['Google اردو'], fallbackCodes: ['hi-IN'] },
  Assamese: { codes: ['as-IN', 'as'], rate: 0.85, pitch: 1.1, preferred: [], fallbackCodes: ['bn-IN', 'hi-IN'] },
  Hinglish: { codes: ['en-IN', 'hi-IN'], rate: 0.95, pitch: 1.1, preferred: ['Google India English', 'en-IN'], fallbackCodes: ['en-US'] },
  Auto: { codes: ['en-US', 'en'], rate: 0.95, pitch: 1.1, preferred: ['Google US English', 'Samantha', 'Microsoft Zira'] },
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

  // Load voices — Safari needs multiple retries
  useEffect(() => {
    if (!isSupported) return
    const load = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) setVoices(v)
    }
    load()
    window.speechSynthesis.onvoiceschanged = load
    // Safari fallback: retry loading voices
    const t1 = setTimeout(load, 100)
    const t2 = setTimeout(load, 500)
    const t3 = setTimeout(load, 1000)
    return () => { window.speechSynthesis.onvoiceschanged = null; clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
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
    return voices.find(v => isFemaleVoice(v)) || null
  }, [language, voices])

  const speak = useCallback((text) => {
    if (!text) return
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    // Stop any current speech
    try { window.speechSynthesis.cancel() } catch {}
    speakingRef.current = false

    const config = LANG_CONFIG[language] || LANG_CONFIG.English

    // Don't chunk on Safari — it handles long text better as one utterance
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator?.userAgent || '')
    
    let chunks
    if (isSafari) {
      chunks = [text]
    } else {
      const sentences = text.match(/[^.!?।]+[.!?।]?\s*/g) || [text]
      chunks = []
      let cur = ''
      for (const s of sentences) {
        if ((cur + s).length > 200 && cur) { chunks.push(cur.trim()); cur = s }
        else cur += s
      }
      if (cur.trim()) chunks.push(cur.trim())
    }

    let i = 0
    const speakChunk = () => {
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
      u.onend = () => { i++; speakChunk() }
      u.onerror = (e) => {
        // Safari sometimes fires error on cancel — ignore and retry
        if (e.error === 'canceled' || e.error === 'interrupted') { return }
        speakingRef.current = false; setIsSpeaking(false); setIsPaused(false)
      }

      utteranceRef.current = u

      // Safari fix: small delay between cancel and speak
      setTimeout(() => {
        try { window.speechSynthesis.speak(u) } catch {}
      }, i === 0 ? 50 : 0)
    }

    speakChunk()
  }, [language, rate, getVoice])

  const pause = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [])

  const resume = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      speakingRef.current = false
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [])

  return { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported }
}
