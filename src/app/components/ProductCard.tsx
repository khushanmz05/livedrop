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
      className="...polished card styles here..."
    >
      {/* ... JSX from polished card ... */}
    </div>
  )
}
