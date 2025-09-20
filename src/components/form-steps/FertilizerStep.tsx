import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';
import { AgriculturalData, FERTILIZERS } from '@/types/agriculture';

interface FertilizerStepProps {
  value: Partial<AgriculturalData>;
  onChange: (field: keyof AgriculturalData, value: any) => void;
  onNext: () => void;
}

const FERTILIZER_INFO = {
  'NPK (20-20-20)': 'Balanced fertilizer for all-round growth',
  'Urea (46-0-0)': 'High nitrogen for leaf development',
  'DAP (18-46-0)': 'High phosphorus for root growth',
  'Potash (0-0-60)': 'High potassium for fruit quality',
  'Complex (12-32-16)': 'Balanced with emphasis on phosphorus',
  'Organic Compost': 'Natural organic matter and nutrients'
};

export const FertilizerStep: React.FC<FertilizerStepProps> = ({ value, onChange, onNext }) => {
  const handleSelection = (fertilizer: string) => {
    onChange('fertilizer', fertilizer);
    setTimeout(() => onNext(), 300);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Beaker className="w-16 h-16 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground">
          Select the type of fertilizer you are using or plan to use.
        </p>
      </div>
      
      <div className="space-y-3">
        {FERTILIZERS.map((fertilizer) => (
          <Button
            key={fertilizer}
            onClick={() => handleSelection(fertilizer)}
            variant={value.fertilizer === fertilizer ? "default" : "outline"}
            className="w-full h-auto p-4 flex flex-col items-start space-y-2 transition-bounce hover:scale-[1.02]"
          >
            <span className="font-semibold">{fertilizer}</span>
            <span className="text-xs text-left opacity-75">
              {FERTILIZER_INFO[fertilizer as keyof typeof FERTILIZER_INFO]}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tip:</strong> Choose fertilizer based on your soil test results and crop requirements.
        </p>
      </div>
    </div>
  );
};