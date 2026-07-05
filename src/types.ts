export type LanguageCode = "en" | "te" | "hi" | "ta" | "kn" | "ml" | "mr" | "bn" | "gu" | "pa" | "or";

export interface User {
  id: string;
  name: string;
  phone: string;
  language: LanguageCode;
  village: string;
  district: string;
}

export interface CropLog {
  id: string;
  userId: string;
  userName: string;
  village: string;
  crop: string;
  date: string;
  soil: {
    type: string;
    ph: string;
    n: number;
    p: number;
    k: number;
  };
  weather: {
    temp: string;
    humidity: string;
    rainfall: string;
  };
  recommendation: {
    crop: string;
    confidence: string;
    alternatives: string[];
    yield: string;
    water: string;
    fertilizer: string;
    profit: string;
  };
}

export interface DiseaseLog {
  id: string;
  userId: string;
  userName: string;
  village: string;
  phone: string;
  photo: string; // base64 or sample identifier
  date: string;
  diagnosis: {
    disease: string;
    confidence: string;
    treatment: string;
    symptoms: string;
    needExpert: boolean;
  };
  status: "pending" | "resolved";
  expertReply?: string;
  expertName?: string;
  repliedAt?: string;
}

export interface VoiceLog {
  id: string;
  userId: string;
  userName: string;
  village: string;
  date: string;
  query: string;
  reply: string;
  language: LanguageCode;
}

export interface SmsLog {
  id: string;
  userId: string;
  phone: string;
  date: string;
  message: string;
  reply: string;
  language: LanguageCode;
}

export interface WeatherAdvisory {
  temp: string;
  humidity: string;
  condition: string;
  windSpeed: string;
  rainfall: string;
  advice: string[];
}
