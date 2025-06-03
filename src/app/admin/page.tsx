'use client'
import { useState } from 'react'
import { db } from '../../../lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { updateServerTime } from '../../../lib/serverTime' // make sure this exists

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [dropTime, setDropTime] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState(false)

  const handleCreate = async () => {
    console.log('Handle create...')
    if (!title || !image || !dropTime || !price || !stock || !description) {
      alert('Please fill out all fields.')
      return
    }
  
    try {
      const date = new Date(dropTime)
      console.log('Date:', date)
      if (isNaN(date.getTime())) {
        alert('Invalid drop time format.')
        return
      }
  
      await addDoc(collection(db, 'products'), {
        title,
        image,
        dropTime: Timestamp.fromDate(date),
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
      })
      console.log('Doc created!')
      setSuccess(true)
    } catch (err) {
      console.error("Error creating doc:", err)
      setSuccess(false)
    }
  }

  const handleUpdateServerTime = async () => {
    try {
      await updateServerTime()
      alert('Server time updated!')
    } catch (err) {
      alert('Failed to update server time: ' + err)
    }
  }
  
  return (
    <div className="relative z-10 max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create Product Drop</h1>
  
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
  
      <button
        type="button"
        className="w-full bg-red-600 text-white p-4 relative z-[999]"
        onClick={handleCreate}
      >
        Create Drop
      </button>

      <button
        type="button"
        className="w-full bg-blue-600 text-white p-4 mt-4 relative z-[999]"
        onClick={handleUpdateServerTime}
      >
        Update Server Time
      </button>

      {success && <p className="text-green-600">Drop created!</p>}
    </div>
  )
}
