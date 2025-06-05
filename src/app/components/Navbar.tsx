'use client'

import Link from 'next/link'
import { useAuth } from '../../../lib/authContext'
import { useCart } from '../../../lib/cartContext'
import { User } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const { cart } = useCart()
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-8">
        {/* Logo / Site Name */}
        <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
          LiveDrop
        </Link>

        {/* Navigation Links */}
        <div className="hidden sm:flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <Link href="/about" className="hover:text-yellow-400 transition-colors">About</Link>
          <Link href="/products" className="hover:text-yellow-400 transition-colors">Products</Link>
          {user && (
            <Link href="/admin" className="hover:text-yellow-400 transition-colors font-bold">
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Right: Auth + Cart */}
      <div className="flex items-center space-x-6 text-sm">
        {/* Auth Status */}
        {user ? (
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-white" />
            <span className="text-gray-300 truncate max-w-[100px]">{user.email}</span>
          </div>
        ) : (
          <Link href="/auth/login" className="hover:text-green-400 transition-colors">
            Login
          </Link>
        )}

        {/* Cart */}
        <Link href="/cart" className="relative group">
          <span className="text-2xl group-hover:text-yellow-400 transition-colors cursor-pointer">
            🛒
          </span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
