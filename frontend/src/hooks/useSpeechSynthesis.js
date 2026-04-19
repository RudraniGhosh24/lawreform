import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CONFIG = {
  English: {
    codes: ['en-IN', 'en'],
    rate: 0.95,
    pitch: 1.0,
    preferred: ['Google India English', 'Microsoft Ravi', 'Rishi', 'en-IN', 'en_IN'],
  },
  Hindi: {
    codes: ['hi-IN', 'hi'],
    rate: 0.9,
    pitch: 1.05,
    preferred: ['Google हिन्दी', 'Microsoft Hemant', 'Microsoft Kalpana', 'Lekha'],
  },
  Bengali: {
    codes: ['bn-IN', 'bn-BD', 'bn'],
    rate: 0.85,
    pitch: 1.0,
    // Bengali voices are rare — also try Hindi as fallback since it sounds
    // more natural than English for Bengali text
    preferred: ['Google বাংলা', 'Piya', 'Tanishaa'],
    fallbackCodes: ['hi-IN', 'hi'],
  },
}

export default function useSpeechSynthesis(language = 'English') {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [rate, setRate] = useState(1)
  const [voices, setVoices] = useState([])
  const [unlocked, setUnlocked] = useState(false)
  const utteranceRef = useRef(null)
  const pendingTextRef = useRef(null)

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

  // Unlock TTS on first user interaction (mobile requirement)
  useEffect(() => {
    if (!isSupported || unlocked) return
    const unlock = () => {
      try {
        const u = new SpeechSynthesisUtterance('')
        u.volume = 0
        window.speechSynthesis.speak(u)
        window.speechSynthesis.cancel()
      } catch {}
      setUnlocked(true)
    }
    // Listen on both click and touchend for maximum compatibility
    document.addEventListener('click', unlock, { once: true, capture: true })
    document.addEventListener('touchend', unlock, { once: true, capture: true })
    return () => {
      document.removeEventListener('click', unlock, { capture: true })
      document.removeEventListener('touchend', unlock, { capture: true })
    }
  }, [isSupported, unlocked])

  // Load voices — browsers load them async
  useEffect(() => {
    if (!isSupported) return

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length > 0) setVoices(v)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [isSupported])

  // Smart voice selection — female voices only
  const isFemaleVoice = (v) => {
    const name = v.name.toLowerCase()
    // Exclude known male voices
    if (/\b(male|ravi|hemant|david|james|mark|daniel|george)\b/i.test(name)) return false
    // Prefer known female voices
    if (/\b(female|zira|samantha|kalpana|lekha|piya|tanishaa|google.*english|google.*हिन्दी|google.*বাংলা)\b/i.test(name)) return true
    // Default: assume female if not clearly male
    return true
  }

  const getVoice = useCallback(() => {
    if (!isSupported || voices.length === 0) return null

    const config = LANG_CONFIG[language] || LANG_CONFIG.English

    // 1. Try preferred voice names first — female only
    for (const name of config.preferred) {
      const match = voices.find((v) => v.name.includes(name) && isFemaleVoice(v))
      if (match) return match
    }

    // 2. Try exact language code matches — female, prefer network voices
    for (const code of config.codes) {
      const remote = voices.find((v) => v.lang === code && !v.localService && isFemaleVoice(v))
      if (remote) return remote
      const local = voices.find((v) => v.lang === code && isFemaleVoice(v))
      if (local) return local
    }

    // 3. Try language prefix match — female
    const prefix = config.codes[0].split('-')[0]
    const prefixMatch = voices.find((v) => v.lang.startsWith(prefix) && isFemaleVoice(v))
    if (prefixMatch) return prefixMatch

    // 4. For Bengali — fall back to Hindi female voice
    if (config.fallbackCodes) {
      for (const code of config.fallbackCodes) {
        const fb = voices.find((v) => v.lang === code && isFemaleVoice(v))
        if (fb) return fb
      }
    }

    return null
  }, [language, voices, isSupported])

  const speakInternal = useCallback(
    (text) => {
      if (!isSupported || !text) return
      window.speechSynthesis.cancel()

      const config = LANG_CONFIG[language] || LANG_CONFIG.English

      // Mobile fix: Chrome on Android pauses TTS after ~15s. 
      // Split into shorter chunks and queue them.
      const maxLen = 200
      const sentences = text.match(/[^.!?।]+[.!?।]?\s*/g) || [text]
      const chunks = []
      let current = ''
      for (const s of sentences) {
        if ((current + s).length > maxLen && current) {
          chunks.push(current.trim())
          current = s
        } else {
          current += s
        }
      }
      if (current.trim()) chunks.push(current.trim())

      let chunkIndex = 0
      const speakNext = () => {
        if (chunkIndex >= chunks.length) {
          setIsSpeaking(false)
          setIsPaused(false)
          return
        }

        const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex])
        utterance.lang = config.codes[0]
        utterance.rate = rate !== 1 ? rate : config.rate
        utterance.pitch = config.pitch

        const voice = getVoice()
        if (voice) {
          utterance.voice = voice
          utterance.lang = voice.lang
        }

        utterance.onstart = () => {
          setIsSpeaking(true)
          setIsPaused(false)
        }
        utterance.onend = () => {
          chunkIndex++
          speakNext()
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          setIsPaused(false)
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
      }

      speakNext()
    },
    [language, rate, getVoice, isSupported]
  )

  // Public speak — queues if TTS not yet unlocked on mobile
  const speak = useCallback((text) => {
    if (!isSupported || !text) return
    if (!unlocked) {
      // Store pending text and try to play after a short delay (user may have just tapped)
      pendingTextRef.current = text
      setTimeout(() => {
        if (pendingTextRef.current) {
          speakInternal(pendingTextRef.current)
          pendingTextRef.current = null
        }
      }, 500)
      return
    }
    speakInternal(text)
  }, [isSupported, unlocked, speakInternal])

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
