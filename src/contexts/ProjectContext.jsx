import React, { createContext, useContext, useState } from 'react';
import { useProjects } from '@/integrations/supabase';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const { data: projects, isLoading, error } = useProjects();
  const [filters, setFilters] = useState({
    category: '',
    minBudget: 0,
    maxBudget: Infinity,
    skills: [],
  });
  const [sortBy, setSortBy] = useState('latest');

  const filteredProjects = projects?.filter(project => {
    return (
      (!filters.category || project.category === filters.category) &&
      project.budget >= filters.minBudget &&
      project.budget <= filters.maxBudget &&
      (filters.skills.length === 0 || filters.skills.every(skill => project.required_skills.includes(skill)))
    );
  }) || [];

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
    if (sortBy === 'budget-high-to-low') return b.budget - a.budget;
    if (sortBy === 'budget-low-to-high') return a.budget - b.budget;
    return 0;
  });

  const value = {
    projects: sortedProjects,
    isLoading,
    error,
    filters,
    setFilters,
    sortBy,
    setSortBy,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};