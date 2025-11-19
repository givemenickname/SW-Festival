import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { promises as fs } from 'fs';

const genAIApiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = genAIApiKey ? new GoogleGenerativeAI(genAIApiKey) : null;
const BUILDING_CONFIG_PATH = path.join(
  process.cwd(),
  'public',
  'openvgal',
  'content',
  'building_v2.json',
);

type ArtworkEntry = {
  resource: string;
  metadata?: string;
  resource_type?: string;
};

let cachedConfig: Record<string, Record<string, ArtworkEntry>> | null = null;

async function loadBuildingConfig() {
  if (cachedConfig) return cachedConfig;

  const file = await fs.readFile(BUILDING_CONFIG_PATH, 'utf-8');
  const parsed = JSON.parse(file);

  cachedConfig = parsed;
  return cachedConfig!;
}

async function findArtwork(artworkId: string) {
  const config = await loadBuildingConfig();

  for (const galleryName of Object.keys(config)) {
    const gallery = config[galleryName];
    if (!gallery || typeof gallery !== 'object') continue;

    const entry = gallery[artworkId];

    if (entry && entry.resource_type === 'image') {
      return entry;
    }
  }

  return null;
}

function getMimeType(resource: string) {
  const ext = resource.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { artworkId, message } = body;

    if (!artworkId || !message) {
      return NextResponse.json(
        { error: 'Missing artworkId or message' },
        { status: 400 },
      );
    }

    const artwork = await findArtwork(artworkId);

    if (!artwork) {
      return NextResponse.json(
        { error: `Artwork '${artworkId}' not found` },
        { status: 404 },
      );
    }

    const imagePath = path.join(
      process.cwd(),
      'public',
      'openvgal',
      'content',
      artwork.resource,
    );
    const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });
    const mimeType = getMimeType(artwork.resource);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const promptText = [
      'You are a warm, knowledgeable digital museum docent.',
      `Artwork metadata: ${artwork.metadata ?? 'N/A'}.`,
      'Explain what the visitor is seeing and answer their question clearly in Korean.',
      `Visitor message: "${message}"`,
    ].join('\n');

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            { text: promptText },
            {
              inlineData: {
                data: imageBase64,
                mimeType,
              },
            },
          ],
        },
      ],
    });

    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown Gemini error';
    console.error('Error in Gemini chat API:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: process.env.NODE_ENV !== 'production' ? message : undefined,
      },
      { status: 500 },
    );
  }
}

