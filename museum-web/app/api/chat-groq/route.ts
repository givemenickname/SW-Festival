import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// IMPORTANT: Replace with your Groq API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artworkId, message } = body;

    if (!artworkId || !message) {
      return NextResponse.json({ error: 'Missing artworkId or message' }, { status: 400 });
    }

    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful art assistant.",
        },
        {
          role: "user",
          content: `I am looking at an artwork with the ID: ${artworkId}. My question is: ${message}`,
        },
      ],
      model: "openai/gpt-oss-20b",
    });

    return NextResponse.json({ reply: groqResponse.choices[0]?.message?.content || "" });

  } catch (error) {
    console.error('Error in Groq chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}