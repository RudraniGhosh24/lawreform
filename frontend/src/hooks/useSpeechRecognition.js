import { useState, useRef, useCallback, useEffect } from 'react'

const LANG_CODES = {
  English: 'en-IN',
  Hindi: 'hi-IN',
  Bengali: 'bn-IN',
}

export default function useSpeechRecognition(language = 'English', onSpeechEnd) {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef(null)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    setIsSupported(
      typeof window !== 'undefined' &&
        ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    )
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) return

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }

    finalTranscriptRef.current = ''

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.lang = LANG_CODES[language] || 'en-IN'
    recognition.continuous = !/Android|iPhone|iPad/i.test(navigator.userAgent)
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onstart = () => setIsListening(true)

    recognition.onresult = (event) => {
      let finalT = ''
      let interimT = ''
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalT += result[0].transcript
        } else {
          interimT += result[0].transcript
        }
      }
      finalTranscriptRef.current = finalT
      setTranscript(finalT + interimT)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'not-allowed') {
        alert('Please allow microphone access to use voice input.')
      }
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      // Auto-submit when user stops speaking and there's a transcript
      const text = finalTranscriptRef.current.trim()
      if (text && onSpeechEnd) {
        setTimeout(() => onSpeechEnd(text), 300)
      }
    }

    recognitionRef.current = recognition

    try {
      recognition.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      setIsListening(false)
    }
  }, [language, isSupported, onSpeechEnd])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      setIsListening(false)
    }
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    finalTranscriptRef.current = ''
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
