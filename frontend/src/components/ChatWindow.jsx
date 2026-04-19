import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import Avatar from './Avatar'

export default function ChatWindow({ messages, language, streamingIndex, isSpeaking }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 100)
    return () => clearTimeout(timer)
  }, [messages, messages.length, messages[messages.length - 1]?.content])

  if (messages.length === 0) return null

  return (
    <div className="flex-1 flex flex-row overflow-hidden">
      {/* Left 25% — avatar, sticky, always visible */}
      <div className="w-[70px] sm:w-[25%] max-w-[160px] flex-shrink-0 flex flex-col items-center pt-4 px-1 sm:px-3 border-r border-brand-100 dark:border-brand-900 bg-brand-50/30 dark:bg-brand-950/30">
        <div className="sticky top-4">
          <Avatar isSpeaking={isSpeaking} size={typeof window !== 'undefined' && window.innerWidth < 640 ? 56 : 120} />
        </div>
      </div>

      {/* Right 75% — scrollable messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3" role="log" aria-label="Conversation">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            language={language}
            isStreaming={i === streamingIndex}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
