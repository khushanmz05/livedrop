// components/CartSummary.tsx
'use client'

import { useCart } from '../../../lib/cartContext'

export default function CartSummary() {
  const { cart } = useCart()

  if (cart.length === 0) return <p>Your cart is empty.</p>

  return (
    <div className="fixed top-4 right-4 bg-gray-800 p-4 rounded shadow-lg text-white max-w-xs z-50">
      <h3 className="font-bold mb-2">Your Cart</h3>
      <ul>
        {cart.map(item => (
          <li key={item.id} className="flex justify-between mb-1">
            <span>{item.title}</span>
            <span>Qty: {item.quantity}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
