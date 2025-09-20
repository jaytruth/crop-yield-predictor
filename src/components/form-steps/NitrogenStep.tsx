import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Leaf } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';

interface NitrogenStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

export const NitrogenStep: React.FC<NitrogenStepProps> = ({ value, onChange, onNext }) => {
  const nitrogenValue = value.nitrogen || 0;

  const handleSliderChange = (values: number[]) => {
    onChange('nitrogen', values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange('nitrogen', Math.max(0, Math.min(500, val)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof value.nitrogen === 'number' && value.nitrogen >= 0) {
      onNext();
    }
  };

  const getNitrogenLevel = (n: number) => {
    if (n < 50) return { level: 'Low', color: 'text-destructive', advice: 'Consider nitrogen-rich fertilizers' };
    if (n < 150) return { level: 'Medium', color: 'text-yellow-600', advice: 'Balanced fertilization recommended' };
    if (n < 250) return { level: 'Good', color: 'text-accent', advice: 'Optimal nitrogen levels' };
    return { level: 'High', color: 'text-primary', advice: 'Monitor for over-fertilization' };
  };

  const nitrogenInfo = getNitrogenLevel(nitrogenValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Leaf className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Enter the nitrogen content in your soil (ppm - parts per million).
        </p>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="nitrogen" className="text-sm font-medium">
          Nitrogen Content (ppm)
        </Label>
        
        <div className="space-y-4">
          <Slider
            value={[nitrogenValue]}
            onValueChange={handleSliderChange}
            max={400}
            min={0}
            step={5}
            className="w-full"
          />
          
          <Input
            id="nitrogen"
            type="number"
            placeholder="Enter nitrogen content"
            value={nitrogenValue}
            onChange={handleInputChange}
            min="0"
            max="500"
            className="text-lg p-4 transition-smooth focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Nitrogen Level:</span>
            <span className={`text-sm font-bold ${nitrogenInfo.color}`}>
              {nitrogenInfo.level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {nitrogenInfo.advice}
          </p>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Nitrogen is essential for leaf growth and green color. Optimal levels: 100-200 ppm.
        </p>
      </div>
    </form>
  );
};