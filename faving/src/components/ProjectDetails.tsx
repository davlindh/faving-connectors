import React from 'react';
import { Project } from '@/types/project';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import ExpressInterestButton from './ExpressInterestButton';

interface ProjectDetailsProps {
  project: Project;
  currentUserId: string | undefined;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, currentUserId }) => {
  const isCreator = currentUserId === project.creator.user_id;
  const hasExpressedInterest = project.interested_users.some(user => user.user_id === currentUserId);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Badge>{project.category}</Badge>
            <CardTitle className="mt-2 text-3xl">{project.project_name}</CardTitle>
          </div>
          {!isCreator && (
            <ExpressInterestButton
              projectId={project.project_id}
              hasExpressedInterest={hasExpressedInterest}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-6">{project.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <DollarSign className="mr-2" />
            <span>Budget: ${project.budget}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2" />
            <span>Start Date: {new Date(project.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-2" />
            <span>End Date: {new Date(project.end_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2" />
            <span>Location: {project.location}</span>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {project.required_skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Creator</h3>
          <p>{project.creator.first_name} {project.creator.last_name}</p>
          <p className="text-gray-600">{project.creator.email}</p>
        </div>
        <div className="mt-6 flex items-center">
          <Users className="mr-2" />
          <span>{project.interested_users.length} users interested</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;