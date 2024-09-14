import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProject, useProjectTasks } from '@/integrations/supabase';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children, projectId }) => {
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useProjectTasks(projectId);

  const [completedTasks, setCompletedTasks] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState(0);

  useEffect(() => {
    if (tasks) {
      setCompletedTasks(tasks.filter(task => task.is_completed).length);
    }
  }, [tasks]);

  useEffect(() => {
    if (project && project.milestones) {
      setCompletedMilestones(project.milestones.filter(milestone => milestone.is_completed).length);
    }
  }, [project]);

  const value = {
    project,
    tasks,
    completedTasks,
    totalTasks: tasks?.length || 0,
    completedMilestones,
    totalMilestones: project?.milestones?.length || 0,
    isLoading: projectLoading || tasksLoading,
    error: projectError || tasksError,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
