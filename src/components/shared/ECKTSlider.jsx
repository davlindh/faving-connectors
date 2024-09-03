import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ECKTSlider = ({ value, feedback, onChange, readOnly = false }) => {
  const categories = ['Effort', 'Creativity', 'Knowledge', 'Time'];
  const [localValue, setLocalValue] = useState(value);
  const [localFeedback, setLocalFeedback] = useState(feedback);

  const handleSliderChange = (newValue, index) => {
    if (!readOnly) {
      const updatedValues = [...localValue];
      updatedValues[index] = newValue[0];
      setLocalValue(updatedValues);
    }
  };

  const handleFeedbackChange = (e) => {
    setLocalFeedback(e.target.value);
  };

  const handleSubmit = () => {
    onChange(localValue, localFeedback);
  };

  return (
    <div className="w-full max-w-lg">
      <h3 className="font-semibold mb-4">ECKT Score & Feedback</h3>
      <div className="space-y-6 mb-6">
        {categories.map((category, index) => (
          <div key={category} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{category}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm font-bold">{localValue[index]}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{category} Score: {localValue[index]}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Slider
              value={[localValue[index]]}
              onValueChange={(newValue) => handleSliderChange(newValue, index)}
              max={100}
              step={1}
              className="w-full"
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <label htmlFor="feedback" className="text-sm font-medium">Feedback</label>
        <Textarea
          id="feedback"
          placeholder="Provide your feedback here..."
          value={localFeedback}
          onChange={handleFeedbackChange}
          rows={4}
          disabled={readOnly}
        />
      </div>
      {!readOnly && (
        <Button onClick={handleSubmit} className="mt-4">
          Save ECKT & Feedback
        </Button>
      )}
    </div>
  );
};

export default ECKTSlider;