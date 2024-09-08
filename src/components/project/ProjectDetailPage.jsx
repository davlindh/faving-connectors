import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, MapPin, User, ArrowLeft, Edit, Trash, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore';
import ExpressInterestButton from './ExpressInterestButton';
import ImpactMetricForm from './ImpactMetricForm';
import ECKTSlider from '../shared/ECKTSlider';
import { format } from 'date-fns';
import TaskList from './TaskList';
import MilestoneList from './MilestoneList';
import TeamMemberList from './TeamMemberList';

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

  const OverviewTab = ({ project }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Overview</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <FaveScore score={project.fave_score || 0} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
          <span>Budget: ${project.budget}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-gray-500" />
          <span>Start Date: {format(new Date(project.start_date), 'PP')}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-gray-500" />
          <span>End Date: {format(new Date(project.end_date), 'PP')}</span>
        </div>
        <div className="flex items-center">
          <MapPin className="mr-2 h-5 w-5 text-gray-500" />
          <span>Location: {project.location}</span>
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Required Skills:</h4>
        <div className="flex flex-wrap gap-2">
          {project.required_skills.map((skill, index) => (
            <Badge key={index} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Project Progress:</h4>
        <Progress value={project.progress || 0} className="w-full" />
      </div>
    </div>
  );

  const TeamTab = ({ project, isOwner }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Team Members</h3>
      <TeamMemberList project={project} isOwner={isOwner} />
    </div>
  );

  const TasksTab = ({ project, isOwner }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Project Tasks</h3>
      <TaskList project={project} isOwner={isOwner} />
    </div>
  );

  const MilestonesTab = ({ project, isOwner }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Project Milestones</h3>
      <MilestoneList project={project} isOwner={isOwner} />
    </div>
  );

  const ImpactTab = ({ project }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Impact Metrics</h3>
      {project.impact_metrics && project.impact_metrics.length > 0 ? (
        project.impact_metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h4 className="font-semibold">{metric.description}</h4>
              <Progress value={metric.impact_score} className="mt-2" />
              <p className="text-sm text-gray-600 mt-1">Impact Score: {metric.impact_score}%</p>
            </CardContent>
          </Card>
        ))
      ) : (
        <p>No impact metrics recorded yet.</p>
      )}
      <ImpactMetricForm projectId={project.project_id} />
    </div>
  );

  const FeedbackTab = ({ projectId }) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Project Feedback</h3>
      <ECKTSlider origin={`project_${projectId}`} />
    </div>
  );

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
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="milestones">Milestones</TabsTrigger>
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
            <TabsContent value="milestones">
              <MilestonesTab project={project} isOwner={isOwner} />
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