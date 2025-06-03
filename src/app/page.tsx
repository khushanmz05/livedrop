'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import Countdown from 'react-countdown' 

type Product = {
  id: string
  title: string
  image: string
  dropTime: Date
  price: number
  stock: number
  description: string
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('dropTime', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => {
        const d = doc.data()
        return {
          id: doc.id,
          title: d.title,
          image: d.image,
          dropTime: d.dropTime.toDate(),
          price: d.price,
          stock: d.stock,
          description: d.description,
        }
      })
      setProducts(data)
    })

    return () => unsub()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Upcoming Drops</h1>
      {products.map(p => (
        <div key={p.id} className="p-4 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold">{p.title}</h2>
          <img src={p.image} alt={p.title} className="w-full max-w-sm my-2" />
          <p className="text-gray-600">{p.description}</p>
          <p className="font-bold mt-1">${p.price}</p>
          <p className="text-sm text-gray-500">Stock: {p.stock}</p>
          <Countdown
            date={p.dropTime}
            renderer={({ hours, minutes, seconds, completed }) =>
              completed ? (
                <>
                  <span className="text-green-600 font-bold">Now Live!</span>
                  <Link href={`/payment/${p.id}`}>
                    <button
                      disabled={p.stock <= 0}
                      className={`mt-2 p-2 rounded ${
                        p.stock <= 0
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {p.stock <= 0 ? 'Sold Out' : 'Buy Now'}
                    </button>
                  </Link>
                </>
              ) : (
                <span className="text-blue-600">
                  Drop in {hours}h {minutes}m {seconds}s
                </span>
              )
            }
          />
        </div>
      ))}
    </div>
  )
}
