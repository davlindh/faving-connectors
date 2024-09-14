import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      'web-development': 'bg-blue-500 text-white',
      'mobile-app': 'bg-green-500 text-white',
      'design': 'bg-purple-500 text-white',
      'writing': 'bg-yellow-500 text-black',
      'marketing': 'bg-pink-500 text-white'
    };
    return colors[category] || 'bg-gray-500 text-white';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-t-4 border-primary">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge className={`${getCategoryColor(category)} font-semibold text-sm px-3 py-1 rounded-full transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
              {category || 'Uncategorized'}
            </Badge>
            <Badge variant="outline" className="font-medium text-sm">
              <Clock className="w-3 h-3 mr-1" />
              {calculateDuration()}
            </Badge>
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
            <Link to={`/projects/${project_id}`} className="hover:underline hover:text-primary transition-colors duration-300">
              {project_name || 'Untitled Project'}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.p 
            className={`text-gray-600 dark:text-gray-300 ${isHovered ? '' : 'line-clamp-3'}`}
            animate={{ height: isHovered ? 'auto' : '4.5em' }}
            transition={{ duration: 0.3 }}
          >
            {description || 'No description available'}
          </motion.p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <motion.div 
              className="flex items-center text-green-600 dark:text-green-400"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              <span className="font-medium">{budget ? `$${budget.toLocaleString()}` : 'Budget not set'}</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-blue-600 dark:text-blue-400"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(start_date)}</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-red-600 dark:text-red-400"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{location || 'Location not set'}</span>
            </motion.div>
            <motion.div 
              className="flex items-center text-purple-600 dark:text-purple-400"
              whileHover={{ scale: 1.05, x: 5 }}
            >
              <Users className="w-4 h-4 mr-2" />
              <span>{interested_users ? interested_users.length : 0} interested</span>
            </motion.div>
          </div>
          {required_skills && required_skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Required Skills:</h4>
              <div className="flex flex-wrap gap-1">
                {required_skills.slice(0, 3).map((skill, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground transition-colors duration-300 hover:bg-primary hover:text-white"
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
                {required_skills.length > 3 && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Badge 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground transition-colors duration-300 hover:bg-primary hover:text-white"
                    >
                      +{required_skills.length - 3} more
                    </Badge>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <Button asChild className="w-full group hover:bg-primary hover:text-white transition-colors duration-300">
            <Link to={`/projects/${project_id}`}>
              View Details
              <motion.div
                className="inline-block ml-2"
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </motion.div>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProjectCard;
