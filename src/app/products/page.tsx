'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useCart } from '../../../lib/cartContext'
import DropCountdown from '../components/DropCountdown'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'

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
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribeAuthState = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    const unsubscribeProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[]
      setProducts(updatedProducts)
    })

    return () => {
      unsubscribeAuthState()
      unsubscribeProducts()
    }
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
        /* your existing styles here */
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col justify-between text-white">
        <header className="p-8 text-center animated-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-xl border-b border-white/10 rounded-b-3xl">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-400 to-pink-500 animate-[glowPulse_3s_ease-in-out_infinite]">
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
                className="text-3xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-blue-400 to-purple-500 animate-pulse drop-shadow-[0_0_8px_rgba(100,255,255,0.8)]"
              >
                Available Now
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {availableProducts.map((product, i) => (
                  <div
                    key={product.id}
                    className="relative group fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {/* Glow on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-purple-700 blur-md opacity-0 group-hover:opacity-30 transition duration-300" />
                    {/* Glass Card */}
                    <article className="relative z-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-48 object-cover rounded-t-xl"
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
                          <button
                            onClick={() => {
                              if (!user) {
                                alert('Please register or log in to buy.')
                                return
                              }
                              if (product.stock <= 0) {
                                alert('Sorry, this product is sold out.')
                                return
                              }
                              // Proceed to payment page
                              window.location.href = `/payment/${product.id}`
                            }}
                            className={`w-full p-2 rounded font-semibold transition-all duration-300 ${
                              product.stock <= 0
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-500 text-white shadow-md hover:shadow-xl'
                            }`}
                          >
                            Buy Now
                          </button>

                          <button
                            onClick={() => {
                              if (!user) {
                                alert('Please register or log in to add items to your cart.')
                                return
                              }
                              if (product.stock <= 0) {
                                alert('Sorry, this product is sold out.')
                                return
                              }
                              addToCart({
                                id: product.id,
                                title: product.title,
                                price: product.price,
                                image: product.image,
                              })
                            }}
                            className={`p-2 rounded font-semibold transition-all duration-300 ${
                              product.stock <= 0
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white shadow-md hover:shadow-xl'
                            }`}
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {comingSoonProducts.length > 0 && (
          <section className="bg-gray-950 py-10 px-6 mt-auto">
            <div className="container mx-auto">
              <h2
                className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 animate-pulse drop-shadow-[0_0_10px_rgba(255,100,150,0.8)]"
              >
                Coming Soon
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {comingSoonProducts.map((product) => (
                  <article
                    key={product.id}
                    className="relative rounded-xl border border-white/20 p-6 bg-black/30 shadow-lg flex flex-col items-center"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-48 h-48 object-cover rounded-lg mb-4"
                      loading="lazy"
                    />
                    <h3 className="text-2xl font-extrabold text-pink-400 mb-2">{product.title}</h3>
                    <DropCountdown dropTime={parseDropTime(product.dropTime)} />
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
