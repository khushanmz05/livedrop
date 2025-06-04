'use client'

import Link from 'next/link'
import Countdown from 'react-countdown'
import { useState } from 'react'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime: string | number | Date
}

type Message = {
  text: string
  user: 'user' | 'bot'
  timestamp: number
}

// Simple chat messages component
function ChatMessages() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you today?", user: 'bot', timestamp: Date.now() }
  ])

  return (
    <div className="h-48 overflow-y-auto border p-3 rounded bg-gray-50">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`mb-2 p-2 rounded ${
            msg.user === 'bot' ? 'bg-blue-100 text-blue-900 self-start' : 'bg-green-100 text-green-900 self-end'
          }`}
          style={{ maxWidth: '80%' }}
        >
          <small className="block text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </small>
          {msg.text}
        </div>
      ))}
    </div>
  )
}

// Simple chat input component
function ChatInput() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you today?", user: 'bot', timestamp: Date.now() }
  ])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      text: input,
      user: 'user',
      timestamp: Date.now()
    }

    const botMsg: Message = {
      text: "Sorry, I'm just a demo bot!",
      user: 'bot',
      timestamp: Date.now() + 500
    }

    setMessages((prev) => [...prev, userMsg, botMsg])
    setInput('')
  }

  return (
    <div className="mt-2 flex space-x-2">
      <input
        type="text"
        className="flex-1 p-2 border rounded"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
      >
        Send
      </button>
    </div>
  )
}

export default function Home() {
  const products: Product[] = [
    // example static products here (replace with your dynamic data)
    {
      id: '1',
      title: 'Cool Sneaker',
      image: '/sneaker.jpg',
      price: 99.99,
      stock: 5,
      description: 'Limited edition sneaker',
      dropTime: new Date(Date.now() + 3600 * 1000), // 1 hour from now
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to My Store!</h1>
      <h1 className="text-3xl font-bold">Upcoming Drops</h1>

      {products.map(p => (
        <div key={p.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <img src={p.image} alt={p.title} className="w-full max-w-sm my-2" />
          <p className="text-gray-600">{p.description}</p>
          <p className="font-bold mt-1">${p.price}</p>
          <p className="text-sm text-gray-500">Stock: {p.stock}</p>
          <Countdown
            date={new Date(p.dropTime)}
            renderer={({ hours, minutes, seconds, completed }) =>
              completed ? (
                <>
                  <span className="text-green-600 font-bold">Now Live!</span>
                  <Link href={`/payment/${p.id}`}>
                    <button
                      disabled={p.stock <= 0}
                      className={`mt-2 p-2 rounded ${
                        p.stock <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {p.stock <= 0 ? 'Sold Out' : 'Buy Now'}
                    </button>
                  </Link>
                </>
              ) : (
                <span className="text-blue-600">
                  Drop in {hours}h {minutes}m {seconds}s
                </span>
              )
            }
          />
        </div>
      ))}

      {/* Chat Section */}
      <div className="mt-12 border-t pt-6">
        <h2 className="text-2xl font-bold mb-4">Chat with us</h2>
        <ChatMessages />
        <ChatInput />
      </div>
    </div>
  )
}
