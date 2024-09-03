import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  project_id: string;
  project_name: string;
  description: string;
  category: string;
  budget: number;
  start_date: string;
  end_date: string;
}

interface ProjectListProps {
  projects: Project[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Link href={`/projects/${project.project_id}`} key={project.project_id}>
          <Card className="h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>{project.project_name}</CardTitle>
              <Badge>{project.category}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">{project.description.substring(0, 100)}...</p>
              <p className="text-sm font-semibold">Budget: ${project.budget}</p>
              <p className="text-sm">Start: {new Date(project.start_date).toLocaleDateString()}</p>
              <p className="text-sm">End: {new Date(project.end_date).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ProjectList;