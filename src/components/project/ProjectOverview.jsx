import React from 'react';
import { DollarSign, Calendar, MapPin } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const ProjectOverview = ({ project }) => (
  <div className="space-y-4">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h3 className="text-xl font-semibold">Project Overview</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center">
        <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
        <span>Budget: ${project.budget}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
        <span>Start Date: {format(new Date(project.start_date), 'PP')}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-gray-500" />
        <span>End Date: {format(new Date(project.end_date), 'PP')}</span>
      </div>
      <div className="flex items-center">
        <MapPin className="mr-2 h-5 w-5 text-gray-500" />
        <span>Location: {project.location}</span>
      </div>
    </div>
    <div>
      <h4 className="font-semibold mb-2">Required Skills:</h4>
      <div className="flex flex-wrap gap-2">
        {project.required_skills.map((skill, index) => (
          <Badge key={index} variant="secondary">{skill}</Badge>
        ))}
      </div>
    </div>
  </div>
);

export default ProjectOverview;