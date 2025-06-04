'use client'
import { useState } from "react"
import { db } from "../../../lib/firebase" 
import { addDoc, collection, serverTimestamp } from "firebase/firestore"

export default function ChatInput() {
  const [input, setInput] = useState("")

  const sendMessage = async () => {
    if (!input.trim()) return

    await addDoc(collection(db, "messages"), {
      text: input,
      user: "user",
      timestamp: serverTimestamp(),
    })

    setInput("")
  }

  return (
    <div className="flex gap-2 p-4">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        className="border rounded px-3 py-2 w-full"
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  )
}
