import {
  AgriculturalData,
  YieldPrediction,
  CROPS,
  FERTILIZERS,
  CropRecommendation, // We will add this to the types file next
} from "@/types/agriculture";

// This is your original function. It remains completely unchanged.
export const calculateYield = (data: AgriculturalData): YieldPrediction => {
  const soilQualityScore = calculateSoilScore(data.soilColor, data.nitrogen, data.phosphorous);
  const nutrientBalanceScore = calculateNutrientScore(data.nitrogen, data.phosphorous, data.crop);
  const weatherScore = calculateWeatherScore(data.rainfall, data.crop);
  const fertilizerScore = calculateFertilizerScore(data.fertilizer, data.crop, data.nitrogen, data.phosphorous);

  const predictedYield = Math.round(
    (soilQualityScore * 0.25) + 
    (nutrientBalanceScore * 0.30) + 
    (weatherScore * 0.25) + 
    (fertilizerScore * 0.20)
  );

  const confidence = calculateConfidence(data);

  return {
    predictedYield,
    confidence,
    factors: {
      soilQuality: soilQualityScore,
      nutrientBalance: nutrientBalanceScore,
      weatherConditions: weatherScore,
      fertilizerEfficiency: fertilizerScore
    }
  };
};

// --- NEW FUNCTION ADDED HERE ---
// This new function calculates the top 3 alternative crops.
export const getTopCropRecommendations = (
  environmentalData: Omit<AgriculturalData, 'crop' | 'fertilizer'>,
  topN: number = 3
): CropRecommendation[] => {
  const allCropScores: CropRecommendation[] = [];

  // 1. Iterate through every possible crop
  for (const crop of CROPS) {
    let bestFertilizerForThisCrop: (typeof FERTILIZERS)[number] = FERTILIZERS[0];
    let highestYieldForThisCrop = -1;

    // 2. For each crop, find its single best fertilizer by using your original calculateYield function
    for (const fertilizer of FERTILIZERS) {
      const fullData = { ...environmentalData, crop, fertilizer } as AgriculturalData;
      const prediction = calculateYield(fullData);
      if (prediction.predictedYield > highestYieldForThisCrop) {
        highestYieldForThisCrop = prediction.predictedYield;
        bestFertilizerForThisCrop = fertilizer;
      }
    }

    // 3. Store the best result for this crop
    allCropScores.push({
      cropName: crop,
      bestFertilizer: bestFertilizerForThisCrop,
      potentialYield: highestYieldForThisCrop,
    });
  }

  // 4. Sort all crops by their highest potential yield and return the top N
  return allCropScores
    .sort((a, b) => b.potentialYield - a.potentialYield)
    .slice(0, topN);
};


// --- ALL ORIGINAL HELPER FUNCTIONS BELOW ARE UNCHANGED ---

const calculateSoilScore = (soilColor: string, nitrogen: number, phosphorous: number): number => {
  let baseScore = 60;
  const soilColorBonuses: Record<string, number> = {
    'Loam': 20, 'Black': 18, 'Brown': 15, 'Red': 12, 'Clay': 8, 'Sandy': 5
  };
  baseScore += soilColorBonuses[soilColor] || 0;
  if (nitrogen >= 100 && nitrogen <= 200) baseScore += 10;
  else if (nitrogen < 50 || nitrogen > 300) baseScore -= 15;
  if (phosphorous >= 30 && phosphorous <= 60) baseScore += 10;
  else if (phosphorous < 15 || phosphorous > 100) baseScore -= 15;
  return Math.min(100, Math.max(0, baseScore));
};

const calculateNutrientScore = (nitrogen: number, phosphorous: number, crop: string): number => {
  let score = 50;
  const cropRequirements: Record<string, { nMin: number, nMax: number, pMin: number, pMax: number }> = {
    'Rice': { nMin: 80, nMax: 150, pMin: 25, pMax: 50 },
    'Wheat': { nMin: 100, nMax: 180, pMin: 30, pMax: 60 },
    'Corn': { nMin: 120, nMax: 200, pMin: 35, pMax: 70 },
    'Cotton': { nMin: 90, nMax: 160, pMin: 20, pMax: 45 },
    'Sugarcane': { nMin: 150, nMax: 250, pMin: 40, pMax: 80 },
    'Soybean': { nMin: 60, nMax: 120, pMin: 25, pMax: 55 },
    'Potato': { nMin: 100, nMax: 180, pMin: 35, pMax: 65 },
    'Tomato': { nMin: 120, nMax: 200, pMin: 40, pMax: 75 }
  };
  const req = cropRequirements[crop];
  if (req) {
    if (nitrogen >= req.nMin && nitrogen <= req.nMax) { score += 25; }
    else if (nitrogen < req.nMin * 0.7 || nitrogen > req.nMax * 1.5) { score -= 20; }
    if (phosphorous >= req.pMin && phosphorous <= req.pMax) { score += 25; }
    else if (phosphorous < req.pMin * 0.7 || phosphorous > req.pMax * 1.5) { score -= 20; }
  }
  return Math.min(100, Math.max(0, score));
};

const calculateWeatherScore = (rainfall: number, crop: string): number => {
  let score = 50;
  const rainfallRequirements: Record<string, { min: number, optimal: number, max: number }> = {
    'Rice': { min: 1000, optimal: 1500, max: 2500 },
    'Wheat': { min: 400, optimal: 700, max: 1200 },
    'Corn': { min: 500, optimal: 800, max: 1400 },
    'Cotton': { min: 500, optimal: 750, max: 1300 },
    'Sugarcane': { min: 1200, optimal: 1800, max: 2800 },
    'Soybean': { min: 450, optimal: 700, max: 1200 },
    'Potato': { min: 400, optimal: 600, max: 1000 },
    'Tomato': { min: 400, optimal: 650, max: 1100 }
  };
  const req = rainfallRequirements[crop];
  if (req) {
    if (rainfall >= req.optimal * 0.9 && rainfall <= req.optimal * 1.1) {
      score = 95;
    } else if (rainfall >= req.min && rainfall <= req.max) {
      const distance = Math.abs(rainfall - req.optimal);
      const maxDistance = Math.max(req.optimal - req.min, req.max - req.optimal);
      score = 95 - (distance / maxDistance) * 35;
    } else {
      score = 30;
    }
  }
  return Math.min(100, Math.max(0, score));
};

const calculateFertilizerScore = (fertilizer: string, crop: string, nitrogen: number, phosphorous: number): number => {
  let score = 60;
  const fertilizerBonus: Record<string, number> = {
    'NPK (20-20-20)': 15, 'Urea (46-0-0)': nitrogen < 100 ? 20 : 5,
    'DAP (18-46-0)': phosphorous < 40 ? 18 : 8, 'Potash (0-0-60)': 12,
    'Complex (12-32-16)': phosphorous < 50 ? 16 : 10, 'Organic Compost': 18
  };
  score += fertilizerBonus[fertilizer] || 0;
  const cropFertilizerMatch: Record<string, string[]> = {
    'Rice': ['NPK (20-20-20)', 'Urea (46-0-0)', 'Complex (12-32-16)'],
    'Wheat': ['NPK (20-20-20)', 'DAP (18-46-0)', 'Complex (12-32-16)'],
    'Corn': ['NPK (20-20-20)', 'Urea (46-0-0)'],
    'Cotton': ['NPK (20-20-20)', 'Complex (12-32-16)', 'Potash (0-0-60)'],
    'Tomato': ['NPK (20-20-20)', 'Complex (12-32-16)', 'Organic Compost']
  };
  if (cropFertilizerMatch[crop]?.includes(fertilizer)) {
    score += 10;
  }
  return Math.min(100, Math.max(0, score));
};

const calculateConfidence = (data: AgriculturalData): number => {
  let confidence = 85;
  if (data.nitrogen > 400 || data.phosphorous > 150) confidence -= 10;
  if (data.rainfall < 200 || data.rainfall > 3000) confidence -= 15;
  if (data.district && data.district.length > 2) confidence += 5;
  return Math.min(95, Math.max(60, confidence));
};

