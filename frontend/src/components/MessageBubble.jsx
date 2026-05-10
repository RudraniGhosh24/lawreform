import React from 'react'
import SpeechPlayer from './SpeechPlayer'

function parseCitations(text) {
  const parts = []
  // Match any [Something Something] that looks like a law citation
  const regex = /\[([^\]]{5,})\]/g
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
  const lines = text.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // Match numbered steps, bullet points, or arrow items that contain actionable info
    if (/^(\d+[\.\)]\s*|[-•→✅]\s*)/.test(trimmed) &&
        /(gov\.in|DLSA|helpline|form|contact|visit|call|file|register|apply|complaint|dial|website|portal|online)/i.test(trimmed)) {
      const clean = trimmed.replace(/^(\d+[\.\)]\s*|[-•→✅]\s*)/, '').trim()
      if (clean.length > 10 && clean.length < 300 && !steps.includes(clean)) {
        steps.push(clean)
      }
    }
  }
  return steps.slice(0, 3)
}

function renderMarkdown(text) {
  // Render **bold** and *italic* as React elements
  const parts = []
  // First pass: replace **bold** with <strong>
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
  let key = 0

  for (const seg of segments) {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      parts.push(<strong key={key++} className="font-semibold">{seg.slice(2, -2)}</strong>)
    } else if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
      parts.push(<em key={key++}>{seg.slice(1, -1)}</em>)
    } else {
      parts.push(seg)
    }
  }

  return parts
}

export default function MessageBubble({ message, language, isStreaming }) {
  const isUser = message.role === 'user'
  const parts = isUser ? [{ type: 'text', content: message.content }] : parseCitations(message.content)
  const nextSteps = isUser ? [] : extractNextSteps(message.content)
  const hasCitations = parts.some(p => p.type === 'citation')

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
        isUser
          ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-br-md'
          : 'bg-white dark:bg-brand-950 text-text dark:text-brand-100 border border-brand-100 dark:border-brand-800 rounded-bl-md'
      }`}>
        <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isStreaming ? 'streaming-cursor' : ''}`}>
          {parts.map((part, i) =>
            part.type === 'citation' ? (
              <span key={i} className="inline-flex items-center gap-1 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold px-2.5 py-1 rounded-full mx-1 my-0.5">
                <span>📜</span> {part.content}
              </span>
            ) : (
              <span key={i}>{renderMarkdown(part.content)}</span>
            )
          )}
        </div>

        {/* Retrieved Sources (RAG) */}
        {!isUser && !isStreaming && message.sources && message.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brand-100 dark:border-brand-800 space-y-2">
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wide">📚 Retrieved from Legal Database</p>
            {message.sources.map((src, i) => (
              <div key={i} className="p-2 rounded-lg bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-800">
                <p className="text-[10px] font-semibold text-brand-600 dark:text-brand-400">{src.source} — {src.section}</p>
                <p className="text-[10px] text-text-muted italic mt-0.5">"{src.text}"</p>
              </div>
            ))}
          </div>
        )}

        {/* Next steps */}
        {!isUser && !isStreaming && nextSteps.length > 0 && (
          <div className="mt-3 pt-3 border-t border-brand-100 dark:border-brand-800 space-y-2">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">Next Steps</p>
            {nextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs text-text dark:text-brand-200">
                <span className="text-brand-500 mt-0.5">→</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Powered by Gemma 4 badge + TTS */}
        {!isUser && !isStreaming && message.content && (
          <div className="mt-2 pt-2 border-t border-brand-50 dark:border-brand-900 flex items-center justify-between flex-wrap gap-2">
            <SpeechPlayer text={message.content} language={language} />
            <span className="inline-flex items-center gap-1 text-[10px] text-text-light bg-gray-100 dark:bg-brand-900/30 px-2 py-1 rounded-full">
              ✨ AI-Powered
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
