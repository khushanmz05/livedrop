// components/ProductCard.tsx
import Link from 'next/link'
import { useCart } from '../../../lib/cartContext'

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

  return (
    <div
      key={product.id}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* ... JSX from polished card ... */}
    </div>
  )
}
