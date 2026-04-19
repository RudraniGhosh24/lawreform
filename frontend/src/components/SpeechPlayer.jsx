import React from 'react'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis'

export default function SpeechPlayer({ text, language }) {
  const { speak, pause, resume, stop, isSpeaking, isPaused, rate, setRate, isSupported } =
    useSpeechSynthesis(language)

  if (!isSupported) return null

  // Convert numbers to English words so TTS doesn't read them in Hindi
  const numToWords = (n) => {
    const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen']
    const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety']
    const num = parseInt(n)
    if (isNaN(num)) return n
    if (num === 0) return 'zero'
    if (num < 20) return ones[num]
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? ' ' + ones[num%10] : '')
    if (num < 1000) return ones[Math.floor(num/100)] + ' hundred' + (num%100 ? ' and ' + numToWords(String(num%100)) : '')
    if (num < 100000) return numToWords(String(Math.floor(num/1000))) + ' thousand' + (num%1000 ? ' ' + numToWords(String(num%1000)) : '')
    if (num < 10000000) return numToWords(String(Math.floor(num/100000))) + ' lakh' + (num%100000 ? ' ' + numToWords(String(num%100000)) : '')
    return numToWords(String(Math.floor(num/10000000))) + ' crore' + (num%10000000 ? ' ' + numToWords(String(num%10000000)) : '')
  }

  const cleanText = text
    .replace(/\[([^\]]+)\]/g, '') // Remove citation brackets
    .replace(/[📜✨→•🔊⏸️⏹️▶️🗣️⚖️🤖🎙️📄📋🚨📝⚙️⏰🤪🏠ℹ️]/gu, '') // Remove emojis
    .replace(/[*#_~`|]/g, '') // Remove markdown symbols
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .replace(/₹\s?(\d[\d,]*)/g, (_, n) => 'rupees ' + numToWords(n.replace(/,/g, '')))
    .replace(/\b(\d[\d,]+)\b/g, (_, n) => numToWords(n.replace(/,/g, ''))) // Convert all numbers to English words
    .replace(/\n+/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\.\s*\./g, '.')
    .trim()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isSpeaking ? (
        <button
          onClick={() => speak(cleanText)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
          aria-label="Read aloud"
        >
          🔊 Listen
        </button>
      ) : (
        <>
          <button
            onClick={isPaused ? resume : pause}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-medium hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors min-h-[36px]"
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button
            onClick={stop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-text-muted text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[36px]"
            aria-label="Stop"
          >
            ⏹️ Stop
          </button>
        </>
      )}

      <select
        value={rate}
        onChange={(e) => setRate(parseFloat(e.target.value))}
        className="text-xs bg-transparent border border-brand-200 dark:border-brand-700 rounded-full px-2 py-1 text-text-muted min-h-[36px]"
        aria-label="Speech speed"
      >
        <option value={0.75}>0.75×</option>
        <option value={1}>1×</option>
        <option value={1.25}>1.25×</option>
        <option value={1.5}>1.5×</option>
      </select>
    </div>
  )
}
