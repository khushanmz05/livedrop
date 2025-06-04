'use client'
import { useEffect, useState } from "react"
import { db } from "../../../lib/firebase"
import { collection, onSnapshot, orderBy, query } from "firebase/firestore"

type Message = {
  text: string
  user: string
  timestamp?: any
}

export default function ChatMessages() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => doc.data() as Message))
    })

    return () => unsub()
  }, [])

  return (
    <div className="p-4 space-y-2 h-[300px] overflow-y-auto">
      {messages.map((msg, i) => (
        <div key={i} className={`p-2 rounded ${msg.user === "user" ? "bg-blue-100" : "bg-gray-200"}`}>
          <strong>{msg.user}:</strong> {msg.text}
        </div>
      ))}
    </div>
  )
}
