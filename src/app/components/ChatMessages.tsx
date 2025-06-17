'use client'

import React from 'react'

type Message = {
  id: string
  text: string
  sender?: string
  timestamp?: Date
}

interface ChatMessagesProps {
  messages: Message[]
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <div className="space-y-2 text-sm">
      {messages.map(msg => (
        <div
          key={msg.id}
          className={`p-2 rounded-md max-w-xs ${
            msg.sender === 'bot'
              ? 'bg-purple-700/30 text-purple-100 self-start'
              : 'bg-pink-600/30 text-pink-100 self-end ml-auto'
          }`}
        >
          {msg.text}
        </div>
      ))}
    </div>
  )
}
