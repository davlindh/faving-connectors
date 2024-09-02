import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  if (!project) {
    return null; // Or return a placeholder card
  }

  const {
    project_id,
    project_name,
    category,
    description,
    budget,
    start_date,
    duration,
    location,
    required_skills = [],
    interested_users = []
  } = project;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{project_name || 'Untitled Project'}</CardTitle>
        {category && <Badge variant="secondary">{category}</Badge>}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">{description ? `${description.slice(0, 100)}...` : 'No description available'}</p>
        <div className="grid grid-cols-2 gap-2">
          {budget !== undefined && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-semibold">${budget}</span>
            </div>
          )}
          {start_date && (
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="font-semibold">{new Date(start_date).toLocaleDateString()}</span>
            </div>
          )}
          {duration !== undefined && (
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span className="font-semibold">{duration} days</span>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="font-semibold">{location}</span>
            </div>
          )}
        </div>
        {required_skills.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {required_skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline">{skill}</Badge>
              ))}
              {required_skills.length > 3 && (
                <Badge variant="outline">+{required_skills.length - 3} more</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          <Users className="w-4 h-4 mr-2" />
          <span>{interested_users.length} interested</span>
        </div>
        <Button asChild>
          <Link to={`/projects/${project_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;