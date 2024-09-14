import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProject, useProjectTasks, useProjectMilestones } from '@/integrations/supabase';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children, projectId }) => {
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useProjectTasks(projectId);
  const { data: milestones, isLoading: milestonesLoading, error: milestonesError } = useProjectMilestones(projectId);

  const [completedTasks, setCompletedTasks] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState(0);

  useEffect(() => {
    if (tasks) {
      setCompletedTasks(tasks.filter(task => task.is_completed).length);
    }
    if (milestones) {
      setCompletedMilestones(milestones.filter(milestone => milestone.is_completed).length);
    }
  }, [tasks, milestones]);

  const value = {
    project,
    tasks,
    milestones,
    completedTasks,
    totalTasks: tasks?.length || 0,
    completedMilestones,
    totalMilestones: milestones?.length || 0,
    isLoading: projectLoading || tasksLoading || milestonesLoading,
    error: projectError || tasksError || milestonesError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
