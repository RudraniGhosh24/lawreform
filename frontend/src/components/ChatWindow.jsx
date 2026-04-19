import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import Avatar from './Avatar'

export default function ChatWindow({ messages, language, streamingIndex, isSpeaking }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    // Small delay to ensure avatar + message are rendered before scrolling
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timer)
  }, [messages, messages[messages.length - 1]?.content])

  if (messages.length === 0) return null

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-1" role="log" aria-label="Conversation">
      {messages.map((msg, i) => {
        const isAI = msg.role === 'assistant'
        const isCurrentlyStreaming = i === streamingIndex
        return (
          <div key={i}>
            {/* Show avatar before AI messages */}
            {isAI && (
              <div className="flex items-center gap-2 mb-1 ml-1">
                <Avatar isSpeaking={isCurrentlyStreaming || (i === messages.length - 1 && isSpeaking)} size={40} />
                <span className="text-[10px] text-text-muted">Lawreformer AI</span>
              </div>
            )}
            <MessageBubble
              message={msg}
              language={language}
              isStreaming={isCurrentlyStreaming}
            />
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
