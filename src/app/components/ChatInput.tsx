'use client'
import { useState } from "react"
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
    onSend?.(input.trim())
    setInput('')
  }

  return (
  <div className="flex items-center space-x-2 w-full">
    <input
      type="text"
      value={input}
      onChange={e => setInput(e.target.value)}
      className="flex-1 rounded border px-3 py-2 text-white border-gray-300"
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
      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
    >
      Send
    </button>
  </div>
)
}