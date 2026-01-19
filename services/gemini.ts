
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

export const askGemini = async (prompt: string, history: Message[]): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Convert history to Gemini format
    // Role 'assistant' maps to 'model' in Gemini
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content.replace(/<[^>]*>?/gm, '') }] // Strip HTML for the model input
    }));

    // Add current prompt
    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction: "You are SAM, a technical support agent for Assembly Global employees. Be professional, concise, and helpful. You have memory of the conversation so far. If you don't know the specific internal policy, advise them to contact the local IT team.",
      },
    });
    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The AI service is currently unavailable. Please try again or contact IT Support.";
  }
};
