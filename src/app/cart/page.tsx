'use client'

import { useCart } from '../../../lib/cartContext'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
  const { cart, removeFromCart } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  const router = useRouter()

  const handleCheckout = () => {
    if (cart.length === 0) return
    const allProductIDs = cart.map(item => item.id).join(',')
    router.push(`/checkout?ids=${allProductIDs}`)
  }  

  return (
    <>
      <main className="max-w-4xl mx-auto p-6 min-h-[80vh] flex flex-col">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-white-900">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center grow text-center text-gray-500 space-y-4">
            <p className="text-lg md:text-xl font-medium">Your cart is empty.</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-2 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition"
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded shadow"
                    />
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                    <p className="text-gray-700">${item.price.toFixed(2)}</p>
                    {item.quantity && (
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:underline text-sm font-medium"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-6 border-t mt-auto text-right">
              <p className="text-2xl font-bold mb-3 text-gray-900">
                Total: <span className="text-blue-700">${total.toFixed(2)}</span>
              </p>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded shadow transition font-semibold"
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
