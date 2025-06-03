'use client'

import { signOut } from 'firebase/auth'
import { auth } from '../../../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')  // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-800 text-white px-4 py-2 rounded"
    >
      Logout
    </button>
  )
}
