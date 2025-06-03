'use client'

import { useAuth } from '../../../lib/authContext'
import { useEffect, useState } from 'react'
import {
  collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc, Timestamp
} from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useRouter } from 'next/navigation'
import LogoutButton from '../auth/logout/page'

type Product = {
  id: string
  title: string
  image: string
  price: number
  stock: number
  description: string
  dropTime?: any
}

export default function AdminProductManager() {
  const { user } = useAuth()
  const router = useRouter()

  // List your admin emails here:
  const adminEmails = ['khushan.kanakrai5@gmail.com', 'admin@gmail.com']

  // Redirect non-admin users
  useEffect(() => {
    if (!user) {
      router.push('/')  // not logged in, redirect
      return
    }
    if (!adminEmails.includes(user.email ?? '')) {
      router.push('/')  // logged in but not admin, redirect
    }
  }, [user, router])

  // Your existing state and functions...

  // Form states
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [dropTime, setDropTime] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')

  // Products list
  const [products, setProducts] = useState<Product[]>([])

  // Editing product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Fetch products realtime
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      const updatedProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[]
      setProducts(updatedProducts)
    })
    return () => unsubscribe()
  }, [])

  // Prefill form to edit
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setTitle(product.title)
    setImage(product.image)
    setDropTime(
      product.dropTime?.toDate 
        ? product.dropTime.toDate().toISOString().slice(0,16) 
        : ''
    )
    setPrice(product.price.toString())
    setStock(product.stock.toString())
    setDescription(product.description)
  }

  // Delete product by id
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await deleteDoc(doc(db, 'products', id))
      alert('Product deleted!')
      if (editingProduct?.id === id) clearForm()
    } catch (err) {
      console.error('Delete error:', err)
      alert('Failed to delete product')
    }
  }

  // Clear form and reset editing state
  const clearForm = () => {
    setEditingProduct(null)
    setTitle('')
    setImage('')
    setDropTime('')
    setPrice('')
    setStock('')
    setDescription('')
  }

  // Create or update product
  const handleSubmit = async () => {
    if (!title || !image || !dropTime || !price || !stock || !description) {
      alert('Please fill out all fields.')
      return
    }
    const date = new Date(dropTime)
    if (isNaN(date.getTime())) {
      alert('Invalid drop time format.')
      return
    }

    try {
      if (editingProduct) {
        const productRef = doc(db, 'products', editingProduct.id)
        await updateDoc(productRef, {
          title,
          image,
          dropTime: Timestamp.fromDate(date),
          price: parseFloat(price),
          stock: parseInt(stock),
          description,
        })
        alert('Product updated!')
      } else {
        await addDoc(collection(db, 'products'), {
          title,
          image,
          dropTime: Timestamp.fromDate(date),
          price: parseFloat(price),
          stock: parseInt(stock),
          description,
        })
        alert('Product created!')
      }
      clearForm()
    } catch (err) {
      console.error('Save error:', err)
      alert('Error saving product')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
       <div className="flex justify-end">
        <LogoutButton />
      </div>
      <h1 className="text-2xl font-bold">{editingProduct ? 'Edit Product Drop' : 'Create Product Drop'}</h1>

      {/* Form */}
      <input
        type="text"
        placeholder="Title"
        className="w-full p-2 border"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Image URL"
        className="w-full p-2 border"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <input
        type="datetime-local"
        className="w-full p-2 border"
        value={dropTime}
        onChange={(e) => setDropTime(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        className="w-full p-2 border"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        className="w-full p-2 border"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="w-full p-2 border"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="flex space-x-4">
        <button
          type="button"
          className="bg-red-600 text-white p-3 rounded flex-1"
          onClick={handleSubmit}
        >
          {editingProduct ? 'Update Drop' : 'Create Drop'}
        </button>
        {editingProduct && (
          <button
            type="button"
            className="bg-gray-400 text-black p-3 rounded flex-1"
            onClick={clearForm}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Products List */}
      <h2 className="text-xl font-bold mt-8">Existing Products</h2>
      {products.length === 0 && <p>No products found.</p>}
      {products.map(product => (
        <div key={product.id} className="border p-4 rounded shadow-sm">
          <h3 className="text-lg font-semibold">{product.title}</h3>
          <img src={product.image} alt={product.title} className="w-full max-h-48 object-cover my-2"/>
          <p>Price: ${product.price.toFixed(2)}</p>
          <p>Stock: {product.stock > 0 ? product.stock : 'Sold Out'}</p>
          <p>{product.description}</p>

          <div className="flex space-x-4 mt-2">
            <button
              className="bg-yellow-400 text-black px-4 py-2 rounded"
              onClick={() => handleEdit(product)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => handleDelete(product.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
