import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Users, ArrowRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  if (!project) return null;

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
    const diffDays = differenceInDays(end, start);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'web-development': 'bg-blue-100 text-blue-800',
      'mobile-app': 'bg-green-100 text-green-800',
      'design': 'bg-purple-100 text-purple-800',
      'writing': 'bg-yellow-100 text-yellow-800',
      'marketing': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 border-t-4 border-primary">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start mb-2">
            <Badge className={`${getCategoryColor(category)} font-semibold transition-all duration-300 group-hover:scale-110`}>
              {category || 'Uncategorized'}
            </Badge>
            <Badge variant="outline" className="font-medium">
              <Clock className="w-3 h-3 mr-1" />
              {calculateDuration()}
            </Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            <Link to={`/projects/${project_id}`} className="hover:underline">
              {project_name || 'Untitled Project'}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {description || 'No description available'}
          </p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center text-gray-600 group-hover:text-green-600 transition-colors duration-300">
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-medium">{budget ? `$${budget.toLocaleString()}` : 'Budget not set'}</span>
            </div>
            <div className="flex items-center text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(start_date)}</span>
            </div>
            <div className="flex items-center text-gray-600 group-hover:text-red-600 transition-colors duration-300">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{location || 'Location not set'}</span>
            </div>
            <div className="flex items-center text-gray-600 group-hover:text-purple-600 transition-colors duration-300">
              <Users className="w-4 h-4 mr-2" />
              <span>{interested_users ? interested_users.length : 0} interested</span>
            </div>
          </div>
          {required_skills && required_skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Required Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {required_skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-800 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {skill}
                  </Badge>
                ))}
                {required_skills.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-800 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    +{required_skills.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <Button asChild className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Link to={`/projects/${project_id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;