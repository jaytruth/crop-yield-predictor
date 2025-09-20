import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';
import { DistrictStep } from './form-steps/DistrictStep';
import { SoilColorStep } from './form-steps/SoilColorStep';
import { NitrogenStep } from './form-steps/NitrogenStep';
import { PhosphorousStep } from './form-steps/PhosphorousStep';
import { FertilizerStep } from './form-steps/FertilizerStep';
import { RainfallStep } from './form-steps/RainfallStep';
import { CropStep } from './form-steps/CropStep';

interface YieldFormProps {
  onComplete: (data: AgriculturalData) => void;
}

const TOTAL_STEPS = 7;

const STEP_TITLES = [
  'District Location',
  'Soil Color',
  'Nitrogen Content',
  'Phosphorous Content',
  'Fertilizer Type',
  'Rainfall Level',
  'Crop Selection'
];

export const YieldForm: React.FC<YieldFormProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<AgriculturalData>>({});

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const updateFormData = (field: keyof AgriculturalData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(formData as AgriculturalData);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return !!formData.district && formData.district.trim().length > 0;
      case 1: return !!formData.soilColor;
      case 2: return typeof formData.nitrogen === 'number' && formData.nitrogen >= 0;
      case 3: return typeof formData.phosphorous === 'number' && formData.phosphorous >= 0;
      case 4: return !!formData.fertilizer;
      case 5: return typeof formData.rainfall === 'number' && formData.rainfall >= 0;
      case 6: return !!formData.crop;
      default: return false;
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      value: formData,
      onChange: updateFormData,
      onNext: goNext
    };

    switch (currentStep) {
      case 0: return <DistrictStep {...stepProps} />;
      case 1: return <SoilColorStep {...stepProps} />;
      case 2: return <NitrogenStep {...stepProps} />;
      case 3: return <PhosphorousStep {...stepProps} />;
      case 4: return <FertilizerStep {...stepProps} />;
      case 5: return <RainfallStep {...stepProps} />;
      case 6: return <CropStep {...stepProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen gradient-earth flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-earth">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            {STEP_TITLES[currentStep]}
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {TOTAL_STEPS}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="step-enter-active">
            {renderCurrentStep()}
          </div>
          
          <div className="flex justify-between">
            <Button
              onClick={goBack}
              disabled={currentStep === 0}
              variant="outline"
              className="transition-smooth"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={goNext}
              disabled={!isStepValid()}
              className="gradient-primary text-primary-foreground transition-smooth"
            >
              {currentStep === TOTAL_STEPS - 1 ? 'Get Prediction' : 'Next'}
              {currentStep !== TOTAL_STEPS - 1 && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

