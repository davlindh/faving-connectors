import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, User, ArrowLeft } from 'lucide-react';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const { data: project, isLoading, error } = useProject(projectId);

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/projects" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2" /> Back to Projects
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">{project.project_name || 'Untitled Project'}</CardTitle>
            {project.category && <Badge variant="secondary">{project.category}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{project.description || 'No description available'}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Budget: {project.budget ? `$${project.budget}` : 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Start Date: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Duration: {project.duration ? `${project.duration} days` : 'Not specified'}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Location: {project.location || 'Not specified'}</span>
            </div>
          </div>
          
          {project.required_skills && project.required_skills.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Project Creator</h3>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <span>{project.creator_name || 'Anonymous'}</span>
            </div>
          </div>

          {project.end_date && (
            <div>
              <h3 className="text-xl font-semibold mb-2">End Date</h3>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                <span>{new Date(project.end_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {project.interested_users && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Interested Users</h3>
              <span>{project.interested_users.length} user(s) interested</span>
            </div>
          )}
          
          <Button className="w-full mt-4">Apply for Project</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;