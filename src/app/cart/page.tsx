'use client'

import { useCart } from '../../../lib/cartContext'
import Link from 'next/link'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { cart, removeFromCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

  return (
    <>
      <main className="max-w-4xl mx-auto p-6 min-h-[80vh]">
        <h1 className="text-4xl font-bold mb-8 text-center">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <p className="text-lg">Your cart is empty.</p>
            <Link href="/products">
              <span className="text-blue-600 hover:underline mt-2 inline-block">Browse Products</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {/* Image */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                  )}

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    {item.quantity && (
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Total & Checkout */}
            <div className="pt-6 border-t mt-8 text-right">
              <p className="text-xl font-bold mb-2">
                Total: <span className="text-blue-700">${total.toFixed(2)}</span>
              </p>
              <Link href="/checkout">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
