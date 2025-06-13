  'use client'

  import { useEffect, useState } from 'react'
  import { collection, getDocs, addDoc } from 'firebase/firestore'
  import { db } from '../../lib/firebase'
  import ChatInput from './components/ChatInput'
  import ChatMessages from './components/ChatMessages'
  import DropCountdown from './components/DropCountdown'
  import { TransitionGroup, CSSTransition } from 'react-transition-group'
  import { useCart } from '../../lib/cartContext'
  import '../../styles/global.css'
  import { useRouter } from 'next/navigation'
  import PurchaseFeed from "./components/PurchaseFeed";
  import { getAuth } from 'firebase/auth'
  import { FaGoogle, FaApple, FaMicrosoft } from 'react-icons/fa'
  import { Unbounded } from 'next/font/google'
import { set } from 'date-fns'




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

const unbounded = Unbounded({ subsets: ['latin'], weight: ['400', '700', '900'] })
  export default function Home() {
    const router = useRouter()
    const [products, setProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [refreshPurchases, setRefreshPurchases] = useState(false)
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
    //alert(`Buying "${product.title}" for $${product.price.toFixed(2)}!`)
    router.push(`/payment/${product.id}`)
    setRefreshPurchases(prev => !prev) // Trigger purchase feed refresh
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

    const filteredProducts = products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

return (
  <main className={`${unbounded.className} animate-fadeInUp px-4 py-6 max-w-7xl mx-auto`}>
    <header className="text-center py-10 px-4 border-b border-pink-600 bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
      <h1 className="text-6xl sm:text-7xl font-black tracking-wide bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] animate-slideDown uppercase leading-tight">
        🌟 LiveDrop Market
      </h1>
      <p className="mt-4 text-gray-300 text-xl font-light animate-fadeIn delay-200 max-w-xl mx-auto">
        Discover the latest drops, exclusive deals & vibrant gear made for creators like you.
      </p>
    </header>



        <div className="mt-6 mb-4 max-w-md mx-auto">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-400 text-lg">No matching products found.</p>
          ) : (
            <TransitionGroup component={null}>
              {filteredProducts.map(product => {
                const isLive = !product.dropTime || product.dropTime <= new Date()
                const hasValidDropTime =
                  product.dropTime instanceof Date &&
                  !isNaN(product.dropTime.getTime()) &&
                  product.dropTime > new Date()

                return (
                  <CSSTransition key={product.id} timeout={300} classNames="fade-slide">
    <div className="relative group">
      {/* Glowing background hover effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-700 blur-sm opacity-0 group-hover:opacity-40 transition duration-300" />

      {/* Actual product card with glass look */}
      <div className="relative z-10 bg-white/5 backdrop-blur border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        <div className="p-4 flex flex-col flex-grow text-white">
          <h2 className="text-2xl font-bold mb-2">{product.title}</h2>

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
    </div>
  </CSSTransition>

                )
              })}
            </TransitionGroup>
          )}
        </div>

       <div className="flex flex-col md:flex-row gap-6 mt-10">
  <div className="flex-1 max-w-md">
    <PurchaseFeed refreshTrigger={refreshPurchases}/>
  </div>

  <div className="w-full md:w-[28rem] ml-auto flex flex-col">
  <div className="h-[20rem] bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 rounded-lg border border-purple-700 shadow-lg flex-grow flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold mb-3 text-pink-400 tracking-wide">
        💬 Live Chat Support
      </h2>

      <div className="max-h-56 overflow-y-auto bg-black/30 rounded-md p-3 border border-gray-700 space-y-2">
        <ChatMessages messages={messages} />
      </div>

      <div className="mt-3">
        <ChatInput onSend={handleNewMessage} />
      </div>

      {/* Icon Row */}
      <div className="mt-4 flex justify-center space-x-5 py-2 border-t border-gray-700 pt-4">
        <FaGoogle size={26} className="text-gray-400 hover:text-white transition cursor-pointer" />
        <FaApple size={26} className="text-gray-400 hover:text-white transition cursor-pointer" />
        <FaMicrosoft size={26} className="text-gray-400 hover:text-white transition cursor-pointer" />
      </div>
    </div>
  </div>
</div>

        <footer className="text-center text-sm text-gray-400 border-t border-pink-600 pt-4 mt-10">
          <p>
            LiveDrop Team ·{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">
              All rights reserved
            </span>
          </p>
        </footer>
      </main>
    )
  }
