import React from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, User } from 'lucide-react';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) return <div>Loading project details...</div>;
  if (error) return <div>Error loading project: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">{project.project_name}</CardTitle>
            <Badge variant="secondary">{project.category}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{project.description}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span className="font-semibold">Budget: ${project.budget}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-semibold">Start: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className="font-semibold">Duration: {project.duration} days</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-semibold">Location: {project.location}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Required Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {project.required_skills.map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Project Creator:</h3>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{project.creator_name}</span>
            </div>
          </div>
          
          <Button className="w-full">Apply for Project</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;
