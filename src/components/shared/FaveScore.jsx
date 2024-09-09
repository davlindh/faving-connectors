import React from 'react';
import { Star } from "lucide-react";

const FaveScore = ({ score }) => {
  const starCount = Math.round(score / 20); // Convert score to 0-5 scale

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center mb-2">
        <span className="font-semibold mr-2">Fave Score:</span>
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${index < starCount ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      <span className="mt-1">{score}%</span>
    </div>
  );
};

export default FaveScore;