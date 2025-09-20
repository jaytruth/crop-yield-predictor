import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import { AgriculturalData, SOIL_COLORS } from '@/types/agriculture';

interface SoilColorStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

const SOIL_COLOR_INFO = {
  'Black': 'Rich in organic matter, excellent for cotton and sugarcane',
  'Brown': 'Well-balanced nutrients, good for wheat and rice',
  'Red': 'High iron content, suitable for groundnut and cotton', 
  'Sandy': 'Well-drained but may need more fertilizer',
  'Clay': 'High water retention, good for rice cultivation',
  'Loam': 'Ideal soil type with balanced drainage and nutrients'
};

export const SoilColorStep: React.FC<SoilColorStepProps> = ({ value, onChange, onNext }) => {
  const handleSelection = (color: string) => {
    onChange('soilColor', color);
    setTimeout(() => onNext(), 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Layers className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Select your soil color. This helps determine soil composition and nutrient content.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {SOIL_COLORS.map((color) => (
          <Button
            key={color}
            onClick={() => handleSelection(color)}
            variant={value.soilColor === color ? "default" : "outline"}
            className="h-auto p-4 flex flex-col items-start space-y-2 transition-bounce hover:scale-105"
          >
            <span className="font-semibold">{color}</span>
            <span className="text-xs text-left opacity-75">
              {SOIL_COLOR_INFO[color as keyof typeof SOIL_COLOR_INFO]}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Soil color indicates organic matter content and mineral composition.
        </p>
      </div>
    </div>
  );
};