import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ECKTSlider = ({ value, onChange, readOnly = false }) => {
  const categories = ['Effort', 'Creativity', 'Knowledge', 'Time'];

  const handleSliderChange = (newValue, index) => {
    if (!readOnly) {
      const updatedValues = [...value];
      updatedValues[index] = newValue[0];
      onChange(updatedValues);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="font-semibold mb-4">ECKT Score</h3>
      <div className="space-y-6">
        {categories.map((category, index) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{category}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-bold">{value[index]}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category} Score: {value[index]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[value[index]]}
              onValueChange={(newValue) => handleSliderChange(newValue, index)}
              max={100}
              step={1}
              className="w-full"
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ECKTSlider;