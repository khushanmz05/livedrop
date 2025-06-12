// hooks/useLivePurchases.ts
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../../lib/firebase"; 

export function useLivePurchases(limitCount = 5) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "purchases"),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setPurchases(data);
    });

    return () => unsub();
  }, [limitCount]);

  return purchases;
}
