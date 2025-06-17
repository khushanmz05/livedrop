// app/types.ts
export type Message = {
  id: string
  text: string
  user: 'user' | 'bot'
  timestamp: Date
}
