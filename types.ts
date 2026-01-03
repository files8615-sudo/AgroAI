export enum AppView {
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  DIAGNOSIS = 'DIAGNOSIS',
  NOTES = 'NOTES',
  EXPERT = 'EXPERT'
}

export interface User {
  name: string;
  email: string;
  location: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'General' | 'Planting' | 'Irrigation' | 'Harvest' | 'Issue';
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

export interface Treatment {
  name: string;
  instruction: string;
}

export interface DiagnosisResult {
  plantName: string;
  diseaseName: string;
  isHealthy: boolean;
  confidence: number;
  description: string;
  naturalTreatments: Treatment[];
  chemicalTreatments: Treatment[];
}

export enum Language {
  EN = 'en',
  HI = 'hi', // Hindi
  BN = 'bn', // Bengali
  MR = 'mr', // Marathi
  TE = 'te', // Telugu
  TA = 'ta', // Tamil
  GU = 'gu', // Gujarati
  UR = 'ur', // Urdu
  KN = 'kn', // Kannada
  OR = 'or', // Odia
  ML = 'ml', // Malayalam
  PA = 'pa', // Punjabi
  AS = 'as'  // Assamese
}

export const LANGUAGE_NAMES: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.HI]: 'हिंदी (Hindi)',
  [Language.BN]: 'বাংলা (Bengali)',
  [Language.MR]: 'मराठी (Marathi)',
  [Language.TE]: 'తెలుగు (Telugu)',
  [Language.TA]: 'தமிழ் (Tamil)',
  [Language.GU]: 'ગુજરાતી (Gujarati)',
  [Language.UR]: 'اردو (Urdu)',
  [Language.KN]: 'ಕನ್ನಡ (Kannada)',
  [Language.OR]: 'ଓଡ଼ିଆ (Odia)',
  [Language.ML]: 'മലയാളം (Malayalam)',
  [Language.PA]: 'ਪੰਜਾਬੀ (Punjabi)',
  [Language.AS]: 'অসমীয়া (Assamese)'
};