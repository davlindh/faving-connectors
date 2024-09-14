import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useDeleteProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, DollarSign, MapPin, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { ProjectProvider } from '@/contexts/ProjectContext';
import ProjectProgress from './ProjectProgress';
import ProjectOverview from './ProjectOverview';
import TaskList from './TaskList';
import TeamManagement from '../team/TeamManagement';
import MilestoneManagement from './MilestoneManagement';
import ImpactMetricForm from './ImpactMetricForm';
import ECKTSlider from '../shared/ECKTSlider';
import ResourcesTab from './ResourcesTab';
import ExpressInterestButton from './ExpressInterestButton';
import ProjectForm from './ProjectForm';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;
  const hasExpressedInterest = project.interested_users?.some(user => user.user_id === session?.user?.id);

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setActiveTab('overview');
  };

  return (
    <ProjectProvider projectId={projectId}>
      <div className="max-w-4xl mx-auto p-4">
        <Link to="/projects" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" /> Back to Projects
        </Link>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <Badge variant="secondary" className="mb-2">{project.category}</Badge>
                <CardTitle className="text-2xl sm:text-3xl mb-2">{project.project_name}</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{project.location}</span>
                </div>
              </div>
              {isOwner && (
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={handleEditToggle}>
                    {isEditing ? 'Cancel Edit' : 'Edit Project'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Delete Project</Button>
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
            </div>
          </CardHeader>
          <CardContent>
            <ProjectProgress />
            {isEditing ? (
              <ProjectForm
                project={project}
                onSuccess={() => {
                  setIsEditing(false);
                  toast.success('Project updated successfully');
                }}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="tasks">Tasks</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="milestones">Milestones</TabsTrigger>
                  <TabsTrigger value="impact">Impact</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview"><ProjectOverview project={project} /></TabsContent>
                <TabsContent value="tasks"><TaskList /></TabsContent>
                <TabsContent value="team"><TeamManagement projectId={project.project_id} isOwner={isOwner} /></TabsContent>
                <TabsContent value="milestones"><MilestoneManagement /></TabsContent>
                <TabsContent value="impact"><ImpactMetricForm projectId={project.project_id} /></TabsContent>
                <TabsContent value="feedback"><ECKTSlider origin={`project_${projectId}`} /></TabsContent>
                <TabsContent value="resources"><ResourcesTab resources={project.resources} /></TabsContent>
              </Tabs>
            )}
          </CardContent>
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
        </Card>
      </div>
    </ProjectProvider>
  );
};

export default ProjectDetailPage;
