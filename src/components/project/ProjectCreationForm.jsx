import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const ProjectCreationForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement project creation logic
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Fill in the details for your new project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="title" placeholder="Project Title" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Textarea id="description" placeholder="Project Description" />
            </div>
            {/* TODO: Add fields for project requirements, budget, timeline, etc. */}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Create Project</Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCreationForm;