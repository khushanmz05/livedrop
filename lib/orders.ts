// lib/orders.ts
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { CartItem } from "./cartContext";

export async function saveOrder(items: CartItem[], total: number, userId?: string) {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      items,
      total,
      userId: userId || null,
      createdAt: serverTimestamp(),
      status: "pending", // you can track order status here
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving order: ", error);
    throw error;
  }
}
