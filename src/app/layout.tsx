// app/layout.tsx
import './globals.css'
import { AuthProvider } from '../../lib/authContext'
import { CartProvider } from '../../lib/cartContext'
import Navbar from './components/Navbar'
import '../../styles/global.css'

export const metadata = {
  title: 'My Store',
  description: 'Next.js Firebase Store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col items-center justify-start bg-gray-50">
        <AuthProvider>
          <CartProvider>
            <div className="w-full max-w-6xl px-4">
              <Navbar />
              <main className="p-4">{children}</main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

