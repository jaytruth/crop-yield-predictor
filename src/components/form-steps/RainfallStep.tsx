import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { CloudRain } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';

interface RainfallStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

export const RainfallStep: React.FC<RainfallStepProps> = ({ value, onChange, onNext }) => {
  const rainfallValue = value.rainfall || 0;

  const handleSliderChange = (values: number[]) => {
    onChange('rainfall', values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0;
    onChange('rainfall', Math.max(0, Math.min(3000, val)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof value.rainfall === 'number' && value.rainfall >= 0) {
      onNext();
    }
  };

  const getRainfallLevel = (r: number) => {
    if (r < 400) return { level: 'Low', color: 'text-destructive', advice: 'Irrigation required' };
    if (r < 800) return { level: 'Moderate', color: 'text-yellow-600', advice: 'Supplemental irrigation may be needed' };
    if (r < 1500) return { level: 'Good', color: 'text-accent', advice: 'Adequate rainfall for most crops' };
    if (r < 2000) return { level: 'High', color: 'text-primary', advice: 'Excellent water availability' };
    return { level: 'Very High', color: 'text-blue-600', advice: 'Consider drainage management' };
  };

  const rainfallInfo = getRainfallLevel(rainfallValue);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <CloudRain className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Enter the annual rainfall in your area (millimeters per year).
        </p>
      </div>
      
      <div className="space-y-4">
        <Label htmlFor="rainfall" className="text-sm font-medium">
          Annual Rainfall (mm)
        </Label>
        
        <div className="space-y-4">
          <Slider
            value={[rainfallValue]}
            onValueChange={handleSliderChange}
            max={2500}
            min={0}
            step={50}
            className="w-full"
          />
          
          <Input
            id="rainfall"
            type="number"
            placeholder="Enter annual rainfall"
            value={rainfallValue}
            onChange={handleInputChange}
            min="0"
            max="3000"
            className="text-lg p-4 transition-smooth focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Rainfall Level:</span>
            <span className={`text-sm font-bold ${rainfallInfo.color}`}>
              {rainfallInfo.level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {rainfallInfo.advice}
          </p>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Most crops need 500-1500mm annual rainfall. Consider your local climate patterns.
        </p>
      </div>
    </form>
  );
};