import React from 'react';
import { Slider } from "@/components/ui/slider";

const ECKTSlider = ({ value, onChange }) => {
  return (
    <div className="w-full max-w-sm">
      <h3 className="font-semibold mb-2">ECKT Slider</h3>
      <Slider
        defaultValue={[value]}
        max={100}
        step={1}
        onValueChange={(values) => onChange(values[0])}
      />
      <div className="flex justify-between mt-2">
        <span>Effort</span>
        <span>Creativity</span>
        <span>Knowledge</span>
        <span>Time</span>
      </div>
    </div>
  );
};

export default ECKTSlider;