'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User 
} from 'firebase/auth'
import { auth, provider } from './firebase'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Replace with your actual admin email
const ADMIN_EMAIL = 'khushan.kanakrai5@gmail.com'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    return onAuthStateChanged(auth, currentUser => {
      setUser(currentUser)
      setIsAdmin(currentUser?.email === ADMIN_EMAIL)
    })
  }, [])

  const login = () => signInWithPopup(auth, provider).then(() => {})
  const logout = () => signOut(auth).then(() => {})

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
