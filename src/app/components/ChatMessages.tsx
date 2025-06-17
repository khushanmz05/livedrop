'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import type { Timestamp } from 'firebase/firestore'

type Message = {
  id: string
  text: string
  sender?: string
  timestamp?: Date
}

export default function ChatMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Reference to your messages collection
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          // Convert Firestore Timestamp to JS Date
          timestamp: (data.timestamp as Timestamp)?.toDate() ?? undefined,
        }
      })
      setMessages(msgs)
    })

    return () => unsubscribe()
  }, [])

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
