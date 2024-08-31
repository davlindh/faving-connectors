import React from 'react';
import { useProjects } from '@/integrations/supabase';
import ProjectCard from '@/components/project/ProjectCard.jsx';

const Index = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Faving</h1>
      <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.slice(0, 6).map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Index;