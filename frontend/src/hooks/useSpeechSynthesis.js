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
  const utteranceRef = useRef(null)

  const isSupported =
    typeof window !== 'undefined' && 'speechSynthesis' in window

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

  // Smart voice selection — pick the most natural-sounding voice
  const getVoice = useCallback(() => {
    if (!isSupported || voices.length === 0) return null

    const config = LANG_CONFIG[language] || LANG_CONFIG.English

    // 1. Try preferred voice names first (these are the best quality)
    for (const name of config.preferred) {
      const match = voices.find((v) => v.name.includes(name))
      if (match) return match
    }

    // 2. Try exact language code matches, prefer non-local (network) voices
    for (const code of config.codes) {
      // Prefer remote/network voices (higher quality)
      const remote = voices.find((v) => v.lang === code && !v.localService)
      if (remote) return remote
      const local = voices.find((v) => v.lang === code)
      if (local) return local
    }

    // 3. Try language prefix match
    const prefix = config.codes[0].split('-')[0]
    const prefixMatch = voices.find((v) => v.lang.startsWith(prefix) && !v.localService)
      || voices.find((v) => v.lang.startsWith(prefix))
    if (prefixMatch) return prefixMatch

    // 4. For Bengali — fall back to Hindi voice if no Bengali voice exists
    if (config.fallbackCodes) {
      for (const code of config.fallbackCodes) {
        const fb = voices.find((v) => v.lang === code)
        if (fb) return fb
      }
    }

    return null
  }, [language, voices, isSupported])

  const speak = useCallback(
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
