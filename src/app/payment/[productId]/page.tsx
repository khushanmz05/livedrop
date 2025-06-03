'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { db } from '../../../../lib/firebase'
import { doc, getDoc, runTransaction } from 'firebase/firestore'

type Product = {
  id: string
  title: string
  image: string
  dropTime: Date
  price: number
  stock: number
  description: string
}

export default function PaymentPage() {
  const router = useRouter()
  const pathname = usePathname()
  const productId = pathname.split('/').pop() || ''

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fake payment form state
  const [name, setName] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', productId)
        const docSnap = await getDoc(docRef)
        if (!docSnap.exists()) {
          setError('Product not found')
          setLoading(false)
          return
        }
        const data = docSnap.data()
        setProduct({
          id: docSnap.id,
          title: data.title,
          image: data.image,
          dropTime: data.dropTime.toDate(),
          price: data.price,
          stock: data.stock,
          description: data.description,
        })
      } catch (e) {
        setError('Failed to fetch product')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name || !cardNumber) {
      setError('Please fill in all payment fields')
      return
    }

    try {
      await runTransaction(db, async (transaction) => {
        const productRef = doc(db, 'products', productId)
        const productDoc = await transaction.get(productRef)
        if (!productDoc.exists()) throw new Error('Product does not exist')

        const currentStock = productDoc.data()?.stock
        if (currentStock <= 0) {
          throw new Error('Out of stock!')
        }

        // Here you would normally process payment via a payment API
        // For demo, we just simulate success and decrement stock

        transaction.update(productRef, { stock: currentStock - 1 })
      })

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to complete purchase')
    }
  }

  if (loading) return <p className="p-6">Loading product...</p>
  if (error) return <p className="p-6 text-red-600">{error}</p>
  if (success)
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Purchase Successful!</h2>
        <p>Thank you for purchasing <strong>{product?.title}</strong>.</p>
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
      <h1 className="text-2xl font-bold mb-4">Payment for {product?.title}</h1>
      <img src={product?.image} alt={product?.title} className="w-full mb-4" />
      <p className="mb-2">{product?.description}</p>
      <p className="font-bold mb-4">${product?.price}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">
            Name on Card
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={e => setCardNumber(e.target.value)}
            className="w-full border rounded p-2"
            required
            maxLength={16}
            pattern="\d{16}"
            title="Enter 16-digit card number"
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Pay ${product?.price}
        </button>
      </form>
    </div>
  )
}
