import React from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import { Progress } from "../ui/progress";

const ProjectProgress = () => {
  const { completedTasks, totalTasks, completedMilestones, totalMilestones } = useProjectContext();

  const taskPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const milestonePercentage = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Tasks Progress</span>
          <span className="text-sm font-medium">{taskPercentage.toFixed(0)}%</span>
        </div>
        <Progress value={taskPercentage} className="w-full" />
        <div className="text-xs text-gray-500 mt-1">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Milestones Progress</span>
          <span className="text-sm font-medium">{milestonePercentage.toFixed(0)}%</span>
        </div>
        <Progress value={milestonePercentage} className="w-full" />
        <div className="text-xs text-gray-500 mt-1">
          {completedMilestones} of {totalMilestones} milestones completed
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;
