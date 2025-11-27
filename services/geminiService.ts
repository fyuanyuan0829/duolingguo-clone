import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Ensure API Key is available
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key-to-prevent-crash' });

export const generateLessonContent = async (
  language: string,
  topic: string
): Promise<{ title: string; questions: Question[] }> => {
  try {
    const prompt = `Create a beginner-level language lesson for learning ${language}. 
    The topic is "${topic}".
    Generate 4 multiple-choice questions. 
    For each question:
    1. "questionText": The question user needs to answer (e.g., "How do you say 'Cat'?").
    2. "options": 4 possible answers.
    3. "correctAnswerIndex": The index (0-3) of the correct answer.
    4. "imageDescription": A simple, vivid description of an object or scene that represents the word or concept, suitable for a cartoon style illustration (e.g. "A cute orange cat sitting on a mat").
    5. "explanation": A brief explanation of why the answer is correct.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  imageDescription: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                },
                required: ["questionText", "options", "correctAnswerIndex", "imageDescription", "explanation"]
              },
            },
          },
          required: ["title", "questions"]
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Error generating lesson:", error);
    // Fallback data in case of error to keep app usable
    return {
      title: "Basics (Offline Mode)",
      questions: [
        {
          questionText: "Select the correct translation for 'Hello'",
          options: ["Hola", "Adios", "Gato", "Perro"],
          correctAnswerIndex: 0,
          imageDescription: "Two friendly people waving at each other",
          explanation: "Hola means Hello."
        }
      ]
    };
  }
};

export const generateIllustration = async (description: string): Promise<string | null> => {
  try {
    const prompt = `A flat vector art style, vibrant colors, cute cartoon illustration of ${description}. White background. Minimalist design similar to modern language learning apps.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        // No explicit mimeType needed for image gen usually, but we want the image data
      }
    });

    // Parse response to find image
    if (response.candidates?.[0]?.content?.parts) {
       for (const part of response.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
         }
       }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null; // UI will handle null by showing a placeholder or icon
  }
};
