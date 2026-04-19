import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import AboutModal from '../src/components/AboutModal'
import VoiceButton from '../src/components/VoiceButton'
import ChatWindow from '../src/components/ChatWindow'
import ScenarioTiles from '../src/components/ScenarioTiles'
import DocumentUpload from '../src/components/DocumentUpload'
import Avatar from '../src/components/Avatar'
import useSpeechRecognition from '../src/hooks/useSpeechRecognition'
import useSpeechSynthesis from '../src/hooks/useSpeechSynthesis'

const DISCLAIMER = {
  English: 'Lawreformer AI provides legal information, not legal advice. For serious matters, contact your District Legal Services Authority (DLSA) — free legal aid is your right under the Legal Services Authorities Act 1987.',
  Hindi: 'लॉरिफॉर्मर AI कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। गंभीर मामलों के लिए, अपने जिला विधिक सेवा प्राधिकरण (DLSA) से संपर्क करें — मुफ्त कानूनी सहायता आपका अधिकार है।',
  Bengali: 'Lawreformer AI আইনি তথ্য প্রদান করে, আইনি পরামর্শ নয়। গুরুতর বিষয়ে, আপনার জেলা আইনি সেবা কর্তৃপক্ষ (DLSA) এর সাথে যোগাযোগ করুন — বিনামূল্যে আইনি সহায়তা আপনার অধিকার।',
}

const PLACEHOLDER = {
  English: 'Type your legal question here...',
  Hindi: 'अपना कानूनी सवाल यहाँ लिखें...',
  Bengali: 'আপনার আইনি প্রশ্ন এখানে লিখুন...',
}

export default function Home() {
  const [language, setLanguage] = useState('English')
  const [darkMode, setDarkMode] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingIndex, setStreamingIndex] = useState(-1)

  const speech = useSpeechRecognition(language)
  const tts = useSpeechSynthesis(language)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Live transcription — sync to input as user speaks
  useEffect(() => {
    if (speech.transcript) setInput(speech.transcript)
  }, [speech.transcript])

  const sendToAPI = useCallback(async (question, imageData) => {
    if ((!question && !imageData) || isLoading) return

    speech.stopListening()
    speech.resetTranscript()
    setInput('')

    const userContent = imageData
      ? '📄 ' + (question || 'Uploaded a document for analysis')
      : question
    const userMsg = { role: 'user', content: userContent }
    const aiMsg = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setIsLoading(true)
    const aiIndex = messages.length + 1
    setStreamingIndex(aiIndex)

    try {
      const body = { question, language }
      if (imageData) body.image = imageData
      // Send conversation history for context retention
      const prevMessages = messages.filter(m => m.content && m.content.length > 0)
      if (prevMessages.length > 0) body.history = prevMessages

      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Server error: ' + res.status)

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
                setMessages(prev => {
                  const updated = [...prev]
                  updated[updated.length - 1] = { role: 'assistant', content: fullResponse }
                  return updated
                })
              }
            } catch {}
          }
        }
      }

      // Auto-play TTS — no extra button press needed
      if (fullResponse && tts.isSupported) {
        const cleanForTTS = fullResponse
          .replace(/\[([^\]]+)\]/g, '')
          .replace(/[📜✨→•]/g, '')
          .replace(/https?:\/\/\S+/g, '')
          .replace(/\n{2,}/g, '. ')
          .replace(/\s{2,}/g, ' ')
          .trim()
        setTimeout(() => { tts.speak(cleanForTTS) }, 300)
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = { role: 'assistant', content: '⚠️ Sorry, could not connect to the server. Please try again.' }
        return updated
      })
    } finally {
      setIsLoading(false)
      setStreamingIndex(-1)
    }
  }, [input, isLoading, language, messages.length, speech, tts])

  const handleSubmit = useCallback((questionText) => {
    sendToAPI(questionText || input.trim(), null)
  }, [input, sendToAPI])

  const handleDocUpload = useCallback((imageData, fileName) => {
    const q = input.trim() || 'Please analyze this document and explain my legal rights.'
    sendToAPI(q, imageData)
  }, [input, sendToAPI])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
  }

  const handleMicToggle = () => {
    if (speech.isListening) speech.stopListening()
    else { speech.resetTranscript(); speech.startListening() }
  }

  const hasMessages = messages.length > 0

  return (
    <>
      <Head><title>LawReformer AI — Know Your Rights</title></Head>
      <div className="flex flex-col h-screen bg-surface dark:bg-[#0f0a1a]">
        <Header language={language} setLanguage={setLanguage} onAboutClick={() => setAboutOpen(true)} darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 flex flex-col overflow-hidden max-w-5xl w-full mx-auto">
          {hasMessages ? (
            <ChatWindow messages={messages} language={language} streamingIndex={streamingIndex} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-5 overflow-y-auto">
              {/* Powered by Gemma 4 badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800">
                <span className="text-sm">⚖️</span>
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  {language === 'Hindi' ? 'AI कानूनी सहायक' : language === 'Bengali' ? 'AI আইনি সহায়ক' : 'AI Legal Rights Assistant'}
                </span>
                <span className="text-[10px] bg-brand-200 dark:bg-brand-800 text-brand-800 dark:text-brand-200 px-1.5 py-0.5 rounded-full font-medium">Gemma 4</span>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-text dark:text-white">
                  {language === 'Hindi' ? 'अपने अधिकार जानें।' : language === 'Bengali' ? 'আপনার অধিকার জানুন।' : 'Know Your Rights.'}
                </h2>
                <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  {language === 'Hindi' ? 'अपनी आवाज़ में पूछें।' : language === 'Bengali' ? 'আপনার ভাষায় জিজ্ঞাসা করুন।' : 'Ask in Your Voice.'}
                </p>
                <p className="text-text-muted text-sm max-w-md mx-auto mt-2">
                  {language === 'Hindi' ? 'बोलें, टाइप करें, या दस्तावेज़ अपलोड करें' : language === 'Bengali' ? 'বলুন, টাইপ করুন, বা নথি আপলোড করুন' : 'Speak, type, or upload a document'}
                </p>
              </div>

              {/* Avatar + Mic button with live transcription */}
              <div className="flex flex-col items-center gap-3">
                <Avatar isSpeaking={tts.isSpeaking} size={220} />
                <VoiceButton isListening={speech.isListening} onToggle={handleMicToggle} isSupported={speech.isSupported} />
                {speech.isListening && (
                  <div className="text-center max-w-sm">
                    <p className="text-sm text-brand-600 animate-pulse mb-1">
                      {language === 'Hindi' ? '🎙️ सुन रहा हूँ...' : language === 'Bengali' ? '🎙️ শুনছি...' : '🎙️ Listening...'}
                    </p>
                    {speech.transcript && (
                      <p className="text-sm text-text dark:text-white bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl px-4 py-2 shadow-sm italic">
                        "{speech.transcript}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              <ScenarioTiles language={language} onSelect={handleSubmit} />
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-brand-100 dark:border-brand-900 bg-white dark:bg-[#0f0a1a] px-4 py-3">
            <p className="text-[10px] sm:text-xs text-text-light text-center mb-2 leading-relaxed">{DISCLAIMER[language]}</p>
            <div className="flex items-end gap-2 max-w-3xl mx-auto">
              <VoiceButton isListening={speech.isListening} onToggle={handleMicToggle} isSupported={speech.isSupported} />
              <DocumentUpload onUpload={handleDocUpload} disabled={isLoading} />

              <div className="flex-1 relative">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={PLACEHOLDER[language]} rows={1}
                  className="w-full resize-none rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950 px-4 py-3 text-sm text-text dark:text-white placeholder-text-light focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[48px]"
                  aria-label="Type your question" disabled={isLoading} />
                {/* Live transcription indicator */}
                {speech.isListening && speech.transcript && (
                  <div className="absolute -top-8 left-0 text-xs text-brand-500 animate-pulse">🎙️ transcribing...</div>
                )}
              </div>

              <button onClick={() => handleSubmit()} disabled={isLoading || !input.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-w-[48px] min-h-[48px]"
                aria-label="Send">
                {isLoading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '→'}
              </button>
            </div>
          </div>
        </main>

        <Footer />
        <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      </div>
    </>
  )
}
