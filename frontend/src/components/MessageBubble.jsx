import React from 'react'
import SpeechPlayer from './SpeechPlayer'

/**
 * Extract law citations like [Some Act, Year] from text
 */
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

/**
 * Extract next steps from the AI response
 */
function extractNextSteps(text) {
  const steps = []
  // Match lines that look like action items
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
            ? 'bg-saffron-500 text-white rounded-br-md'
            : 'bg-white dark:bg-gray-800 text-charcoal dark:text-offwhite border border-gray-200 dark:border-gray-700 rounded-bl-md'
        }`}
      >
        {/* Message content with citation badges */}
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}>
          {parts.map((part, i) =>
            part.type === 'citation' ? (
              <span
                key={i}
                className="inline-block bg-saffron-100 dark:bg-saffron-900/30 text-saffron-700 dark:text-saffron-300 text-xs font-medium px-2 py-0.5 rounded-full mx-1"
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
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 space-y-2">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Next Steps
            </p>
            {nextSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-700 dark:text-gray-300"
              >
                <span className="text-saffron-500 mt-0.5">→</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* TTS player for AI messages */}
        {!isUser && !isStreaming && message.content && (
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <SpeechPlayer text={message.content} language={language} />
          </div>
        )}
      </div>
    </div>
  )
}
