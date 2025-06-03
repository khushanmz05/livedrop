'use client'

import Link from 'next/link'
import { useAuth } from '../../../lib/authContext'

export default function Navbar() {
  const { user } = useAuth()

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/about" className="mr-4">
          About
        </Link>
        <Link href="/products" className="mr-4">
          Products
        </Link>
        {user && (
          <Link href="/admin" className="mr-4 font-bold">
            Admin
          </Link>
        )}
      </div>

      <div>
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
          </>
        ) : (
          <Link href="/auth/login">Login</Link>
        )}
      </div>
    </nav>
  )
}
