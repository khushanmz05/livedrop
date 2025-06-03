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
  dropTime?: any // you can replace `any` with a more precise type if you want
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])  // <-- typed initial state

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]  // type assertion because doc.data() returns any

      setProducts(updatedProducts)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Products</h1>
      {products.length === 0 && <p>No products found.</p>}
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded shadow-sm">
          <h2 className="text-xl font-semibold">{product.title}</h2>
          <img src={product.image} alt={product.title} className="w-full max-h-48 object-cover my-2"/>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Stock: {product.stock > 0 ? product.stock : 'Sold Out'}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  )
}
