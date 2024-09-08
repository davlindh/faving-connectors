import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, MapPin, User, ArrowLeft, Edit, Trash, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore';
import ExpressInterestButton from './ExpressInterestButton';
import ImpactMetricForm from './ImpactMetricForm';
import ECKTSlider from '../shared/ECKTSlider';
import { format } from 'date-fns';
import TasksTab from './ProjectDetailTabs/TasksTab';
import TeamTab from './ProjectDetailTabs/TeamTab';
import OverviewTab from './ProjectDetailTabs/OverviewTab';
import ImpactTab from './ProjectDetailTabs/ImpactTab';
import FeedbackTab from './ProjectDetailTabs/FeedbackTab';

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
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <OverviewTab project={project} />
            </TabsContent>
            <TabsContent value="team">
              <TeamTab project={project} isOwner={isOwner} />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksTab project={project} isOwner={isOwner} />
            </TabsContent>
            <TabsContent value="impact">
              <ImpactTab project={project} />
            </TabsContent>
            <TabsContent value="feedback">
              <FeedbackTab projectId={projectId} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!isOwner && (
            <ExpressInterestButton
              projectId={project.project_id}
              hasExpressedInterest={hasExpressedInterest}
            />
          )}
          <Button asChild>
            <Link to={`/messages?projectId=${project.project_id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contact Project Owner
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;