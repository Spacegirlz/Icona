
import { GoogleGenAI, Modality, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImageWithGemini = async (base64ImageData: string, mimeType: string, prompt: string): Promise<{ base64: string; mimeType: string; }> => {
  try {
    const response = await ai.models.generateContent({
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
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });
    
    // Find the first part that contains image data
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType,
        };
      }
    }
    
    throw new Error("No image data found in the AI response.");

  } catch (error) {
    console.error("Error calling the AI API:", error);
    throw new Error("Failed to communicate with the AI.");
  }
};

export const generateCaptionForImage = async (base64ImageData: string, mimeType: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
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

        return response.text;
    } catch (error) {
        console.error("Error calling AI for caption:", error);
        throw new Error("Failed to generate caption with the AI.");
    }
}


export const generateDetailedPromptFromTextModel = async (metaPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: metaPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error executing meta-prompt:", error);
    throw new Error("Failed to generate detailed prompt with AI.");
  }
};


export const getRefinementSuggestions = async (generationPrompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
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

        const jsonText = response.text.trim();
        const suggestions = JSON.parse(jsonText);
        
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
