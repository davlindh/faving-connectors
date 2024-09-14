import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  if (!project) return null;

  const {
    project_id,
    project_name,
    category,
    description,
    budget,
    start_date,
    location,
    required_skills = [],
    interested_users = []
  } = project;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge>{category}</Badge>
          <DollarSign className="text-green-500" />
        </div>
        <CardTitle className="mt-2">{project_name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatDate(start_date)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{location || 'Remote'}</span>
          </div>
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            <span>{budget ? `$${budget}` : 'Not set'}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            <span>{interested_users.length} interested</span>
          </div>
        </div>
        {required_skills.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold mb-2">Required Skills:</p>
            <div className="flex flex-wrap gap-1">
              {required_skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {required_skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{required_skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/projects/${project_id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
