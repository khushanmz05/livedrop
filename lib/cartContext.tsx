'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useAuth } from './authContext'

export type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
  image: string
}

export type Product = {
  id: string
  title: string
  price: number
  stock: number
  image?: string
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (
    item: Omit<CartItem, 'quantity'>,
    onUnauthorized?: () => void
  ) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  products: Product[]
  decreaseStockOnCheckout: (cart: CartItem[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [cart, setCart] = useState<CartItem[]>([])

  // Initialize products with stock — replace with your real data or API fetch
  const [products, setProducts] = useState<Product[]>([
    { id: '1', title: 'Product 1', price: 10, stock: 10 },
    { id: '2', title: 'Product 2', price: 20, stock: 5 },
    // Add more products here
  ])

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error)
        setCart([])
      }
    }
  }, [])

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  /**
   * Add item to cart.
   * If user is not authenticated, calls optional onUnauthorized callback or shows alert.
   */
  function addToCart(
    item: Omit<CartItem, 'quantity'>,
    onUnauthorized?: () => void
  ) {
    if (!user) {
      if (onUnauthorized) {
        onUnauthorized()
      } else {
        alert('Please log in to add items to your cart.')
      }
      return
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id)
      if (existing) {
        // Increase quantity if product already in cart
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      // Add new product with quantity 1
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((items) => items.filter((item) => item.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  /**
   * Decrease stock of products based on purchased cart items.
   * Should be called on successful checkout.
   */
  function decreaseStockOnCheckout(cart: CartItem[]) {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find((item) => item.id === product.id)
        if (cartItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - cartItem.quantity),
          }
        }
        return product
      })
    )
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        products,
        decreaseStockOnCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
