'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { db } from '../../../../lib/firebase'
import { doc, getDoc, runTransaction, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import Image from 'next/image'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
}

export default function CheckoutPage() {  
  const router = useRouter()
  const params = useParams()
  const productId = Array.isArray(params?.productId) ? params.productId[0] : params?.productId || ''

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardType, setCardType] = useState<'Visa' | 'MasterCard' | 'AmEx' | 'Discover' | 'Unknown'>('Unknown')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
  const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
  setCardNumber(raw);
  setCardType(getCardType(raw));
};

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
     } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const normalizedImage = product && product.image
  ? product.image.replace(/^(\.\.\/)+/, '') // remove any ../ at start
  : '';

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
      timestamp: serverTimestamp(),
    })
    

    setSuccess(true)
  } catch (err: unknown) {
    if (err instanceof Error) {
      setError(err.message)
    } else {
      setError('Transaction failed.')
    }
  }
}

function handleExpiryChange(e: React.ChangeEvent<HTMLInputElement>) {
  let value = e.target.value;

  value = value.replace(/[^\d\/]/g, '');
  if (value.length === 2 && !value.includes('/')) {
    value = value + '/';
  }
  if (value.length > 5) {
    value = value.slice(0, 5);
  }
  const [month] = value.split('/');
  if (month) {
    const monthNum = parseInt(month, 10);
    if (monthNum < 1 || monthNum > 12) {
      return;
    }
  }
  setExpiry(value);
  }

function getCardType(cardNumber: string): 'Visa' | 'MasterCard' | 'AmEx' | 'Discover' | 'Unknown' {
  const cleaned = cardNumber.replace(/\D/g, '')

  if (/^4/.test(cleaned)) return 'Visa'
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard'
  if (/^3[47]/.test(cleaned)) return 'AmEx'
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover'

  return 'Unknown'
}

    
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 animate-fadeIn">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 animate-fadeIn">
        <p className="text-red-600 text-lg font-semibold">{error}</p>
      </div>
    )
  }

 if (success) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-green-50 animate-fadeIn">
      <h2 className="text-3xl font-bold text-green-700 mb-4 animate-slideDown">
        ✅ Purchase Successful!
      </h2>
      <p className="text-xl text-gray-800 mb-6 animate-slideUp">
        {product?.title}
      </p>
      <button
        onClick={() => router.push('/')}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-transform duration-200 hover:scale-105 animate-button"
      >
        Back to Home
      </button>
    </div>
  );
}

  return (
    <main className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeInUp">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 animate-slideDown">Checkout</h1>

      <div className="mb-8 flex flex-col items-center space-y-3 animate-fadeIn">
        
        {product?.image && (
          <Image
            src={`/${normalizedImage.trim()}`}
            alt={product.title}
            width={160}
            height={160}
            className="object-contai  n rounded shadow animate-fadeIn"
        />
        )}
        <p className="text-xl font-semibold text-gray-900">{product?.title}</p>
        <p className="text-lg font-medium text-indigo-700">${product?.price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          {typeof product?.stock === 'number' && product.stock > 0
            ? `${product.stock} in stock`
            : 'Out of stock'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeInUp">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Name on Card
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-4 py-2 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300 ease-in-out hover:shadow-lg"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="card"
              type="text"
              inputMode="numeric"
              value={cardNumber}
              onChange={handleCardInput}
              className="w-full border rounded px-4 py-2 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300 ease-in-out hover:shadow-lg"
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              required
            />
            {cardType !== 'Unknown' && (
              <img
                src={
                  cardType === 'Visa' ? 'https://img.icons8.com/color/48/visa.png' :
                  cardType === 'MasterCard' ? 'https://img.icons8.com/color/48/mastercard-logo.png' :
                  cardType === 'AmEx' ? 'https://img.icons8.com/color/48/amex.png' :
                  cardType === 'Discover' ? 'https://img.icons8.com/color/48/discover.png' :
                  ''
                }
                alt={cardType}
                className="h-6"
              />
            )}
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiry" className="block font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full border rounded px-4 py-2 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300 ease-in-out hover:shadow-lg"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="cvv" className="block font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                id="cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                maxLength={4}
                placeholder="123"
                className="w-full border rounded px-4 py-2 text-black focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300 ease-in-out hover:shadow-lg"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold text-lg transition transform hover:scale-105"
        >
          Pay ${product?.price.toFixed(2)}
        </button>
      </form>
    </main>
  )
}