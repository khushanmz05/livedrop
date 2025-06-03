import { db } from './firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export async function updateServerTime() {
  const ref = doc(db, 'serverTime', 'current')
  await setDoc(ref, {
    updatedAt: serverTimestamp()
  })
  console.log('Server time updated!')
}
