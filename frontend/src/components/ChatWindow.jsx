import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import Avatar from './Avatar'

export default function ChatWindow({ messages, language, streamingIndex, isSpeaking }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
    return () => clearTimeout(timer)
  }, [messages, messages[messages.length - 1]?.content])

  if (messages.length === 0) return null

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3" role="log" aria-label="Conversation">
      {messages.map((msg, i) => {
        const isAI = msg.role === 'assistant'
        const isCurrentlyStreaming = i === streamingIndex
        const isLastAI = isAI && i === messages.length - 1
        return (
          <div key={i}>
            {isAI && (
              <div className="flex items-center gap-2 mb-2 ml-1">
                <Avatar isSpeaking={isCurrentlyStreaming || (isLastAI && isSpeaking)} size={56} />
                <span className="text-xs text-text-muted font-medium">Lawreformer AI</span>
              </div>
            )}
            <MessageBubble message={msg} language={language} isStreaming={isCurrentlyStreaming} />
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
