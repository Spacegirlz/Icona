/**
 * Vercel Serverless Function
 * Generates captions for images
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'OPTIONS') {
    return response.status(200).json({});
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!ai || !API_KEY) {
      return response.status(500).json({
        error: 'Server configuration error',
      });
    }

    const { base64ImageData, mimeType } = request.body;

    if (!base64ImageData || !mimeType) {
      return response.status(400).json({
        error: 'Missing required fields: base64ImageData, mimeType',
      });
    }

    const apiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: "You are a witty and clever social media caption writer. Generate a short, fun caption for this time-travel photo. It should be exciting and perfect for sharing. End with 3 relevant and trending hashtags.",
          },
        ],
      },
    });

    // Log usage for cost monitoring
    // Pricing: Input $0.30/1M tokens, Output $2.50/1M tokens (Gemini 2.5 Flash)
    const inputTokens = Math.ceil((base64ImageData.length / 4) + 100); // Rough estimate
    const outputTokens = Math.ceil(apiResponse.text.length / 4); // Rough estimate
    const inputCost = (inputTokens / 1_000_000) * 0.30;
    const outputCost = (outputTokens / 1_000_000) * 2.50;
    const estimatedCost = inputCost + outputCost;
    
    console.log('[USAGE] Caption Generation:', {
      endpoint: '/api/generate-caption',
      inputTokens,
      outputTokens,
      estimatedCost: `$${estimatedCost.toFixed(6)}`,
      breakdown: {
        input: `$${inputCost.toFixed(6)}`,
        output: `$${outputCost.toFixed(6)}`,
      },
      ip: request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown',
    });

    return response.status(200).json({
      caption: apiResponse.text,
    });

  } catch (error: any) {
    console.error('Error in generate-caption API:', error);
    return response.status(500).json({
      error: 'Failed to generate caption. Please try again.',
    });
  }
}

