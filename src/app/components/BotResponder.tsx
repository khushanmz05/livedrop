'use client'
import { useEffect, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, onSnapshot, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore"

export default function BotResponder() {
  const lastUserMessageRef = useRef("")

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"))
    const unsub = onSnapshot(q, async snap => {
      const latest = snap.docs[0]?.data()
      if (!latest || latest.user !== "user") return

      const sameAsLast = lastUserMessageRef.current === latest.text
      if (sameAsLast) return

      lastUserMessageRef.current = latest.text

      const botReply = getBotReply(latest.text)

      await addDoc(collection(db, "messages"), {
        text: botReply,
        user: "bot",
        timestamp: serverTimestamp(),
      })
    })

    return () => unsub()
  }, [])

  const getBotReply = (text: string) => {
    if (text.toLowerCase().includes("hello")) return "Hi there! 👋"
    if (text.toLowerCase().includes("how are you")) return "I'm just code, but doing great!"
    return "🤖 I don't understand yet, but I'm learning."
  }

  return null // no UI
}
