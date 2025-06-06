'use client'
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

type Message = {
  id: string
  text: string
  sender?: string
  timestamp?: any
}

type ChatMessagesProps = {
  messages: Message[]
}

export default function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="space-y-2 text-sm">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`p-2 rounded-md max-w-xs ${
            msg.user === 'bot'
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


