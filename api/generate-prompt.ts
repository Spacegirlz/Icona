/**
 * Vercel Serverless Function
 * Generates detailed prompts from meta-prompts
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

    const { metaPrompt } = request.body;

    if (!metaPrompt || typeof metaPrompt !== 'string') {
      return response.status(400).json({
        error: 'Missing or invalid metaPrompt',
      });
    }

    const apiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    });

    // Log usage for cost monitoring
    // Pricing: Input $0.30/1M tokens, Output $2.50/1M tokens (Gemini 2.5 Flash)
    const inputTokens = Math.ceil(metaPrompt.length / 4); // Rough estimate
    const outputTokens = Math.ceil(apiResponse.text.length / 4); // Rough estimate
    const inputCost = (inputTokens / 1_000_000) * 0.30;
    const outputCost = (outputTokens / 1_000_000) * 2.50;
    const estimatedCost = inputCost + outputCost;
    
    console.log('[USAGE] Prompt Generation:', {
      endpoint: '/api/generate-prompt',
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
      prompt: apiResponse.text,
    });

  } catch (error: any) {
    console.error('Error in generate-prompt API:', error);
    return response.status(500).json({
      error: 'Failed to generate prompt. Please try again.',
    });
  }
}

