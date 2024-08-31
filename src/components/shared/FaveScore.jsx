import React from 'react';
import { Progress } from "@/components/ui/progress";

const FaveScore = ({ score }) => {
  return (
    <div className="flex items-center">
      <span className="font-semibold mr-2">Fave Score:</span>
      <Progress value={score} className="w-24" />
      <span className="ml-2">{score}%</span>
    </div>
  );
};

export default FaveScore;