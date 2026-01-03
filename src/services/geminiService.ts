
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, Language, LANGUAGE_NAMES } from "../types";

// The diagnosis schema structure for structured JSON output
const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    plantName: { type: Type.STRING, description: "The common name of the identified plant." },
    diseaseName: { type: Type.STRING, description: "The name of the detected disease, or 'None' if healthy." },
    isHealthy: { type: Type.BOOLEAN, description: "True if the plant is healthy, false if diseased." },
    confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100." },
    description: { type: Type.STRING, description: "A brief explanation of the diagnosis." },
    naturalTreatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          instruction: { type: Type.STRING }
        }
      }
    },
    chemicalTreatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          instruction: { type: Type.STRING }
        }
      }
    }
  },
  required: ["plantName", "diseaseName", "isHealthy", "confidence", "description", "naturalTreatments", "chemicalTreatments"]
};

export const analyzeCropImage = async (base64Image: string, language: Language = Language.EN): Promise<DiagnosisResult> => {
  try {
    // Create instance inside function to ensure we always use the latest environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = "gemini-3-flash-preview";
    const languageName = LANGUAGE_NAMES[language];
    
    const prompt = `
      You are an expert agronomist. Analyze the provided image of a crop. 
      Respond strictly in the language: ${languageName}.
      Provide accurate identification and practical, easy-to-follow advice for a farmer.
    `;

    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: diagnosisSchema,
        temperature: 0.2,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as DiagnosisResult;

  } catch (error) {
    console.error("Error analyzing crop:", error);
    throw error;
  }
};
