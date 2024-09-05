import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject, useTeamMemberRequests, useImpactMetrics, useCreateImpactMetric, useUpdateImpactMetric, useDeleteImpactMetric } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, MapPin, User, ArrowLeft, Edit, Trash, Star, FileText, MessageSquare, UserPlus, Users, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore';
import ExpressInterestButton from './ExpressInterestButton';
import ImpactMetricForm from './ImpactMetricForm';
import TeamManagement from './TeamManagement';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: teamMemberRequests, isLoading: isLoadingRequests } = useTeamMemberRequests(projectId);
  const { data: impactMetrics, isLoading: isLoadingImpactMetrics } = useImpactMetrics(projectId);
  const createImpactMetric = useCreateImpactMetric();
  const updateImpactMetric = useUpdateImpactMetric();
  const deleteImpactMetric = useDeleteImpactMetric();

  if (isLoading || isLoadingImpactMetrics) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;
  const hasExpressedInterest = project.interested_users?.some(user => user.user_id === session?.user?.id);
  const isTeamMember = project.team_members?.some(member => member.user_id === session?.user?.id);

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleCreateImpactMetric = async (newMetric) => {
    try {
      await createImpactMetric.mutateAsync({ ...newMetric, project_id: projectId });
      toast.success('Impact metric created successfully');
    } catch (error) {
      toast.error('Failed to create impact metric');
    }
  };

  const handleUpdateImpactMetric = async (metricId, updates) => {
    try {
      await updateImpactMetric.mutateAsync({ metricId, updates });
      toast.success('Impact metric updated successfully');
    } catch (error) {
      toast.error('Failed to update impact metric');
    }
  };

  const handleDeleteImpactMetric = async (metricId) => {
    try {
      await deleteImpactMetric.mutateAsync(metricId);
      toast.success('Impact metric deleted successfully');
    } catch (error) {
      toast.error('Failed to delete impact metric');
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
              <OverviewTab project={project} />
            </TabsContent>
            <TabsContent value="impact">
              <ImpactTab
                impactMetrics={impactMetrics}
                isOwner={isOwner}
                onCreateMetric={handleCreateImpactMetric}
                onUpdateMetric={handleUpdateImpactMetric}
                onDeleteMetric={handleDeleteImpactMetric}
                projectId={projectId}
              />
            </TabsContent>
            <TabsContent value="team">
              <TeamManagement projectId={projectId} />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksTab project={project} />
            </TabsContent>
            <TabsContent value="resources">
              <ResourcesTab project={project} />
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

const OverviewTab = ({ project }) => (
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
      <Card>
        <CardContent className="flex items-center p-4">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={project.creator?.profile?.avatar_url} alt={`${project.creator?.profile?.first_name} ${project.creator?.profile?.last_name}`} />
            <AvatarFallback>{project.creator?.profile?.first_name?.[0]}{project.creator?.profile?.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{project.creator?.profile?.first_name} {project.creator?.profile?.last_name}</p>
            <p className="text-sm text-gray-500">{project.creator?.profile?.location}</p>
            <Link to={`/profile/${project.creator?.user_id}`} className="text-blue-500 hover:underline">View Profile</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const ImpactTab = ({ impactMetrics, isOwner, onCreateMetric, onUpdateMetric, onDeleteMetric, projectId }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Impact Metrics</h3>
    {impactMetrics && impactMetrics.length > 0 ? (
      impactMetrics.map((metric) => (
        <Card key={metric.metric_id} className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">{metric.description}</h4>
              <span className="text-sm text-gray-500">Score: {metric.impact_score}%</span>
            </div>
            <Progress value={metric.impact_score} max={100} className="w-full" />
            {isOwner && (
              <div className="mt-2 flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => onUpdateMetric(metric.metric_id, { description: 'Updated description' })}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDeleteMetric(metric.metric_id)}>
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))
    ) : (
      <p>No impact metrics available for this project.</p>
    )}
    {isOwner && (
      <ImpactMetricForm projectId={projectId} onSuccess={() => {}} />
    )}
  </div>
);

const TasksTab = ({ project }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Project Tasks</h3>
    {project.tasks && project.tasks.length > 0 ? (
      project.tasks.map((task, index) => (
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
      ))
    ) : (
      <p>No tasks have been added to this project yet.</p>
    )}
  </div>
);

const ResourcesTab = ({ project }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-semibold">Project Resources</h3>
    {project.resources && project.resources.length > 0 ? (
      project.resources.map((resource, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="w-5 h-5 mr-2 text-gray-500" />
            <span>{resource.name}</span>
          </div>
          <Button asChild variant="link">
            <a href={resource.url} target="_blank" rel="noopener noreferrer">View</a>
          </Button>
        </div>
      ))
    ) : (
      <p>No resources have been added to this project yet.</p>
    )}
  </div>
);

export default ProjectDetailPage;