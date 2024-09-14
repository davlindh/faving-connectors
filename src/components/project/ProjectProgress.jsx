import React from 'react';
import { Progress } from "@/components/ui/progress";

const ProjectProgress = ({ completed, total }) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Project Progress</span>
        <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <Progress value={percentage} className="w-full" />
      <div className="text-xs text-gray-500 mt-1">
        {completed} of {total} milestones completed
      </div>
    </div>
  );
};

export default ProjectProgress;
