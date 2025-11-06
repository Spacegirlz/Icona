/**
 * Vercel Serverless Function
 * Handles image generation requests from the client
 * Keeps Gemini API key secure on the server
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality } from '@google/genai';

// Get API key from environment (only available server-side)
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY environment variable not set');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Rate limiting helper (simple in-memory for now, can be upgraded to Supabase)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function getClientIdentifier(request: VercelRequest): string {
  // Use IP address or forwarded IP from Vercel
  const forwarded = request.headers['x-forwarded-for'];
  const ip = forwarded 
    ? (Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0])
    : request.headers['x-real-ip'] || 'unknown';
  return ip as string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return response.status(200).json({});
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check rate limit
    const identifier = getClientIdentifier(request);
    if (!checkRateLimit(identifier)) {
      return response.status(429).json({
        error: 'Rate limit exceeded. Please wait a moment before trying again.',
      });
    }

    // Validate API key is available
    if (!ai || !API_KEY) {
      console.error('Gemini API key not configured');
      return response.status(500).json({
        error: 'Server configuration error',
      });
    }

    // Parse request body
    const { base64ImageData, mimeType, prompt } = request.body;

    // Validate inputs
    if (!base64ImageData || !mimeType || !prompt) {
      return response.status(400).json({
        error: 'Missing required fields: base64ImageData, mimeType, prompt',
      });
    }

    // Validate prompt is not empty
    const effectivePrompt = (prompt && prompt.trim() !== '') 
      ? prompt.trim() 
      : 'A beautiful, high-quality photograph of the subject.';

    // Call Gemini API
    const apiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: effectivePrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // Extract image data from response
    for (const part of apiResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        // Log usage for cost monitoring
        // Pricing: Input $0.30/1M tokens, Output $0.039 per image (1024x1024px = 1290 tokens)
        const promptLength = effectivePrompt.length;
        const estimatedInputTokens = Math.ceil((base64ImageData.length / 4) + (promptLength / 4)); // Rough estimate
        const inputCost = (estimatedInputTokens / 1_000_000) * 0.30;
        const imageCost = 0.039; // $0.039 per image (up to 1024x1024px)
        const totalCost = inputCost + imageCost;
        
        console.log('[USAGE] Image Generation:', {
          endpoint: '/api/generate-image',
          inputTokens: estimatedInputTokens,
          imageGenerated: true,
          estimatedCost: `$${totalCost.toFixed(4)}`,
          breakdown: {
            input: `$${inputCost.toFixed(4)}`,
            image: `$${imageCost.toFixed(4)}`,
          },
          ip: getClientIdentifier(request),
        });

        return response.status(200).json({
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        });
      }
    }

    throw new Error('No image data found in the AI response.');

  } catch (error: any) {
    console.error('Error in generate-image API:', error);
    
    // Handle specific error types
    if (error.message?.includes('429')) {
      return response.status(429).json({
        error: 'API rate limit exceeded. Please wait a moment.',
      });
    }

    if (error.message?.includes('INVALID_ARGUMENT')) {
      return response.status(400).json({
        error: 'Invalid request. Please check your input.',
      });
    }

    return response.status(500).json({
      error: 'Failed to generate image. Please try again.',
    });
  }
}

