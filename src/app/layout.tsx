// app/layout.tsx
import './globals.css'
import { AuthProvider } from '../../lib/authContext' 
import Navbar from './components/Navbar'

export const metadata = {
  title: 'My Store',
  description: 'Next.js Firebase Store',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
