// components/PurchaseFeed.tsx
'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { formatDistanceToNow } from 'date-fns'

type Purchase = {
  id: string
  title: string
  price: number
  user: string
  timestamp: Date
}

type PurchaseFeedProps = {
  refreshTrigger?: boolean
}

export default function PurchaseFeed({ refreshTrigger }: PurchaseFeedProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      const q = query(collection(db, 'purchases'), orderBy('timestamp', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => {
        const raw = doc.data()
        return {
          id: doc.id,
          title: raw.title,
          price: raw.price,
          user: raw.user,
          timestamp: raw.timestamp?.toDate?.() || new Date(),
        } as Purchase
      })
      setPurchases(data)
    }

    fetchPurchases()
  }, [refreshTrigger])
  
  return (
    <div className="bg-black border border-purple-800 rounded-lg p-4 shadow-md">
      <h2 className="text-pink-400 text-lg font-bold mb-3 tracking-wide">🔥 Latest Purchases</h2>
      {purchases.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No recent purchases yet.</p>
      ) : (
        <ul className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500">
          {purchases.map(p => (
            <li
              key={p.id}
              className="bg-gray-900 rounded-md px-4 py-2 text-sm text-white flex items-center justify-between hover:bg-gray-800 transition"
            >
              <div>
                <p className="font-medium">{p.user}</p>
                <p className="text-xs text-gray-400">
                    {p.title} · {formatDistanceToNow(p.timestamp, { addSuffix: true })}
                </p>
              </div>
              <span className="text-green-400 font-semibold">${(p.price ?? 0).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
