/**
 * Client-side service that calls backend API
 * API key is now secure on the server (Vercel serverless functions)
 */

// Use Vite's import.meta.env for environment variables
// For local dev, use '/api', for production this will be the Vercel URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const editImageWithGemini = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64: string; mimeType: string; }> => {
  try {
    // Ensure the prompt is never empty to prevent an API error
    const effectivePrompt = (prompt && prompt.trim() !== '') ? prompt : 'A beautiful, high-quality photograph of the subject.';

    const response = await fetch(`${API_BASE_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64ImageData,
        mimeType,
        prompt: effectivePrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      base64: data.base64,
      mimeType: data.mimeType,
    };

  } catch (error) {
    console.error("Error calling the AI API:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(errorMessage.includes('429') 
      ? "API rate limit exceeded. Please wait a moment."
      : "Failed to communicate with the AI. Please try again.");
  }
};

export const generateCaptionForImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/generate-caption`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                base64ImageData,
                mimeType,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const data = await response.json();
        return data.caption;

    } catch (error) {
        console.error("Error calling AI for caption:", error);
        throw new Error("Failed to generate caption with the AI.");
    }
}


export const generateDetailedPromptFromTextModel = async (metaPrompt: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-prompt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metaPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.prompt;

  } catch (error) {
    console.error("Error executing meta-prompt:", error);
    throw new Error("Failed to generate detailed prompt with AI.");
  }
};


export const getRefinementSuggestions = async (generationPrompt: string): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/refinement-suggestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                generationPrompt,
            }),
        });

        if (!response.ok) {
            // Don't throw, just return empty array on failure to not break the UI
            return [];
        }

        const data = await response.json();
        const suggestions = data.suggestions || [];
        
        if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
            return suggestions.slice(0, 3); // Ensure only 3 are returned
        }
        return [];

    } catch (error) {
        console.error("Error getting refinement suggestions:", error);
        // Don't throw, just return empty array on failure to not break the UI
        return [];
    }
}