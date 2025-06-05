'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth'
import { auth, provider } from './firebase'

interface AuthContextType {
  user: User | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const login = () => signInWithPopup(auth, provider)
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
