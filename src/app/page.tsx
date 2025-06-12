'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import ChatInput from './components/ChatInput'
import ChatMessages from './components/ChatMessages'
import DropCountdown from './components/DropCountdown'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useCart } from '../../lib/cartContext'
import '../../styles/global.css'
import { useRouter } from 'next/navigation'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime?: Date
}

type Message = {
  id?: string
  text: string
  user: string
  timestamp: number
}

export default function Home() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<Message[]>([
  
    { text: 'Hi! How can I help you today?', user: 'bot', timestamp: Date.now() },
  ])
  const { cart, addToCart } = useCart()

  useEffect(() => {
    async function fetchProducts() {
      const snapshot = await getDocs(collection(db, 'products'))
      const data = snapshot.docs.map(doc => {
        const raw = doc.data()
        const dropTime =
          raw.dropTime && typeof raw.dropTime.toDate === 'function'
            ? raw.dropTime.toDate()
            : raw.dropTime
            ? new Date(raw.dropTime)
            : undefined
        return {
          id: doc.id,
          ...raw,
          dropTime,
        } as Product
      })
      const lowStock = data.sort((a, b) => a.stock - b.stock).slice(0, 6)
      setProducts(lowStock)
    }
    fetchProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    alert(`Added "${product.title}" to cart.`)
  }

  const handleBuyNow = (product: Product) => {
    alert(`Buying "${product.title}" for $${product.price.toFixed(2)}!`)
    router.push(`/payment/${product.id}`)  // works now
  }

  const handleNewMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: String(messages.length + 1),
      text: trimmed,
      user: 'user',
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])

    setTimeout(() => {
      const lower = trimmed.toLowerCase()
      let reply = "🤔 I'm not sure how to respond to that — but we're here to help!"

      if (lower.includes('hello') || lower.includes('hi')) {
        reply = '👋 Hey there! Welcome to LiveDrop. What can I do for you today?'
      } else if (lower.includes('price') || lower.includes('cost')) {
        reply = '🛍️ Our products start from just $9.99. Let me know if you want more details!'
      } else if (lower.includes('help') || lower.includes('support')) {
        reply = '🧑‍💻 Sure! You can ask me about product details, stock, or how to buy.'
      } else if (lower.includes('buy')) {
        reply = '🛒 Just click the "Buy Now" button on the product to begin checkout!'
      } else if (lower.includes('cart')) {
        reply = `🧺 You currently have ${cart.length} item(s) in your cart.`
      } else if (lower.includes('drop') || lower.includes('launch')) {
        reply = '⏱️ Our next product drop is counting down above. Stay tuned!'
      }

      const botMsg: Message = {
        id: String(messages.length + 2),
        text: reply,
        user: 'bot',
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, botMsg])
    }, 600)
  }

  // ✅ JSX return block starts here
  return (
    <>
      <header className="text-center py-6 border-b border-pink-600">
        <h1 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow">
          🌟 LiveDrop Market
        </h1>
        <p className="mt-2 text-gray-300 text-lg font-medium">
          Discover the latest drops & exclusive offers
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        {products.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No products found.</p>
        ) : (
          <TransitionGroup component={null}>
            {products.map(product => {
              const isLive = !product.dropTime || product.dropTime <= new Date()
              const hasValidDropTime =
                product.dropTime instanceof Date &&
                !isNaN(product.dropTime.getTime()) &&
                product.dropTime > new Date()

              return (
                <CSSTransition key={product.id} timeout={300} classNames="fade-slide">
                  <div className="border border-gray-700 rounded-lg shadow bg-gray-800 hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-300 ease-in-out transform flex flex-col">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="p-4 flex flex-col flex-grow text-white">
                      <h2 className="text-2xl font-bold mb-2 text-white">{product.title}</h2>

                      {hasValidDropTime && (
                        <div className="mb-2">
                          <DropCountdown dropTime={product.dropTime} />
                        </div>
                      )}

                      <p className="text-gray-300 flex-grow">{product.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-lg text-green-400">
                          ${product.price.toFixed(2)}
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            product.stock > 0
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-300 text-red-800'
                          }`}
                        >
                          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Sold Out'}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          disabled={product.stock === 0 || !isLive}
                          onClick={() => handleAddToCart(product)}
                          className="flex-grow bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Add to Cart
                        </button>
                        <button
                          disabled={product.stock === 0 || !isLive}
                          onClick={() => handleBuyNow(product)}
                          className="flex-grow bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        )}
      </div>

      {/* Chat Section */}
      <div className="max-w-md mx-auto bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 rounded-lg border border-purple-700 shadow-lg mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 text-pink-400 tracking-wide">
          💬 Live Chat Support
        </h2>

        <div className="max-h-56 overflow-y-auto bg-black/30 rounded-md p-3 border border-gray-700 space-y-2">
          <ChatMessages messages={messages} />
        </div>

        <div className="mt-3">
          <ChatInput onSend={handleNewMessage} />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 border-t border-pink-600 pt-4 mt-10">
        <p>
          Made with <span className="text-red-400">♥</span> by LiveDrop Team ·{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">
            All rights reserved
          </span>
        </p>
      </footer>
    </>
  )
}
