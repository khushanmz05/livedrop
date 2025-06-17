'use client'

import React, { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../../../lib/firebase'

type ProductBulk = {
  title: string
  image: string
  price: number | string
  stock: number | string
  description: string
  dropTime: string
}

export default function BulkUploadProducts() {
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkUploading, setBulkUploading] = useState(false)

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBulkFile(e.target.files[0])
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      alert('Please select a JSON file first.')
      return
    }

    setBulkUploading(true)

    try {
      const text = await bulkFile.text()
      const productsBulk: ProductBulk[] = JSON.parse(text)

      if (!Array.isArray(productsBulk)) {
        throw new Error('Invalid JSON format: Expected an array of products.')
      }

      // Minimal validation for each product
      for (const [index, product] of productsBulk.entries()) {
        if (
          !product.title ||
          !product.image ||
          !product.price ||
          !product.stock ||
          !product.description ||
          !product.dropTime
        ) {
          throw new Error(`Product at index ${index} is missing required fields.`)
        }
      }

      // Upload all products one by one
      for (const product of productsBulk) {
        await addDoc(collection(db, 'products'), {
          title: product.title,
          image: product.image,
          dropTime: Timestamp.fromDate(new Date(product.dropTime)),
          price: parseFloat(product.price.toString()),
          stock: parseInt(product.stock.toString(), 10),
          description: product.description,
        })
      }

      alert(`Successfully uploaded ${productsBulk.length} products!`)
      setBulkFile(null)
    } catch (error) {
      console.error(error)
      alert('Failed to upload products: ' + (error as Error).message)
    } finally {
      setBulkUploading(false)
    }
  }

  return (
    <div className="mt-6 p-4 border rounded max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-2">Bulk Upload Products</h2>
      <input
        type="file"
        accept="application/json"
        onChange={handleBulkFileChange}
        disabled={bulkUploading}
        className="border p-2 rounded"
      />
      <button
        onClick={handleBulkUpload}
        disabled={bulkUploading || !bulkFile}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {bulkUploading ? 'Uploading...' : 'Upload JSON'}
      </button>
      {bulkFile && <p className="mt-2 text-sm">Selected file: {bulkFile.name}</p>}
      <p className="mt-4 text-gray-600 text-sm">
        The JSON file must be an array of products with keys: <code>title, image, price, stock, description, dropTime</code>.
      </p>
      <p className="text-gray-600 text-sm">
        Example date format: <code>2025-06-03T15:00:00Z</code>
      </p>
    </div>
  )
}
