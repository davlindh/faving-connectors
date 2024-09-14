import React from 'react';
import ProjectCard from '@/components/project/ProjectCard';

const TeamProjects = ({ projects }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Projects</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>
    {projects?.length === 0 && <p>No projects found for this team.</p>}
  </div>
);

export default TeamProjects;