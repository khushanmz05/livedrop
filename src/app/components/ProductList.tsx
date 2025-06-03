'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(fetchedProducts)
    })

    return () => unsubscribe()
  }, [])

  if (products.length === 0) {
    return <p>No products found.</p>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover my-2"
          />
          <p className="font-medium text-gray-700">${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-500">
            {product.stock > 0 ? `Stock: ${product.stock}` : 'Sold Out'}
          </p>
          <p className="mt-2">{product.description}</p>
        </div>
      ))}
    </div>
  )
}
