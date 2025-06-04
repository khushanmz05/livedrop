'use client'

import { db } from '../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Countdown from 'react-countdown'

// Define Product type
type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime: string | number | Date
}

// Chat types
type Message = {
  text: string
  user: 'user' | 'bot'
  timestamp: number
}

// ChatMessages component
function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="h-48 overflow-y-auto border p-3 rounded bg-gray-50">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`mb-2 p-2 rounded ${
            msg.user === 'bot' ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'
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

// ChatInput component
function ChatInput({
  messages,
  setMessages
}: {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
}) {
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      text: input,
      user: 'user',
      timestamp: Date.now()
    }

    const lower = input.toLowerCase()
    let botResponse = "Sorry, I didn't understand that."

    if (lower.includes('price')) {
      botResponse = 'All prices are listed next to the products.'
    } else if (lower.includes('stock') || lower.includes('available')) {
      botResponse = 'You can see stock info below each item image.'
    } else if (lower.includes('buy')) {
      botResponse = 'Click the "Buy Now" button after the product goes live!'
    } else if (lower.includes('hello') || lower.includes('hi')) {
      botResponse = 'Hello! How can I assist you today?'
    }
    const botMsg: Message = {
      text: botResponse,
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
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! How can I help you today?", user: 'bot', timestamp: Date.now() }
  ])

  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, 'products'))
      const data = snapshot.docs.map(doc => {
        const raw = doc.data()
        return {
          id: doc.id,
          ...raw,
          dropTime: raw.dropTime?.toDate ? raw.dropTime.toDate() : new Date(raw.dropTime)
        } as Product
      })
  
      const lowStock = data.sort((a, b) => a.stock - b.stock).slice(0, 6)
      setProducts(lowStock)
    }
    fetchProducts()
  }, [])

  const [search, setSearch] = useState('')

// Filtered products based on search
const filteredProducts = products
  .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome to My Store!</h1>
      <h1 className="text-3xl font-bold">Low Stock Drops</h1>
      <div className="mb-4">
  <input
    type="text"
    className="p-2 border rounded w-full"
    placeholder="Search products..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
</div>
      {filteredProducts.map(p => (
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
        <ChatMessages messages={messages} />
        <ChatInput messages={messages} setMessages={setMessages} />
      </div>
    </div>
  )
}
