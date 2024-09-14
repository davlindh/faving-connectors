import React from 'react';
import { useImpactMetrics } from '@/integrations/supabase';

const ProjectProgress = ({ projectId, completed, total }) => {
  const { data: impactMetrics, isLoading, error } = useImpactMetrics(projectId);

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  if (isLoading) return <div className="text-center py-2">Loading project progress...</div>;
  if (error) return <div className="text-center text-red-500 py-2">Error loading project progress: {error.message}</div>;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
        <span className="text-sm font-medium mb-1 sm:mb-0">Project Progress</span>
        <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {completed} of {total} milestones completed
      </div>
      {impactMetrics && impactMetrics.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Impact Metrics:</h4>
          <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-2">
            {impactMetrics.map((metric, index) => (
              <li key={index} className="text-sm">
                {metric.metric_name}: {metric.value} {metric.unit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;
