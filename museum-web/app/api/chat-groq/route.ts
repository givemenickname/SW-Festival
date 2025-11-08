import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// IMPORTANT: Replace with your Groq API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageBase64, message } = body;

    if (!imageBase64 || !message) {
      return NextResponse.json({ error: 'Missing imageBase64 or message' }, { status: 400 });
    }

    // Remove the data URL prefix to get the pure base64 string
    const base64Data = imageBase64.split(',')[1];

    const groqResponse = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert art historian and critic. You will be given an image of an artwork and a question. Provide a thoughtful and insightful response.",
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                "url": `data:image/jpeg;base64,${base64Data}`
              },
            },
            {
              type: "text",
              text: message,
            },
          ],
        },
      ],
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    });

    return NextResponse.json({ reply: groqResponse.choices[0]?.message?.content || "" });

  } catch (error) {
    console.error('Error in Groq chat API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}