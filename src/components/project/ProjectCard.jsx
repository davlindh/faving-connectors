import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  if (!project) {
    return null;
  }

  const {
    project_id,
    project_name,
    category,
    description,
    budget,
    start_date,
    end_date,
    location,
    required_skills = [],
    interested_users = []
  } = project;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const calculateDuration = () => {
    if (!start_date || !end_date) return 'Duration not set';
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{category || 'Uncategorized'}</Badge>
          <Badge variant="outline">{calculateDuration()}</Badge>
        </div>
        <CardTitle className="text-xl line-clamp-2">{project_name || 'Untitled Project'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {description || 'No description available'}
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
            <span>{budget ? `$${budget.toLocaleString()}` : 'Budget not set'}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span>{formatDate(start_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            <span>{formatDate(end_date)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            <span className="truncate">{location || 'Location not set'}</span>
          </div>
        </div>
        {required_skills && required_skills.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Required Skills:</h4>
            <div className="flex flex-wrap gap-1">
              {required_skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">{skill}</Badge>
              ))}
              {required_skills.length > 3 && (
                <Badge variant="outline" className="text-xs">+{required_skills.length - 3} more</Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-2" />
          <span>{interested_users ? interested_users.length : 0} interested</span>
        </div>
        <Button asChild size="sm">
          <Link to={`/projects/${project_id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;