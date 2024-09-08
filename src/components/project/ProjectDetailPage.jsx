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
import TeamManagement from '../team/TeamManagement';
import ProjectForm from './ProjectForm';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
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

  const calculateProgress = () => {
    if (!project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter(task => task.status === 'completed').length;
    return (completedTasks / project.tasks.length) * 100;
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <ProjectForm
          project={project}
          onSuccess={() => {
            setIsEditing(false);
            toast.success('Project updated successfully');
          }}
          onCancel={() => setIsEditing(false)}
        />
      );
    }

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab project={project} />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskList projectId={project.project_id} />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagement projectId={project.project_id} isOwner={isOwner} />
        </TabsContent>
        <TabsContent value="milestones">
          <div>Milestone management to be implemented</div>
        </TabsContent>
        <TabsContent value="impact">
          <ImpactMetricForm projectId={project.project_id} />
        </TabsContent>
        <TabsContent value="feedback">
          <ECKTSlider origin={`project_${projectId}`} />
        </TabsContent>
      </Tabs>
    );
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
              <Button variant="outline" size="sm" onClick={handleEditToggle}>
                {isEditing ? 'Cancel Edit' : 'Edit Project'}
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
          {renderContent()}
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
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-xl font-semibold">Project Overview</h3>
        <p className="text-gray-600">{project.description}</p>
      </div>
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
      <Progress value={calculateProgress()} className="w-full" />
      <span className="text-sm text-gray-500 mt-1">{calculateProgress().toFixed(0)}% Complete</span>
    </div>
  </div>
);

export default ProjectDetailPage;