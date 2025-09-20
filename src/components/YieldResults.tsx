import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, TrendingUp, Award, Zap, Info } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';
import { calculateYield } from '@/utils/yieldCalculator';
import { CropRecommendation } from '@/types/agriculture';

interface YieldResultsProps {
  data: AgriculturalData;
  recommendations: CropRecommendation[] | null;
  onReset: () => void;
}

export const YieldResults: React.FC<YieldResultsProps> = ({ data, recommendations, onReset }) => {
  // Calculate the prediction for the user's CHOSEN crop
  const userPrediction = calculateYield(data);

  const getYieldCategory = (yieldValue: number) => {
    if (yieldValue >= 85) return { category: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    if (yieldValue >= 70) return { category: 'Good', color: 'text-accent', bgColor: 'bg-green-50' };
    if (yieldValue >= 55) return { category: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (yieldValue >= 40) return { category: 'Below Average', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    return { category: 'Poor', color: 'text-destructive', bgColor: 'bg-red-50' };
  };

  const yieldInfo = getYieldCategory(userPrediction.predictedYield);

  return (
    <div className="min-h-screen gradient-earth flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">

        {/* Section 1: Prediction for User's Chosen Crop */}
        <Card className="shadow-earth">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              Prediction for Your Choice
            </CardTitle>
            <p className="text-muted-foreground">
              Analysis for {data.crop} with {data.fertilizer} in {data.district}
            </p>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${yieldInfo.bgColor}`}>
                <span className={`text-sm font-medium ${yieldInfo.color}`}>
                  {yieldInfo.category} Yield Potential
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-6xl font-bold text-primary">
                  {userPrediction.predictedYield.toFixed(1)}%
                </h2>
                <p className="text-xl text-muted-foreground">
                  Predicted Yield Efficiency
                </p>
              </div>
              <Progress 
                value={userPrediction.predictedYield} 
                className="h-4 w-full max-w-md mx-auto" 
              />
          </CardContent>
        </Card>

        {/* ADDED SECTION: Your Input Summary */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center gap-2">
             <Info className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl">Your Input Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Location:</span>
                <p className="font-semibold">{data.district}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Soil:</span>
                <p className="font-semibold">{data.soilColor}</p>
              </div>
               <div>
                <span className="font-medium text-muted-foreground">Your Crop:</span>
                <p className="font-semibold">{data.crop}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Your Fertilizer:</span>
                <p className="font-semibold">{data.fertilizer}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Nitrogen:</span>
                <p className="font-semibold">{data.nitrogen} ppm</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Phosphorous:</span>
                <p className="font-semibold">{data.phosphorous} ppm</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Rainfall:</span>
                <p className="font-semibold">{data.rainfall} mm</p>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Section 3: Top Alternative Recommendations */}
        {recommendations && recommendations.length > 0 && (
          <Card className="shadow-earth">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
                <Award className="w-8 h-8 text-primary" />
                Top Alternative Recommendations
              </CardTitle>
              <p className="text-muted-foreground">
                Based on your farm's conditions, these crops might perform even better.
              </p>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {recommendations.map((rec, index) => (
                <div key={rec.cropName} className="flex items-center justify-between p-4 rounded-lg bg-card border shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-primary">{rec.cropName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Best fertilizer: <strong>{rec.bestFertilizer}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-bold text-green-600">{rec.potentialYield.toFixed(1)}%</p>
                     <p className="text-sm text-muted-foreground">Potential Yield</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Reset Button */}
        <div className="flex justify-center">
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="transition-smooth"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Analyze Another Scenario
          </Button>
        </div>
      </div>
    </div>
  );
};

