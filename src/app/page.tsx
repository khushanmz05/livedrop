'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import ChatInput from './components/ChatInput'
import ChatMessages from './components/ChatMessages'
import DropCountdown from './components/DropCountdown'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useCart } from '../../lib/cartContext'
import '../../styles/global.css'  // Make sure your styles import is here

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
  const [products, setProducts] = useState<Product[]>([])
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hi! How can I help you today?', user: 'bot', timestamp: Date.now() },
  ])
  const [search, setSearch] = useState('')

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
    
    // Implement checkout flow here
  }

  const handleNewMessage = async (text: string) => {
    const userMsg: Message = {
      id: String(messages.length + 1),
      text,
      user: 'user',
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])
  
    // Basic keyword-based replies
    let reply = "I'm not sure how to respond to that yet.";
  
    if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
      reply = 'Hello! 👋 How can I assist you today?'
    } else if (text.toLowerCase().includes('price')) {
      reply = 'Our products start at just $9.99!'
    } else if (text.toLowerCase().includes('help')) {
      reply = 'Sure! You can browse products above and add them to your cart. Let me know if you have questions about any item.'
    } else if (text.toLowerCase().includes('buy')) {
      reply = 'Click the "Buy Now" button on a product to start the checkout process!'
    } else if (text.toLowerCase().includes('cart')) {
      reply = `You have ${cart.length} item(s) in your cart.`
    }
  
    const botMsg: Message = {
      id: String(messages.length + 2),
      text: reply,
      user: 'bot',
      timestamp: Date.now(),
    }
  
    setMessages(prev => [...prev, botMsg])
  }
  

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-6xl mx-auto p-6 bg-white/5 backdrop-blur-md rounded-lg shadow-lg space-y-12">
  
        {/* Colorful Header */}
        <header className="text-center py-6 border-b border-pink-600">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow">
            🌟 LiveDrop Market
          </h1>
          <p className="mt-2 text-gray-300 text-lg font-medium">
            Discover the latest drops & exclusive offers
          </p>
        </header>
  
        {/* Products grid */}
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
                        <h2 className="text-2xl font-bold mb-2 text-white">
                          {product.title}
                        </h2>
  
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
        <div className="max-w-md mx-auto bg-gray-900 p-4 rounded-lg border border-purple-700">
          <h2 className="text-xl font-semibold mb-2 text-pink-400">Chat with us</h2>
          <div className="max-h-48 overflow-y-auto border border-gray-700 rounded-md p-2">
            <ChatMessages messages={messages} />
          </div>
          <ChatInput onSend={handleNewMessage} />
        </div>
  
        {/* Colorful Footer */}
        <footer className="text-center text-sm text-gray-400 border-t border-pink-600 pt-4">
          <p>
            Made with <span className="text-red-400">♥</span> by LiveDrop Team ·{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">
              All rights reserved
            </span>
          </p>
        </footer>
      </div>
    </div>
  )
}
