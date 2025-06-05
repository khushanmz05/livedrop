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
    <div>
      {messages.map((msg, index) => (
        <div
          key={msg.id ?? `${msg.timestamp}-${index}`}
          className="mb-2 text-white"
        >
          <strong>{msg.user ?? 'Anonymous'}:</strong> {msg.text}
        </div>
      ))}
    </div>
  )
}

