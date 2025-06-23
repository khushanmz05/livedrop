'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { auth } from '../../../../lib/firebase'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.push('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        /* Page fade-in */
        @keyframes pageFadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        /* Card fade + slide up */
        @keyframes cardFadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Input focus glow */
        @keyframes focusGlowPulse {
          0%, 100% { box-shadow: 0 0 5px 1.5px #ec4899; }
          50% { box-shadow: 0 0 10px 3px #f472b6; }
        }

        /* Focus glow class */
        .focus-glow:focus {
          animation: focusGlowPulse 1.5s infinite;
          border-color: #ec4899;
          outline: none;
          transition: border-color 0.3s ease;
        }

        /* Button hover scale + shadow */
        .btn-hover-anim:hover {
          transform: scale(1.05);
          box-shadow: 0 0 12px 2px #f43f5e;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
      `}</style>

      <main
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-gray-900 to-black text-white p-4"
        style={{
          animation: mounted ? 'pageFadeIn 0.8s ease forwards' : undefined,
          opacity: 0,
        }}
      >
        <div
          className="bg-zinc-950 w-full max-w-md rounded-xl shadow-lg p-8 border border-zinc-800"
          style={{
            animation: mounted ? 'cardFadeSlideUp 0.7s ease forwards' : undefined,
            opacity: 0,
          }}
        >
          <h1 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-transparent bg-clip-text">
            Create Your Account
          </h1>

          {/* Email */}
          <div className="relative mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="peer w-full px-3 pt-5 pb-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-60 focus-glow"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-zinc-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative mb-6">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="peer w-full px-3 pt-5 pb-2 bg-zinc-900 border border-zinc-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-60 focus-glow"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-zinc-400 text-xs transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs"
            >
              Password
            </label>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-bold py-2 rounded-md hover:opacity-90 transition disabled:opacity-60 mb-4 btn-hover-anim"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-zinc-700" />
            <span className="mx-3 text-zinc-400 text-sm">or</span>
            <div className="flex-grow h-px bg-zinc-700" />
          </div>

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-black font-medium py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100 transition disabled:opacity-60 btn-hover-anim"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-4">{error}</p>
          )}
        </div>
      </main>
    </>
  )
}
