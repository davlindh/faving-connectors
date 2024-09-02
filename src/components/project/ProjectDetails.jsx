import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, User } from 'lucide-react';

const ProjectDetails = ({ project }) => {
  const calculateProgress = () => {
    if (!project.start_date || !project.end_date) return 0;
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const today = new Date();
    const totalDuration = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  return (
    <div className="space-y-6">
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
          <span className="font-semibold">End Date: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</span>
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

      <div>
        <h3 className="text-xl font-semibold mb-2">Project Progress</h3>
        <Progress value={calculateProgress()} className="w-full" />
        <p className="text-sm text-gray-500 mt-1">{Math.round(calculateProgress())}% Complete</p>
      </div>

      {project.applications && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Applications</h3>
          <span>{project.applications.length} application(s) received</span>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;