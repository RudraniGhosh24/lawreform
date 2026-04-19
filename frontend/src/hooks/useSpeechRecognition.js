import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CODES = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
}

export default function useSpeechRecognition(language = 'English') {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)

  // Check support on mount (avoids SSR issues)
  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) return

    // Stop any existing session first (mobile fix)
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = LANG_CODES[language] || 'en-IN'
    // Mobile: continuous=false works better, desktop: continuous=true
    recognition.continuous = !/Android|iPhone|iPad/i.test(navigator.userAgent)
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimTranscript = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }
      setTranscript(finalTranscript + interimTranscript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      // On mobile, "not-allowed" means user denied mic permission
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.')
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setIsListening(false)
    }
  }, [language, isSupported])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      setIsListening(false)
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  return {
    transcript,
    setTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  }
}
