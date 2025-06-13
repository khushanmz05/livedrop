'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type CartItem = {
  id: string
  title: string
  price: number
  quantity: number
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
  addToCart: (item: Omit<CartItem, 'quantity'>) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  products: Product[]
  decreaseStockOnCheckout: (cart: CartItem[]) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Initialize products with stock — **replace this with your real products data**
  const [products, setProducts] = useState<Product[]>([
    { id: '1', title: 'Product 1', price: 10, stock: 10 },
    { id: '2', title: 'Product 2', price: 20, stock: 5 },
    // Add all your products here
  ])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) {
      try {
        setCart(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e)
        setCart([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id)
      if (existing) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prevCart, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(items => items.filter(item => item.id !== id))
  }

  function clearCart() {
    setCart([])
  }

  // New: decrease stock based on cart contents when user checks out
  function decreaseStockOnCheckout(cart: CartItem[]) {
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find(item => item.id === product.id)
        if (cartItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - cartItem.quantity), // prevent negative stock
          }
        }
        return product
      })
    )
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, products, decreaseStockOnCheckout }}
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
