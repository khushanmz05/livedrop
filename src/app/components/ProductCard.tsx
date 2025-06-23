'use client'

import { useState } from 'react'
import { useCart } from '../../../lib/cartContext'
import { useAuth } from '../../../lib/authContext'
import { useRouter } from 'next/navigation'
import Modal from '../components/Modal'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)

  const handleAddToCart = () => {
    if (!user) {
      setModalOpen(true)
      return
    }
    addToCart(product)
    alert(`Added "${product.title}" to cart.`)
  }

  const handleConfirmLogin = () => {
    setModalOpen(false)
    router.push('/auth/login')
  }

  return (
    <div
      key={product.id}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Your product display JSX */}

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmLogin}
      />
    </div>
  )
}
