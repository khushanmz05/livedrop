'use client'

import { useState } from 'react'

type Message = {
  id: string
  text: string
  user: 'user' | 'bot'
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hi! How can I help you today?', user: 'bot' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim()) return
  
    const userMessage: Message = {
      id: String(messages.length + 1),
      text: input,
      user: 'user',
    }
  
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
  
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: userMessage.text }
          ],
        }),
      })
  
      const data = await res.json()
  
      const botMessage: Message = {
        id: String(messages.length + 2),
        text: data.response.content,
        user: 'bot',
      }
  
      setMessages(prev => [...prev, botMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        { id: String(messages.length + 2), text: 'Failed to fetch reply.', user: 'bot' },
      ])
    } finally {
      setLoading(false)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage()
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <div className="h-64 overflow-y-auto mb-4 flex flex-col space-y-2 bg-gray-50 p-2 rounded">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`p-2 rounded ${
              msg.user === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-300 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        className="w-full p-2 border rounded"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        disabled={loading}
      />

      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? 'Waiting...' : 'Send'}
      </button>
    </div>
  )
}
