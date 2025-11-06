/**
 * Vercel Serverless Function
 * Generates refinement suggestions based on generation prompt
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

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

    const { generationPrompt } = request.body;

    if (!generationPrompt || typeof generationPrompt !== 'string') {
      return response.status(400).json({
        error: 'Missing or invalid generationPrompt',
      });
    }

    const apiResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Based on the prompt used to create a photo, suggest 3 short, creative, and distinct refinement ideas a user could type in. For example: "add cinematic motion blur", "change expression to a subtle smirk", "make the lighting more dramatic". The original prompt was: "${generationPrompt}". Respond with only a valid JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
      }
    });

    const jsonText = apiResponse.text.trim();
    const suggestions = JSON.parse(jsonText);
    
    // Log usage for cost monitoring
    // Pricing: Input $0.30/1M tokens, Output $2.50/1M tokens (Gemini 2.5 Flash)
    const promptLength = `Based on the prompt used to create a photo, suggest 3 short, creative, and distinct refinement ideas a user could type in. For example: "add cinematic motion blur", "change expression to a subtle smirk", "make the lighting more dramatic". The original prompt was: "${generationPrompt}". Respond with only a valid JSON array of strings.`.length;
    const inputTokens = Math.ceil(promptLength / 4); // Rough estimate
    const outputTokens = Math.ceil(jsonText.length / 4); // Rough estimate
    const inputCost = (inputTokens / 1_000_000) * 0.30;
    const outputCost = (outputTokens / 1_000_000) * 2.50;
    const estimatedCost = inputCost + outputCost;
    
    console.log('[USAGE] Refinement Suggestions:', {
      endpoint: '/api/refinement-suggestions',
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
      suggestions: Array.isArray(suggestions) ? suggestions.slice(0, 3) : [],
    });

  } catch (error: any) {
    console.error('Error in refinement-suggestions API:', error);
    // Return empty array instead of error to not break UI
    return response.status(200).json({
      suggestions: [],
    });
  }
}

