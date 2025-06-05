// app/api/chat/route.ts

import { NextResponse } from 'next/server'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    if (!messages) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 })
    }

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://yourdomain.com', // optional but recommended
        'X-Title': 'your-app-name', // optional but good practice
      },
      body: JSON.stringify({
        model: 'grok-1', // Can change to other models like "mistralai/mixtral-8x7b" etc.
        messages,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenRouter API error:', errorText)
      return NextResponse.json({ error: 'OpenRouter request failed' }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message

    return NextResponse.json({ response: aiResponse })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}
