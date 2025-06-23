'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../lib/authContext'
import { useCart } from '../../../lib/cartContext'
import { User } from 'lucide-react'
import { auth } from '../../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { user } = useAuth()
  const { cart } = useCart()
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0)
  const router = useRouter()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await auth.signOut()
    router.push('/auth/login')
  }

  const ADMIN_EMAIL = 'admin@example.com'
  const isAdmin = user?.email === ADMIN_EMAIL

  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-zinc-800">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center space-x-10">
        <Link
          href="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text tracking-tight"
        >
          LiveDrop
        </Link>

        <div className="hidden sm:flex space-x-6 text-sm font-medium">
          {[
            ['Home', '/'],
            ['About', '/about'],
            ['Products', '/products'],
          ].map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="relative group hover:text-yellow-400 transition duration-200"
            >
              {label}
              <span className="block absolute bottom-[-3px] left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="text-pink-400 font-semibold hover:underline underline-offset-4"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {/* Right: Auth + Cart */}
      <div className="flex items-center space-x-6 text-sm relative">
        {user ? (
          <div
            className="flex items-center space-x-2 cursor-pointer relative hover:opacity-80 transition"
            ref={dropdownRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User className="w-5 h-5 text-white opacity-75" />
            <span className="text-gray-300 truncate max-w-[140px]">
              {user.email}
            </span>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-700 rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-pink-600 text-white"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-green-400 hover:text-white transition-colors font-semibold"
          >
            Login
          </Link>
        )}

        <Link href="/cart" className="relative group">
          <span className="text-2xl group-hover:text-yellow-400 transition">
            🛒
          </span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] font-bold rounded-full px-1.5 py-0.5 animate-pulse shadow-md">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
