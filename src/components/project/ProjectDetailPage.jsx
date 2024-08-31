import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ProjectDetailPage = ({ project }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="mb-4">
            <h3 className="font-semibold">Requirements:</h3>
            <ul className="list-disc list-inside">
              {project.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
          <p className="font-semibold">Budget: ${project.budget}</p>
          <p className="font-semibold">Timeline: {project.timeline}</p>
          <Button className="mt-6">Apply for Project</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;