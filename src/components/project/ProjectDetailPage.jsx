import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, MapPin, User, ArrowLeft, Edit, Trash, Star } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/projects" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2" /> Back to Projects
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">{project.category}</Badge>
              <CardTitle className="text-3xl mb-2">{project.project_name}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{project.location}</span>
              </div>
            </div>
            <FaveScore score={project.fave_score || 0} />
          </div>
          {isOwner && (
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => navigate(`/projects/edit/${projectId}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Project
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" /> Delete Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="space-y-4">
                <p className="text-gray-600">{project.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Budget: ${project.budget}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Start Date: {new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">End Date: {new Date(project.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span className="font-semibold">Status: {project.status}</span>
                  </div>
                </div>
                {project.required_skills && project.required_skills.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.required_skills.map((skill, index) => (
                        <Badge key={index} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold mb-2">Project Creator</h3>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-2">
                      <AvatarImage src={project.creator?.avatar_url} alt={project.creator?.first_name} />
                      <AvatarFallback>{project.creator?.first_name?.[0]}{project.creator?.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{project.creator?.first_name} {project.creator?.last_name}</p>
                      <p className="text-sm text-gray-500">{project.creator?.organization}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="impact">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Impact Metrics</h3>
                {project.impact_metrics && project.impact_metrics.map((metric, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{metric.name}</span>
                    <Progress value={metric.value} max={metric.target} className="w-1/2" />
                    <span>{metric.value}/{metric.target}</span>
                  </div>
                ))}
                {project.success_stories && (
                  <div>
                    <h3 className="text-xl font-semibold mt-6 mb-2">Success Stories</h3>
                    {project.success_stories.map((story, index) => (
                      <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4 italic">
                        "{story}"
                      </blockquote>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="team">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Team Members</h3>
                {project.team_members && project.team_members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar_url} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="tasks">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Project Tasks</h3>
                {project.tasks && project.tasks.map((task, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{task.description}</p>
                      <p className="text-sm text-gray-500 mt-2">Assigned to: {task.assignee}</p>
                      <p className="text-sm text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resources">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Project Resources</h3>
                {project.resources && project.resources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{resource.name}</span>
                    <Button asChild variant="link">
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Join Project</Button>
          <Button>Support Project</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;