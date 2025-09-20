import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Zap } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';

interface PhosphorousStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

export const PhosphorousStep: React.FC<PhosphorousStepProps> = ({ value, onChange, onNext }) => {
  const phosphorousValue = value.phosphorous || 0;

  const handleSliderChange = (values: number[]) => {
    onChange('phosphorous', values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange('phosphorous', Math.max(0, Math.min(200, val)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof value.phosphorous === 'number' && value.phosphorous >= 0) {
      onNext();
    }
  };

  const getPhosphorousLevel = (p: number) => {
    if (p < 20) return { level: 'Low', color: 'text-destructive', advice: 'Add phosphate fertilizers' };
    if (p < 40) return { level: 'Medium', color: 'text-yellow-600', advice: 'Moderate phosphorus application needed' };
    if (p < 80) return { level: 'Good', color: 'text-accent', advice: 'Optimal phosphorus levels' };
    return { level: 'High', color: 'text-primary', advice: 'Sufficient phosphorus available' };
  };

  const phosphorousInfo = getPhosphorousLevel(phosphorousValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <Zap className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Enter the phosphorous content in your soil (ppm - parts per million).
        </p>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="phosphorous" className="text-sm font-medium">
          Phosphorous Content (ppm)
        </Label>
        
        <div className="space-y-4">
          <Slider
            value={[phosphorousValue]}
            onValueChange={handleSliderChange}
            max={150}
            min={0}
            step={2}
            className="w-full"
          />
          
          <Input
            id="phosphorous"
            type="number"
            placeholder="Enter phosphorous content"
            value={phosphorousValue}
            onChange={handleInputChange}
            min="0"
            max="200"
            className="text-lg p-4 transition-smooth focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Phosphorous Level:</span>
            <span className={`text-sm font-bold ${phosphorousInfo.color}`}>
              {phosphorousInfo.level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {phosphorousInfo.advice}
          </p>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Phosphorous promotes root development and flowering. Optimal levels: 30-60 ppm.
        </p>
      </div>
    </form>
  );
};