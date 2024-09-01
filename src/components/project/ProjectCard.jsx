import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{project.project_name}</CardTitle>
        <Badge variant="secondary">{project.category}</Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{project.description.slice(0, 100)}...</p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span className="font-semibold">${project.budget}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="font-semibold">{new Date(project.start_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span className="font-semibold">{project.duration} days</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="font-semibold">{project.location}</span>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Required Skills:</h4>
          <div className="flex flex-wrap gap-1">
            {project.required_skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline">{skill}</Badge>
            ))}
            {project.required_skills.length > 3 && (
              <Badge variant="outline">+{project.required_skills.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>{project.interested_users.length} interested</span>
        </div>
        <Button asChild>
          <Link to={`/projects/${project.project_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
