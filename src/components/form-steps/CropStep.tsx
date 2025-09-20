import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Wheat } from 'lucide-react';
import { AgriculturalData, CROPS } from '@/types/agriculture';

interface CropStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

const CROP_INFO = {
  'Rice': 'Water-intensive, requires flooded fields',
  'Wheat': 'Cool season crop, moderate water needs',
  'Corn': 'High nitrogen requirement, warm season',
  'Cotton': 'Long growing season, moderate water needs',
  'Sugarcane': 'High water and nutrient requirements',
  'Soybean': 'Nitrogen-fixing legume, moderate needs',
  'Potato': 'Cool season, well-drained soil preferred',
  'Tomato': 'High nutrient needs, consistent moisture'
};

const CROP_ICONS = {
  'Rice': '🌾',
  'Wheat': '🌾', 
  'Corn': '🌽',
  'Cotton': '🌿',
  'Sugarcane': '🎋',
  'Soybean': '🫘',
  'Potato': '🥔',
  'Tomato': '🍅'
};

export const CropStep: React.FC<CropStepProps> = ({ value, onChange, onNext }) => {
  const handleSelection = (crop: string) => {
    onChange('crop', crop);
    setTimeout(() => onNext(), 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Wheat className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Select the crop you are planning to grow or currently growing.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {CROPS.map((crop) => (
          <Button
            key={crop}
            onClick={() => handleSelection(crop)}
            variant={value.crop === crop ? "default" : "outline"}
            className="h-auto p-4 flex flex-col items-center space-y-2 transition-bounce hover:scale-105"
          >
            <div className="text-2xl">
              {CROP_ICONS[crop as keyof typeof CROP_ICONS]}
            </div>
            <span className="font-semibold">{crop}</span>
            <span className="text-xs text-center opacity-75">
              {CROP_INFO[crop as keyof typeof CROP_INFO]}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Different crops have varying nutrient and water requirements for optimal yield.
        </p>
      </div>
    </div>
  );
};