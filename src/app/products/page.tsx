'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import Link from 'next/link'
import { useCart } from '../../../lib/cartContext'
import DropCountdown from '../components/DropCountdown'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime?: Timestamp | string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(updatedProducts)
    })

    return () => unsubscribe()
  }, [])

  const parseDropTime = (dropTime?: Timestamp | string | null): Date | undefined => {
    if (!dropTime) return undefined
    if (typeof dropTime === 'string') {
      const date = new Date(dropTime)
      return isNaN(date.getTime()) ? undefined : date
    }
    if ('toDate' in dropTime && typeof dropTime.toDate === 'function') {
      return dropTime.toDate()
    }
    return undefined
  }

  const now = new Date()

  const availableProducts = products.filter(p => {
    const parsed = parseDropTime(p.dropTime)
    return !parsed || parsed <= now
  })

  const comingSoonProducts = products.filter(p => {
    const parsed = parseDropTime(p.dropTime)
    return parsed && parsed > now
  })

  return (
    <>
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animated-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }
        .fade-in {
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        header {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(180%) blur(10px);
          -webkit-backdrop-filter: saturate(180%) blur(10px);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col justify-between text-white">
        <header className="p-8 text-center animated-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500">
            Discover our Products
          </h1>
          <p className="mt-2 text-lg max-w-xl mx-auto text-white/90">
            Browse our curated selection of high-quality items crafted just for you.
          </p>
        </header>

        <main className="flex-grow container mx-auto px-6 py-10">
          {availableProducts.length > 0 && (
            <section>
             <h2
            className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 animate-pulse"
            >
            Available Now
            </h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-16">
                {availableProducts.map((product, i) => (
                  <article
                    key={product.id}
                    className="border rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-gray-900 flex flex-col fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      loading="lazy"
                    />
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-2xl font-semibold mb-2 text-indigo-400">
                        {product.title}
                      </h3>
                      <p className="text-gray-300 flex-grow">{product.description}</p>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-lg text-indigo-300">
                          ${product.price.toFixed(2)}
                        </span>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
                            product.stock > 0
                              ? 'bg-green-700 text-green-300'
                              : 'bg-red-700 text-red-300'
                          }`}
                        >
                          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Sold Out'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        <Link href={`/payment/${product.id}`} passHref>
                          <button
                            className={`w-full p-2 rounded ${
                              product.stock <= 0
                                ? 'bg-gray-700 cursor-not-allowed pointer-events-none'
                                : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                            aria-disabled={product.stock <= 0}
                            disabled={product.stock <= 0}
                          >
                            {product.stock <= 0 ? 'Sold Out' : 'Buy Now'}
                          </button>
                        </Link>

                        <button
                          onClick={() =>
                            addToCart({
                              id: product.id,
                              title: product.title,
                              price: product.price,
                            })
                          }
                          disabled={product.stock <= 0}
                          className={`p-2 rounded ${
                            product.stock <= 0
                              ? 'bg-gray-700 cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>

        {comingSoonProducts.length > 0 && (
          <section className="bg-gray-950 py-10 px-6 mt-auto">
            <div className="container mx-auto">
              <h2
              className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse text-center"
                >
              Coming Soon
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {comingSoonProducts.map((product, i) => {
                  const dropDate = parseDropTime(product.dropTime)
                  return (
                    <article
                      key={product.id}
                      className="border rounded-lg shadow-lg transition-shadow duration-300 bg-gray-800 flex flex-col fade-in opacity-80"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-lg grayscale"
                        loading="lazy"
                      />
                      <div className="p-4 flex flex-col">
                        <h3 className="text-2xl font-semibold mb-2 text-gray-400">
                          {product.title}
                        </h3>
                        <p className="text-gray-400 mb-2">{product.description}</p>
                        {dropDate && (
                          <div className="text-yellow-300 font-semibold text-sm">
                            <DropCountdown dropTime={dropDate} durationSeconds={300} />
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        <footer className="p-6 text-center animated-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-inner">
          <p className="text-sm">&copy; {new Date().getFullYear()} Your Store. All rights reserved.</p>
        </footer>
      </div>
    </>
  )
}
