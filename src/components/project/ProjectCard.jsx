import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectCard = ({ project }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <p className="font-semibold">Budget: ${project.budget}</p>
        <p className="font-semibold">Timeline: {project.timeline}</p>
        <Button className="mt-4">View Details</Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;