'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password)
    router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
    }
    setError('Invalid email or password. Please try again.')
  }
}


  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between">
      
      {/* Header */}
      <header className="text-center py-6 border-b border-pink-600">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text drop-shadow">
          🔐 Login to LiveDrop
        </h1>
        <p className="mt-2 text-gray-300 text-lg font-medium">
          Welcome back! Access your exclusive drops
        </p>
      </header>

      {/* Login Form */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-purple-700 shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center text-pink-400">Login</h2>
          <input
            className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-pink-600 hover:bg-pink-700 transition-colors text-white font-semibold py-3 rounded"
            onClick={handleLogin}
          >
            Log In
          </button>
          {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 border-t border-pink-600 py-4">
        <p>
          Made with <span className="text-red-400">♥</span> by LiveDrop Team ·{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">
            All rights reserved
          </span>
        </p>
      </footer>
    </div>
  )
}
