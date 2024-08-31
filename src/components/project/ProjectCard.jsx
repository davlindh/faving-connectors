import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{project.project_name}</CardTitle>
        <Badge variant="secondary">{project.category}</Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex items-center mb-2">
          <DollarSign className="w-4 h-4 mr-2" />
          <span className="font-semibold">Budget: ${project.budget}</span>
        </div>
        <div className="flex items-center mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-semibold">Start: {new Date(project.start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span className="font-semibold">Duration: {project.duration} days</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/projects/${project.project_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
