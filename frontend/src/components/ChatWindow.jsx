import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, language, streamingIndex }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, messages[messages.length - 1]?.content])

  if (messages.length === 0) return null

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" role="log" aria-label="Conversation">
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
  )
}
