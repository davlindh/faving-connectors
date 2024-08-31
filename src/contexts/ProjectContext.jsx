import React, { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    category: '',
    minBudget: 0,
    maxBudget: Infinity,
    skills: [],
  });

  const [sortBy, setSortBy] = useState('latest');

  const value = {
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