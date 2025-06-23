'use client'

import React, { useEffect, useRef, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import ChatInput from './components/ChatInput'
import ChatMessages from './components/ChatMessages'
import DropCountdown from './components/DropCountdown'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import { useCart } from '../../lib/cartContext'
import '../../styles/global.css'
import { useRouter } from 'next/navigation'
import PurchaseFeed from './components/PurchaseFeed'
import { Unbounded } from 'next/font/google'
import Image from 'next/image'
import { Message } from './types'
import { useAuth } from '../../lib/authContext'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime?: Date
}

const unbounded = Unbounded({ subsets: ['latin'], weight: ['400', '700', '900'] })

export default function Home() {
  const router = useRouter()
  const { user } = useAuth() // <-- top level hook
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshPurchases, setRefreshPurchases] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Hi! How can I help you today?',
      user: 'bot',
      timestamp: new Date(),
    },
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
    if (!user) {
      alert('Please log in to add items to your cart.')
      router.push('/auth/login')
      return
    }
    addToCart(product)
    alert(`Added "${product.title}" to cart.`)
  }

  const handleBuyNow = (product: Product) => {
    if (!user) {
      alert('Please log in to purchase items.')
      router.push('/auth/login')
      return
    }
    router.push(`/payment/${product.id}`)
    setRefreshPurchases(prev => !prev)
  }

  const handleNewMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const userMsg: Message = {
      id: String(Date.now()),
      text: trimmed,
      user: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])

    setTimeout(() => {
      const lower = trimmed.toLowerCase()
      let reply =
        "🤔 I'm not sure how to respond to that — but we're here to help!"

      if (lower.includes('hello') || lower.includes('hi')) {
        reply = '👋 Hey there! Welcome to LiveDrop. What can I do for you today?'
      } else if (lower.includes('price') || lower.includes('cost')) {
        reply =
          '🛍️ Our products start from just $9.99. Let me know if you want more details!'
      } else if (lower.includes('help') || lower.includes('support')) {
        reply =
          '🧑‍💻 Sure! You can ask me about product details, stock, or how to buy.'
      } else if (lower.includes('buy')) {
        reply =
          '🛒 Just click the "Buy Now" button on the product to begin checkout!'
      } else if (lower.includes('cart')) {
        reply = `🧺 You currently have ${cart.length} item(s) in your cart.`
      } else if (lower.includes('drop') || lower.includes('launch')) {
        reply =
          '⏱️ Our next product drop is counting down above. Stay tuned!'
      }

      setMessages(prev => [
        ...prev,
        {
          id: String(Date.now() + 1),
          text: reply,
          user: 'bot',
          timestamp: new Date(),
        },
      ])
    }, 600)
  }

  // Stable refs per product for CSSTransition
  const productRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement | null> }>({})

  const getRefForProduct = (id: string) => {
    if (!productRefs.current[id]) {
      productRefs.current[id] = React.createRef<HTMLDivElement>()
    }
    return productRefs.current[id]
  }

  const filteredProducts = products.filter(
    product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <main
      className={`${unbounded.className} animate-fadeInUp px-4 py-6 max-w-7xl mx-auto`}
    >
      <header className="text-center py-10 px-4 border-b border-pink-600 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
        <h1 className="text-6xl sm:text-7xl font-black tracking-wide bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] animate-slideDown uppercase leading-tight">
          🌟 LiveDrop Market
        </h1>
        <p className="mt-4 text-gray-300 text-xl font-light animate-fadeIn delay-200 max-w-xl mx-auto">
          Discover the latest drops, exclusive deals & vibrant gear made for
          creators like you.
        </p>
      </header>

      <div className="mt-6 mb-4 max-w-md mx-auto">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          aria-label="Search products"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mt-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No matching products found.
          </p>
        ) : (
          <TransitionGroup component={null}>
            {filteredProducts.map(product => {
              const nodeRef = getRefForProduct(product.id)
              const now = new Date()
              const isLive = !product.dropTime || product.dropTime <= now
              const hasValidDropTime =
                product.dropTime instanceof Date &&
                !isNaN(product.dropTime.getTime()) &&
                product.dropTime > now

              return (
                <CSSTransition
                  key={product.id}
                  timeout={300}
                  classNames="fade-slide"
                  nodeRef={nodeRef}
                >
                  <div className="relative group" ref={nodeRef}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-700 blur-sm opacity-0 group-hover:opacity-40 transition duration-300" />
                    <div className="relative z-10 bg-white/5 backdrop-blur border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col">
                      <Image
                        src={product.image.trim()}
                        alt={product.title}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover rounded-t-xl"
                        unoptimized
                      />
                      <div className="p-4 flex flex-col flex-grow text-white">
                        <h2 className="text-2xl font-bold mb-2">
                          {product.title}
                        </h2>

                        {hasValidDropTime && (
                          <div className="mb-2">
                            <DropCountdown dropTime={product.dropTime} />
                          </div>
                        )}

                        <p className="text-gray-300 flex-grow">
                          {product.description}
                        </p>

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
                            {product.stock > 0
                              ? `In Stock: ${product.stock}`
                              : 'Sold Out'}
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
                  </div>
                </CSSTransition>
              )
            })}
          </TransitionGroup>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-10">
        <div className="flex-1 max-w-md">
          <PurchaseFeed refreshTrigger={refreshPurchases} />
        </div>

        <div className="w-full md:w-[28rem] ml-auto flex flex-col">
          <div className="h-[21rem] bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 rounded-lg border border-purple-700 shadow-lg flex flex-col">
            <ChatMessages messages={messages} />
            <ChatInput
              onSend={handleNewMessage}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
