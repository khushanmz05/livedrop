'use client'
import { useState } from "react"
import { db } from "../../../lib/firebase" 
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { Message } from "../types"

interface Props {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  onSend?: (text: string) => void
}

export default function ChatInput({ onSend }: Props) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className="flex space-x-2">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        className="flex-grow rounded border px-3 py-2 text-black"
        placeholder="Type your message..."
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            handleSend()
          }
        }}
      />
      <button
        onClick={handleSend}
        className="bg-pink-400 px-4 py-2 rounded text-white"
      >
        Send
      </button>
    </div>
  )
}