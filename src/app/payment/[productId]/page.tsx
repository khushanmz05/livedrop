'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../../../../lib/firebase'
import { doc, getDoc, runTransaction, collection, addDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
}

type Props = {
  params: Promise<{ productId: string }>
}

export default function CheckoutPage({ params }: Props) {
  const resolvedParams = use(params)
  const productId = resolvedParams.productId
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  useEffect(() => {
    if (!productId) {
      setError('No product selected')
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        const ref = doc(db, 'products', productId)
        const snap = await getDoc(ref)

        if (!snap.exists()) {
          throw new Error('Product not found')
        }

        const data = snap.data()
        setProduct({
          id: productId,
          title: data.title,
          image: data.image,
          price: data.price,
          stock: data.stock,
        })
      } catch (err: any) {
        setError(err.message || 'Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !cardNumber.trim() || !expiry.trim() || !cvv.trim()) {
      setError('Please fill in all fields.')
      return
    }

    if (!product) {
      setError('Product not loaded.')
      return
    }

    try {
      await runTransaction(db, async (transaction) => {
        const ref = doc(db, 'products', product.id)
        const snap = await transaction.get(ref)

        if (!snap.exists()) throw new Error(`${product.title} not found`)
        const stock = snap.data().stock

        if (stock <= 0) throw new Error(`${product.title} is out of stock`)

        transaction.update(ref, { stock: stock - 1 })
      })

      const auth = getAuth()
      const currentUser = auth.currentUser
      const username = currentUser
        ? currentUser.displayName || currentUser.email || 'Anonymous'
        : 'Guest'

      await addDoc(collection(db, 'purchases'), {
        productId: product.id,
        title: product.title,
        price: product.price,
        user: username,
        timestamp: new Date(),
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Transaction failed.')
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    )

  if (success)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50">
        <h2 className="text-3xl font-bold mb-6 text-green-700">✅ Purchase Successful!</h2>
        <p className="text-xl font-medium mb-8">{product?.title}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-semibold transition"
        >
          Back to Home
        </button>
      </div>
    )

  return (
    <main className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Checkout</h1>

      <div className="mb-8 flex flex-col items-center space-y-3">
        {product?.image && (
          <img
            src={product.image}
            alt={product.title}
            className="w-48 h-48 object-contain rounded-md shadow-sm"
          />
        )}
        <p className="text-2xl font-semibold text-gray-900">{product?.title}</p>
        <p className="text-xl font-medium text-gray-700">${product?.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          {product?.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" aria-label="Checkout Form" noValidate>
        <div>
          <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
            Name on Card
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="John Doe"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="card" className="block mb-2 font-semibold text-gray-700">
            Card Number
          </label>
          <input
            id="card"
            type="text"
            inputMode="numeric"
            pattern="\d{16}"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength={16}
            placeholder="1234 5678 9012 3456"
            required
            aria-required="true"
          />
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="expiry" className="block mb-2 font-semibold text-gray-700">
              Expiry Date
            </label>
            <input
              id="expiry"
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="cvv" className="block mb-2 font-semibold text-gray-700">
              CVV
            </label>
            <input
              id="cvv"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              placeholder="123"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              aria-required="true"
            />
          </div>
        </div>

        {/* Fake payment method icons */}
        <div className="mt-6 flex justify-center space-x-6">
          <div className="flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-700"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10 0-5.523-4.478-10-10-10zM8 17l-2-7h2l1 4 2-4h2l-3 7H8z" />
            </svg>
            <span className="text-xs font-semibold text-gray-600">PayPal</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path
                fill="#fff"
                d="M9 8h6v2H9zm0 4h6v2H9z"
              />
            </svg>
            <span className="text-xs font-semibold text-gray-600">Klarna</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-pink-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" ry="2" />
              <circle cx="7" cy="12" r="2" fill="#fff" />
            </svg>
            <span className="text-xs font-semibold text-gray-600">Apple Pay</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-yellow-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 7h16v2H4zM4 11h16v2H4zM4 15h16v2H4z" />
            </svg>
            <span className="text-xs font-semibold text-gray-600">Google Pay</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={product?.stock === 0}
          className={`w-full py-3 rounded-md text-white font-semibold transition
            ${product?.stock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'}
          `}
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Pay Now'}
        </button>
      </form>
    </main>
  )
}
