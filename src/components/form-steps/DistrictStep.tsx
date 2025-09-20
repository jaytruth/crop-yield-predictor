import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';
import { AgriculturalData } from '@/types/agriculture';

interface DistrictStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

export const DistrictStep: React.FC<DistrictStepProps> = ({ value, onChange, onNext }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.district && value.district.trim()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <MapPin className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Enter the name of your district to help us provide location-specific recommendations.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="district" className="text-sm font-medium">
          District Name
        </Label>
        <Input
          id="district"
          type="text"
          placeholder="e.g., Pune, Mumbai, Delhi"
          value={value.district || ''}
          onChange={(e) => onChange('district', e.target.value)}
          className="text-lg p-4 transition-smooth focus:ring-2 focus:ring-primary/20"
          autoFocus
        />
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> District information helps us consider local climate patterns and soil characteristics.
        </p>
      </div>
    </form>
  );
};