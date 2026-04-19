import React from 'react'
import SpeechPlayer from './SpeechPlayer'

function parseCitations(text) {
  const parts = []
  const regex = /\[([^\]]+(?:Act|Code|Scheme|MGNREGA|RTI)[^\]]*)\]/gi
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) })
    }
    parts.push({ type: 'citation', content: match[1] })
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) })
  }

  return parts.length > 0 ? parts : [{ type: 'text', content: text }]
}

function extractNextSteps(text) {
  const steps = []
  const patterns = [
    /(?:^|\n)\s*[-•→]\s*(.+(?:gov\.in|DLSA|helpline|form|contact|visit|call|file|register).+)/gi,
    /(?:^|\n)\s*\d+\.\s*(.+(?:gov\.in|DLSA|helpline|form|contact|visit|call|file|register).+)/gi,
  ]

  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(text)) !== null) {
      const step = match[1].trim()
      if (step.length > 10 && step.length < 200 && !steps.includes(step)) {
        steps.push(step)
      }
    }
  }

  return steps.slice(0, 3)
}

export default function MessageBubble({ message, language, isStreaming }) {
  const isUser = message.role === 'user'
  const parts = isUser ? [{ type: 'text', content: message.content }] : parseCitations(message.content)
  const nextSteps = isUser ? [] : extractNextSteps(message.content)

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-brand-gradient text-white rounded-br-md'
            : 'bg-white dark:bg-brand-950 text-text dark:text-brand-100 border border-brand-100 dark:border-brand-800 rounded-bl-md'
        }`}
      >
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}>
          {parts.map((part, i) =>
            part.type === 'citation' ? (
              <span
                key={i}
                className="inline-block bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-medium px-2 py-0.5 rounded-full mx-1"
              >
                📜 {part.content}
              </span>
            ) : (
              <span key={i}>{part.content}</span>
            )
          )}
        </div>

        {/* Next steps cards */}
        {!isUser && !isStreaming && nextSteps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brand-100 dark:border-brand-800 space-y-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
              Next Steps
            </p>
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs text-text dark:text-brand-200"
              >
                <span className="text-brand-500 mt-0.5">→</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* TTS player for AI messages */}
        {!isUser && !isStreaming && message.content && (
          <div className="mt-2 pt-2 border-t border-brand-50 dark:border-brand-900">
            <SpeechPlayer text={message.content} language={language} />
          </div>
        )}
      </div>
    </div>
  )
}
