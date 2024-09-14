import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { MessageSquare } from 'lucide-react';
import ExpressInterestButton from './ExpressInterestButton';

const ProjectActions = ({ project, isOwner }) => {
  const hasExpressedInterest = project.interested_users?.some(user => user.user_id === session?.user?.id);

  return (
    <CardFooter className="flex flex-col sm:flex-row justify-between items-center">
      {!isOwner && (
        <ExpressInterestButton
          projectId={project.project_id}
          hasExpressedInterest={hasExpressedInterest}
        />
      )}
      <Button asChild className="mt-2 sm:mt-0">
        <Link to={`/messages?projectId=${project.project_id}`}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Contact Project Owner
        </Link>
      </Button>
    </CardFooter>
  );
};

export default ProjectActions;