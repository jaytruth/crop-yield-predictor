import React, { useState } from 'react';
import { YieldForm } from '@/components/YieldForm';
import { YieldResults } from '@/components/YieldResults';
import { AgriculturalData, CropRecommendation } from '@/types/agriculture';
import { getTopCropRecommendations } from '@/utils/yieldCalculator';
import heroImage from '@/assets/hero-agriculture.jpg';
import { Sprout, Target, BarChart } from 'lucide-react';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'form' | 'results'>('landing');
  const [yieldData, setYieldData] = useState<AgriculturalData | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendation[] | null>(null);

  const handleStartPrediction = () => {
    setCurrentView('form');
  };

  const handleFormComplete = (data: AgriculturalData) => {
    // 1. Set the user's complete input data
    setYieldData(data);
    
    // 2. Generate the top alternative recommendations based on environmental data
    // We exclude the user's chosen crop and fertilizer to get unbiased recommendations for the land
    const { crop, fertilizer, ...environmentalData } = data; 
    const topRecs = getTopCropRecommendations(environmentalData);
    setRecommendations(topRecs);

    // 3. Switch to the results view
    setCurrentView('results');
  };

  const handleReset = () => {
    setYieldData(null);
    setRecommendations(null); // Also reset the recommendations
    setCurrentView('landing');
  };

  if (currentView === 'form') {
    return <YieldForm onComplete={handleFormComplete} />;
  }

  // Pass both the user's data and the new recommendations to the results page
  if (currentView === 'results' && yieldData) {
    return <YieldResults data={yieldData} recommendations={recommendations} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen gradient-earth">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center mb-6">
              <Sprout className="w-20 h-20 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
              Agricultural Yield Predictor
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get accurate yield predictions and smart crop recommendations based on your farm's data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <button
                onClick={handleStartPrediction}
                className="gradient-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-bounce hover:scale-105 shadow-earth"
              >
                Start Yield Prediction
              </button>
              
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <BarChart className="w-4 h-4" />
                Free analysis • Instant results
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our advanced algorithm analyzes multiple factors to predict your crop yield and recommend powerful alternatives.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4 p-6 rounded-lg shadow-card bg-card">
            <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Input Your Data</h3>
            <p className="text-muted-foreground">
              Provide details about your location, soil, nutrients, rainfall, fertilizer, and your chosen crop.
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg shadow-card bg-card">
            <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center">
              <BarChart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">AI Analysis</h3>
            <p className="text-muted-foreground">
              Our algorithm first predicts the yield for your choice, then finds the top 3 alternatives for your land.
            </p>
          </div>
          
          <div className="text-center space-y-4 p-6 rounded-lg shadow-card bg-card">
            <div className="w-16 h-16 mx-auto gradient-primary rounded-full flex items-center justify-center">
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold">Get Predictions & Recommendations</h3>
            <p className="text-muted-foreground">
              Receive a detailed prediction for your crop and see other high-yield options to maximize your output.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-primary">
            Ready to Optimize Your Crop Yield?
          </h2>
          <p className="text-muted-foreground text-lg">
            Get started with your yield prediction in just a few minutes.
          </p>
          <button
            onClick={handleStartPrediction}
            className="gradient-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-bounce hover:scale-105 shadow-earth"
          >
            Start Your Analysis
          </button>
        </div>
      </section>
    </div>
  );
};

export default Index;

