export interface AgriculturalData {
  district: string;
  soilColor: string;
  nitrogen: number;
  phosphorous: number;
  fertilizer: string;
  rainfall: number;
  crop: string;
}

export interface YieldPrediction {
  predictedYield: number;
  confidence: number;
  factors: {
    soilQuality: number;
    nutrientBalance: number;
    weatherConditions: number;
    fertilizerEfficiency: number;
  };
}

// This is the NEW interface for our multi-crop recommendation feature.
export interface CropRecommendation {
  cropName: (typeof CROPS)[number];
  bestFertilizer: (typeof FERTILIZERS)[number];
  potentialYield: number;
}

export const SOIL_COLORS = [
  'Black',
  'Brown', 
  'Red',
  'Sandy',
  'Clay',
  'Loam'
] as const;

export const FERTILIZERS = [
  'NPK (20-20-20)',
  'Urea (46-0-0)',
  'DAP (18-46-0)',
  'Potash (0-0-60)',
  'Complex (12-32-16)',
  'Organic Compost'
] as const;

export const CROPS = [
  'Rice',
  'Wheat',
  'Corn',
  'Cotton',
  'Sugarcane',
  'Soybean',
  'Potato',
  'Tomato'
] as const;

