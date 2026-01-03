import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, Language, LANGUAGE_NAMES } from "../types";

const diagnosisSchema = {
  type: Type.OBJECT,
  properties: {
    plantName: { type: Type.STRING, description: "The common name of the identified plant in the requested language." },
    diseaseName: { type: Type.STRING, description: "The name of the detected disease in the requested language." },
    isHealthy: { type: Type.BOOLEAN, description: "True if the plant is healthy." },
    confidence: { type: Type.NUMBER, description: "Confidence score (0-100)." },
    description: { type: Type.STRING, description: "A detailed explanation in the requested language." },
    naturalTreatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of treatment in requested language." },
          instruction: { type: Type.STRING, description: "Step-by-step instruction in requested language." }
        }
      }
    },
    chemicalTreatments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Name of treatment in requested language." },
          instruction: { type: Type.STRING, description: "Step-by-step instruction in requested language." }
        }
      }
    }
  },
  required: ["plantName", "diseaseName", "isHealthy", "confidence", "description", "naturalTreatments", "chemicalTreatments"]
};

export const analyzeCropImage = async (base64Image: string, language: Language = Language.EN): Promise<DiagnosisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = "gemini-3-flash-preview";
    const languageName = LANGUAGE_NAMES[language];
    
    const prompt = `
      As an agricultural expert, analyze this crop image.
      IMPORTANT: You MUST respond entirely in ${languageName}.
      Identify the plant, detect any diseases, and provide treatment instructions.
      Ensure the terminology is simple and localized for a farmer who speaks ${languageName}.
    `;

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
        temperature: 0.1,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as DiagnosisResult;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
};