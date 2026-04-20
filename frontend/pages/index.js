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
  English: 'Legal information only, not legal advice. For serious matters, contact your DLSA — free legal aid is your right.',
  Hindi: 'केवल कानूनी जानकारी, सलाह नहीं। गंभीर मामलों के लिए DLSA से संपर्क करें।',
  Bengali: 'শুধু আইনি তথ্য, পরামর্শ নয়। গুরুতর বিষয়ে DLSA-তে যোগাযোগ করুন।',
  Tamil: 'சட்டத் தகவல் மட்டுமே, சட்ட ஆலோசனை அல்ல। தீவிர விஷயங்களுக்கு DLSA-ஐ தொடர்பு கொள்ளுங்கள்.',
  Telugu: 'చట్టపరమైన సమాచారం మాత్రమే, చట్టపరమైన సలహా కాదు. తీవ్రమైన విషయాలకు DLSA సంప్రదించండి.',
  Marathi: 'केवळ कायदेशीर माहिती, सल्ला नाही. गंभीर प्रकरणांसाठी DLSA शी संपर्क साधा.',
  Kannada: 'ಕಾನೂನು ಮಾಹಿತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆ ಅಲ್ಲ. ಗಂಭೀರ ವಿಷಯಗಳಿಗೆ DLSA ಸಂಪರ್ಕಿಸಿ.',
  Gujarati: 'માત્ર કાનૂની માહિતી, સલાહ નહીં. ગંભીર બાબતો માટે DLSA નો સંપર્ક કરો.',
}

const PLACEHOLDER = {
  English: 'Type your legal question here...',
  Hindi: 'अपना कानूनी सवाल यहाँ लिखें...',
  Bengali: 'আপনার আইনি প্রশ্ন এখানে লিখুন...',
  Tamil: 'உங்கள் சட்ட கேள்வியை இங்கே தட்டச்சு செய்யுங்கள்...',
  Telugu: 'మీ చట్టపరమైన ప్రశ్నను ఇక్కడ టైప్ చేయండి...',
  Marathi: 'तुमचा कायदेशीर प्रश्न येथे टाइप करा...',
  Kannada: 'ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...',
  Gujarati: 'તમારો કાનૂની પ્રશ્ન અહીં ટાઇપ કરો...',
}

export default function Home() {
  const [language, setLanguage] = useState('English')
  const [darkMode, setDarkMode] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingIndex, setStreamingIndex] = useState(-1)

  const speech = useSpeechRecognition(language, (text) => {
    // Auto-submit when user stops speaking
    if (text && !isLoading) {
      sendToAPI(text, null)
    }
  })
  const tts = useSpeechSynthesis(language)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth < 640)
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (speech.transcript) setInput(speech.transcript)
  }, [speech.transcript])

  const sendToAPI = useCallback(async (question, imageData) => {
    if ((!question && !imageData) || isLoading) return

    speech.stopListening()
    speech.resetTranscript()
    setInput('')

    const userContent = imageData ? '📄 ' + (question || 'Uploaded a document for analysis') : question
    setMessages(prev => [...prev, { role: 'user', content: userContent }, { role: 'assistant', content: '' }])
    setIsLoading(true)
    const aiIndex = messages.length + 1
    setStreamingIndex(aiIndex)

    try {
      const body = { question, language }
      if (imageData) body.image = imageData
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
      let fullResponse = '', buffer = ''

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
                // Typewriter effect — reveal characters gradually
                const text = fullResponse
                let charIndex = 0
                const typewrite = () => {
                  if (charIndex <= text.length) {
                    setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: text.slice(0, charIndex) }; return u })
                    charIndex += Math.floor(Math.random() * 3) + 2 // 2-4 chars at a time
                    setTimeout(typewrite, 35)
                  }
                }
                typewrite()
              }
            } catch {}
          }
        }
      }

      // Auto-play TTS
      if (fullResponse && tts.isSupported) {
        try {
          const clean = fullResponse
            .replace(/\[([^\]]+)\]/g, '')
            .replace(/[*#_~`|→•]/g, '')
            .replace(/https?:\/\/\S+/g, '')
            .replace(/\n+/g, '. ')
            .replace(/\s{2,}/g, ' ')
            .trim()
          if (clean) tts.speak(clean)
        } catch (e) { console.error('TTS clean error:', e) }
      }
    } catch {
      setMessages(prev => { const u = [...prev]; u[u.length - 1] = { role: 'assistant', content: '⚠️ Sorry, could not connect. Please try again.' }; return u })
    } finally {
      setIsLoading(false)
      setStreamingIndex(-1)
    }
  }, [input, isLoading, language, messages.length, speech, tts])

  const handleSubmit = useCallback((q) => { sendToAPI(q || input.trim(), null) }, [input, sendToAPI])
  const handleDocUpload = useCallback((img) => { sendToAPI(input.trim() || 'Analyze this document and explain my legal rights.', img) }, [input, sendToAPI])
  const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }
  const handleMicToggle = () => { speech.isListening ? speech.stopListening() : (speech.resetTranscript(), speech.startListening()) }

  const hasMessages = messages.length > 0

  return (
    <>
      <Head><title>LawReformer AI — Know Your Rights</title></Head>
      <div className="flex flex-col h-screen bg-surface dark:bg-[#0f0a1a]">
        <Header language={language} setLanguage={setLanguage} onAboutClick={() => setAboutOpen(true)} darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 flex flex-col overflow-hidden max-w-5xl w-full mx-auto">
          {hasMessages ? (
            /* ===== CHAT VIEW — avatar scrolls with messages ===== */
            <ChatWindow messages={messages} language={language} streamingIndex={streamingIndex} isSpeaking={tts.isSpeaking} />
          ) : (
            /* ===== HOME VIEW — compact, content-first ===== */
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 gap-3 sm:gap-4 overflow-y-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800">
                <span className="text-xs">⚖️</span>
                <span className="text-xs font-medium text-brand-700 dark:text-brand-300">
                  {{ English: 'AI Legal Rights Assistant', Hindi: 'AI कानूनी सहायक', Bengali: 'AI আইনি সহায়ক', Tamil: 'AI சட்ட உதவியாளர்', Telugu: 'AI చట్ట సహాయకుడు', Marathi: 'AI कायदेशीर सहाय्यक', Kannada: 'AI ಕಾನೂನು ಸಹಾಯಕ', Gujarati: 'AI કાનૂની સહાયક' }[language] || 'AI Legal Rights Assistant'}
                </span>
                <span className="text-[9px] bg-brand-200 dark:bg-brand-800 text-brand-800 dark:text-brand-200 px-1.5 py-0.5 rounded-full font-medium">Gemma 4</span>
              </div>

              {/* Heading */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text dark:text-white">
                  {{ English: 'Know Your Rights.', Hindi: 'अपने अधिकार जानें।', Bengali: 'আপনার অধিকার জানুন।', Tamil: 'உங்கள் உரிமைகளை அறியுங்கள்.', Telugu: 'మీ హక్కులు తెలుసుకోండి.', Marathi: 'तुमचे हक्क जाणा.', Kannada: 'ನಿಮ್ಮ ಹಕ್ಕುಗಳನ್ನು ತಿಳಿಯಿರಿ.', Gujarati: 'તમારા અધિકારો જાણો.' }[language] || 'Know Your Rights.'}
                </h2>
                <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
                  {{ English: 'Ask in Your Voice.', Hindi: 'अपनी आवाज़ में पूछें।', Bengali: 'আপনার ভাষায় জিজ্ঞাসা করুন।', Tamil: 'உங்கள் குரலில் கேளுங்கள்.', Telugu: 'మీ గొంతులో అడగండి.', Marathi: 'तुमच्या आवाजात विचारा.', Kannada: 'ನಿಮ್ಮ ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ.', Gujarati: 'તમારા અવાજમાં પૂછો.' }[language] || 'Ask in Your Voice.'}
                </p>
              </div>

              {/* Avatar small on home + mic */}
              <div className="flex items-center gap-4">
                <Avatar isSpeaking={tts.isSpeaking} size={80} />
                <div className="flex flex-col items-center gap-2">
                  <VoiceButton isListening={speech.isListening} onToggle={handleMicToggle} isSupported={speech.isSupported} />
                  {speech.isListening && (
                    <p className="text-xs text-brand-600 animate-pulse">
                      {{ English: '🎙️ Listening...', Hindi: '🎙️ सुन रहा हूँ...', Bengali: '🎙️ শুনছি...', Tamil: '🎙️ கேட்கிறேன்...', Telugu: '🎙️ వింటున్నాను...', Marathi: '🎙️ ऐकत आहे...', Kannada: '🎙️ ಕೇಳುತ್ತಿದ್ದೇನೆ...', Gujarati: '🎙️ સાંભળી રહ્યું છે...' }[language] || '🎙️ Listening...'}
                    </p>
                  )}
                </div>
              </div>

              {/* Live transcription */}
              {speech.isListening && speech.transcript && (
                <p className="text-sm text-text dark:text-white bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 rounded-xl px-4 py-2 shadow-sm italic max-w-sm text-center">
                  &ldquo;{speech.transcript}&rdquo;
                </p>
              )}

              {/* Scenario tiles */}
              <ScenarioTiles language={language} onSelect={handleSubmit} />
            </div>
          )}

          {/* Input bar */}
          <div className="border-t border-brand-100 dark:border-brand-900 bg-white dark:bg-[#0f0a1a] px-3 sm:px-4 py-2">
            <p className="text-[9px] sm:text-[10px] text-text-light text-center mb-1.5">{DISCLAIMER[language]}</p>
            <div className="flex items-end gap-1.5 sm:gap-2 max-w-3xl mx-auto">
              <VoiceButton isListening={speech.isListening} onToggle={handleMicToggle} isSupported={speech.isSupported} />
              <DocumentUpload onUpload={handleDocUpload} disabled={isLoading} />
              <div className="flex-1 relative">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  placeholder={PLACEHOLDER[language]} rows={1}
                  className="w-full resize-none rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950 px-3 py-2.5 text-sm text-text dark:text-white placeholder-text-light focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                  aria-label="Type your question" disabled={isLoading} />
              </div>
              <button onClick={() => handleSubmit()} disabled={isLoading || !input.trim()}
                className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 text-white font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] min-h-[44px]"
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
