import React from 'react';
import { Progress } from "@/components/ui/progress";

const ProgressCalculator = ({ tasks }) => {
  const calculateProgress = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return (completedTasks / tasks.length) * 100;
  };

  const progress = calculateProgress();

  return (
    <div>
      <h4 className="font-semibold mb-2">Project Progress:</h4>
      <Progress value={progress} className="w-full" />
      <span className="text-sm text-gray-500 mt-1">{progress.toFixed(0)}% Complete</span>
    </div>
  );
};

export default ProgressCalculator;