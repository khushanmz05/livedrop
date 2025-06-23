'use client'

import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Mount flag to trigger animations
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

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
    <>
      <style>{`
        /* Fade in entire page */
        @keyframes pageFadeIn {
          0% { opacity: 0 }
          100% { opacity: 1 }
        }

        /* Form fade + slide up */
        @keyframes fadeSlideUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Header gradient slide animation */
        @keyframes gradient-slide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Input focus glow */
        .focus-glow:focus {
          box-shadow: 0 0 8px 2px #ec4899;
          border-color: #ec4899;
          outline: none;
          transition: box-shadow 0.3s ease;
        }

        /* Button hover scale + glow */
        .btn-animated:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px 3px #db2777;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>

      <div
        className="min-h-screen bg-black text-white flex flex-col justify-between"
        style={{
          animation: mounted ? 'pageFadeIn 0.6s ease forwards' : undefined,
          opacity: 0,
        }}
      >
        {/* Header */}
        <header className="text-center py-6 border-b border-pink-600">
          <h1
            className="text-5xl font-extrabold text-transparent bg-clip-text drop-shadow"
            style={{
              backgroundImage:
                'linear-gradient(270deg, #fbbf24, #ec4899, #8b5cf6, #fbbf24)',
              backgroundSize: '600% 600%',
              animation: 'gradient-slide 8s ease infinite',
            }}
          >
            🔐 Login to LiveDrop
          </h1>
          <p className="mt-2 text-gray-300 text-lg font-medium">
            Welcome back! Access your exclusive drops
          </p>
        </header>

        {/* Login Form */}
        <main
          className="flex-grow flex flex-col items-center justify-center px-4"
          style={{
            animation: mounted ? 'fadeSlideUp 0.8s ease forwards' : undefined,
            opacity: 0,
          }}
        >
          <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg border border-purple-700 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-center text-pink-400">
              Login
            </h2>
            <input
              className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded focus-glow"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-3 mb-4 bg-gray-800 text-white border border-gray-600 rounded focus-glow"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="w-full bg-pink-600 hover:bg-pink-700 transition-colors text-white font-semibold py-3 rounded btn-animated"
              onClick={handleLogin}
            >
              Log In
            </button>

            {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

            {/* Register link */}
            <p className="mt-6 text-center text-gray-400">
             Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                className="text-pink-500 hover:underline font-semibold"
              >
                Register here
              </button>
            </p>
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
    </>
  )
}
