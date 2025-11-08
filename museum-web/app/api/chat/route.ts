import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artworkId, message } = body;

    if (!artworkId || !message) {
      return NextResponse.json({ error: 'Missing artworkId or message' }, { status: 400 });
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen3-vl:2b',
        prompt: `This is an image of ${artworkId}. The user says: "${message}". What would you say?`,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error('OLLAMA API request failed');
    }

    const ollamaData = await ollamaResponse.json();

    return NextResponse.json({ reply: ollamaData.response });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}