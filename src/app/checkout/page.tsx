'use client'

import { useCart } from '../../../lib/cartContext'
import { useRouter } from 'next/navigation'
import { db } from '../../../lib/firebase'
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import { useState } from 'react'

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const router = useRouter()

  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !cardNumber) {
      setError('Please fill all fields')
      return
    }

    try {
      await Promise.all(
        cart.map((item) =>
          runTransaction(db, async (transaction) => {
            const productRef = doc(db, 'products', item.id)
            const productDoc = await transaction.get(productRef)

            if (!productDoc.exists()) throw new Error(`Product ${item.title} not found`)

            const currentStock = productDoc.data()?.stock
            if (currentStock < item.quantity) {
              throw new Error(`Not enough stock for ${item.title}`)
            }

            transaction.update(productRef, {
              stock: currentStock - (item.quantity || 1),
            })
          })
        )
      )

      clearCart()
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to complete purchase')
    }
  }

  if (success)
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">Purchase Successful!</h2>
        <p>Thank you for your purchase!</p>
        <button
          className="mt-4 p-2 bg-blue-600 text-white rounded"
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
    )

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {cart.map((item) => (
        <div key={item.id} className="mb-4 border-b pb-2">
          <p className="font-semibold">{item.title}</p>
          <p>Qty: {item.quantity || 1} × ${item.price.toFixed(2)}</p>
        </div>
      ))}

      <p className="font-bold text-lg mb-4">Total: ${total.toFixed(2)}</p>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Name on Card</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full border rounded p-2"
            maxLength={16}
            pattern="\d{16}"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Pay ${total.toFixed(2)}
        </button>
      </form>
    </div>
  )
}
