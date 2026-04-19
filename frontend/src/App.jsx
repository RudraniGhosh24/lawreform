import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import AboutModal from './components/AboutModal'
import VoiceButton from './components/VoiceButton'
import ChatWindow from './components/ChatWindow'
import ScenarioTiles from './components/ScenarioTiles'
import useSpeechRecognition from './hooks/useSpeechRecognition'
import useSpeechSynthesis from './hooks/useSpeechSynthesis'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DISCLAIMER = {
  English:
    'Lawreformer AI provides legal information, not legal advice. For serious matters, contact your District Legal Services Authority (DLSA) — free legal aid is your right under the Legal Services Authorities Act 1987.',
  Hindi:
    'लॉरिफॉर्मर AI कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। गंभीर मामलों के लिए, अपने जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें — विधिक सेवा प्राधिकरण अधिनियम 1987 के तहत मुफ्त कानूनी सहायता आपका अधिकार है।',
  Bengali:
    'Lawreformer AI আইনি তথ্য প্রদান করে, আইনি পরামর্শ নয়। গুরুতর বিষয়ে, আপনার জেলা আইনি সেবা কর্তৃপক্ষ (DLSA) এর সাথে যোগাযোগ করুন — আইনি সেবা কর্তৃপক্ষ আইন ১৯৮৭ এর অধীনে বিনামূল্যে আইনি সহায়তা আপনার অধিকার।',
}

const PLACEHOLDER = {
  English: 'Type your legal question here...',
  Hindi: 'अपना कानूनी सवाल यहाँ लिखें...',
  Bengali: 'আপনার আইনি প্রশ্ন এখানে লিখুন...',
}

export default function App() {
  const [language, setLanguage] = useState('English')
  const [darkMode, setDarkMode] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingIndex, setStreamingIndex] = useState(-1)

  const speech = useSpeechRecognition(language)
  const tts = useSpeechSynthesis(language)

  // Apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Sync speech transcript to input
  useEffect(() => {
    if (speech.transcript) {
      setInput(speech.transcript)
    }
  }, [speech.transcript])

  const handleSubmit = useCallback(
    async (questionText) => {
      const question = questionText || input.trim()
      if (!question || isLoading) return

      speech.stopListening()
      speech.resetTranscript()
      setInput('')

      // Add user message
      const userMsg = { role: 'user', content: question }
      const aiMsg = { role: 'assistant', content: '' }
      setMessages((prev) => [...prev, userMsg, aiMsg])
      setIsLoading(true)

      const aiIndex = messages.length + 1
      setStreamingIndex(aiIndex)

      try {
        const res = await fetch(`${API_URL}/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, language }),
        })

        if (!res.ok) throw new Error(`Server error: ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullResponse = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.token) {
                  fullResponse += data.token
                  setMessages((prev) => {
                    const updated = [...prev]
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: fullResponse,
                    }
                    return updated
                  })
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }
        }

        // Auto-read response aloud
        if (fullResponse && tts.isSupported) {
          const cleanText = fullResponse.replace(/\[([^\]]+)\]/g, '$1')
          tts.speak(cleanText)
        }
      } catch (err) {
        console.error('Error:', err)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content:
              '⚠️ Sorry, I could not connect to the server. Please check that the backend is running and try again.',
          }
          return updated
        })
      } finally {
        setIsLoading(false)
        setStreamingIndex(-1)
      }
    },
    [input, isLoading, language, messages.length, speech, tts, API_URL]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleMicToggle = () => {
    if (speech.isListening) {
      speech.stopListening()
    } else {
      speech.resetTranscript()
      speech.startListening()
    }
  }

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-screen bg-offwhite dark:bg-charcoal">
      <Header
        language={language}
        setLanguage={setLanguage}
        onAboutClick={() => setAboutOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="flex-1 flex flex-col overflow-hidden max-w-5xl w-full mx-auto">
        {/* Chat area or welcome screen */}
        {hasMessages ? (
          <ChatWindow
            messages={messages}
            language={language}
            streamingIndex={streamingIndex}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-6 overflow-y-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-charcoal dark:text-offwhite">
                {language === 'Hindi'
                  ? 'अपने अधिकार जानें'
                  : language === 'Bengali'
                  ? 'আপনার অধিকার জানুন'
                  : 'Know Your Rights'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                {language === 'Hindi'
                  ? 'अपना सवाल बोलें या नीचे से चुनें'
                  : language === 'Bengali'
                  ? 'আপনার প্রশ্ন বলুন বা নীচে থেকে বেছে নিন'
                  : 'Speak your question or choose from below'}
              </p>
            </div>

            <VoiceButton
              isListening={speech.isListening}
              onToggle={handleMicToggle}
              isSupported={speech.isSupported}
            />

            {speech.isListening && (
              <p className="text-sm text-saffron-500 animate-pulse" aria-live="polite">
                {language === 'Hindi'
                  ? '🎙️ सुन रहा हूँ...'
                  : language === 'Bengali'
                  ? '🎙️ শুনছি...'
                  : '🎙️ Listening...'}
              </p>
            )}

            <ScenarioTiles language={language} onSelect={handleSubmit} />
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
          {/* Disclaimer */}
          <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 text-center mb-2 leading-relaxed">
            {DISCLAIMER[language]}
          </p>

          <div className="flex items-end gap-2 max-w-3xl mx-auto">
            <VoiceButton
              isListening={speech.isListening}
              onToggle={handleMicToggle}
              isSupported={speech.isSupported}
            />

            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER[language]}
                rows={1}
                className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-sm text-charcoal dark:text-offwhite placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent min-h-[48px]"
                aria-label="Type your question"
                disabled={isLoading}
              />
            </div>

            <button
              onClick={() => handleSubmit()}
              disabled={isLoading || !input.trim()}
              className="px-4 py-3 rounded-xl bg-saffron-500 text-white font-medium text-sm hover:bg-saffron-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[48px] min-h-[48px]"
              aria-label="Send"
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                '→'
              )}
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
