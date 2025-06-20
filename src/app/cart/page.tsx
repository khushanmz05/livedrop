'use client'

import { useCart } from '../../../lib/cartContext'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { getAuth } from 'firebase/auth'


export default function CartPage() {
  const { cart, removeFromCart, decreaseStockOnCheckout } = useCart() // moved inside here
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const router = useRouter()

  const handleCheckout = async () => {
  if (cart.length === 0) return

  const auth = getAuth()
  const user = auth.currentUser
  const username = user ? user.displayName || user.email || 'Guest' : ''

  try {
    // Submit purchase to Firestore
    await addDoc(collection(db, 'purchases'), {
      user: username,
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total,
      timestamp: serverTimestamp(),
    })

    decreaseStockOnCheckout(cart)

    const productIds = cart.map(item => item.id).join(',')
    router.push(`/payment?productIds=${productIds}`)
  } catch (error) {
    console.error('Checkout failed:', error)
    // Optionally show error to user
  }
}

  const [showPopup, setShowPopup] = useState(false)
  const [latestItem, setLatestItem] = useState<{ id: string; title: string; image?: string; price: number; quantity?: number } | null>(null)

  useEffect(() => {
    if (cart.length > 0) {
      const latest = cart[cart.length - 1]
      setLatestItem(latest)
      setShowPopup(true)

      const timer = setTimeout(() => setShowPopup(false), 4000)
      return () => clearTimeout(timer)
    }
  }, [cart])

  return (
    <>
      {/* Popup Notification */}
      <AnimatePresence>
        {showPopup && latestItem && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-6 right-6 z-50 bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-2xl shadow-xl flex items-center gap-4"
          >
            {latestItem.image && (
              <img
                src={latestItem.image}
                alt={latestItem.title}
                className="w-14 h-14 object-cover rounded-lg border border-gray-300 shadow"
              />
            )}
            <div>
              <p className="text-white font-semibold text-sm mb-1">Added to cart</p>
              <p className="text-white text-sm">{latestItem.title}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Cart Section */}
      <main className="max-w-5xl mx-auto px-6 py-10 min-h-[80vh] flex flex-col font-sans">
        <h1 className="text-5xl font-extrabold mb-12 text-center text-white tracking-tight">
          🛒 Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center grow text-center text-gray-400 space-y-6">
            <p className="text-xl md:text-2xl font-medium">Your cart is feeling lonely 😢</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition duration-300"
              aria-label="Browse Products"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6 flex flex-col grow">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="flex items-center gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-xl shadow-md border border-gray-300"
                    />
                  )}

                  <div className="flex-1 space-y-1">
                    <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                    <p className="text-white/80 text-md">${item.price.toFixed(2)}</p>
                    {item.quantity && (
                      <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 hover:underline text-sm font-medium transition"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-8 border-t border-white/20 mt-auto text-right">
              <p className="text-3xl font-bold mb-5 text-white">
                Total: <span className="text-blue-400">${total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300"
                aria-label="Proceed to Checkout"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
