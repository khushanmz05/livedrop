'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import Countdown from 'react-countdown'
import Link from 'next/link'
import { useCart } from '../../../lib/cartContext'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(fetchedProducts)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600"></div>
      </div>
    )
  }
  if (products.length === 0) {
    return <p>No products found.</p>
  }
  return (
    <div className="max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mt-10 mb-4 text-center">Low Stock Drops</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <p className="text-gray-600 text-sm mb-1 line-clamp-2">{p.description}</p>
            <p className="font-bold text-red-600">${p.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Stock: {p.stock}</p>

            <div className="mt-3">
            <Countdown
  date={new Date(p.dropTime)}
  renderer={({ hours, minutes, seconds, completed }) =>
    completed ? (
      <div className="animate-pulse">
        <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full mb-2">
          🔥 LIVE NOW
        </span>
        <Link href={`/payment/${p.id}`}>
          <button
            disabled={p.stock <= 0}
            className={`mt-2 w-full p-2 rounded font-semibold transition ${
              p.stock <= 0
                ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {p.stock <= 0 ? 'Sold Out' : 'Buy Now'}
          </button>
        </Link>
      </div>
    ) : (
      <span className="text-blue-600 text-sm">
        Drop in {hours}h {minutes}m {seconds}s
      </span>
    )
  }

              />  
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
