'use client'

import { useState } from 'react'
import { db } from '../../../lib/firebase'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

export default function AdminPage() {
  const [title, setTitle] = useState('')
  const [image, setImage] = useState('')
  const [dropTime, setDropTime] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [description, setDescription] = useState('')
  const [success, setSuccess] = useState(false)

  const handleCreate = async () => {
    try {
      await addDoc(collection(db, 'products'), {
        title,
        image,
        dropTime: Timestamp.fromDate(new Date(dropTime)),
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
      })
      setSuccess(true)
    } catch (err) {
      console.error(err)
      setSuccess(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create Product Drop</h1>
      <input type="text" placeholder="Title" className="w-full p-2 border" value={title} onChange={e => setTitle(e.target.value)} />
      <input type="text" placeholder="Image URL" className="w-full p-2 border" value={image} onChange={e => setImage(e.target.value)} />
      <input type="datetime-local" className="w-full p-2 border" value={dropTime} onChange={e => setDropTime(e.target.value)} />
      <input type="number" placeholder="Price" className="w-full p-2 border" value={price} onChange={e => setPrice(e.target.value)} />
      <input type="number" placeholder="Stock" className="w-full p-2 border" value={stock} onChange={e => setStock(e.target.value)} />
      <textarea placeholder="Description" className="w-full p-2 border" value={description} onChange={e => setDescription(e.target.value)} />
      <button className="w-full bg-black text-white p-2" onClick={handleCreate}>Create Drop</button>
      {success && <p className="text-green-600">Drop created!</p>}
    </div>
  )
}


//Adds product document to products collection in Firestore.
//Handles date parsing with Firestore’s Timestamp.
//Displays confirmation on success.