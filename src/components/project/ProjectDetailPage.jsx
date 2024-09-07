import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject, useProjectTeamMembers, useAddProjectTeamMember, useUpdateProjectTeamMember, useRemoveProjectTeamMember } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, DollarSign, MapPin, User, ArrowLeft, Edit, Trash, Star, FileText, MessageSquare, UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore';
import ExpressInterestButton from './ExpressInterestButton';
import ImpactMetricForm from './ImpactMetricForm';
import ECKTSlider from '../shared/ECKTSlider';
import { format } from 'date-fns';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('overview');
  const { data: teamMembers, isLoading: teamMembersLoading } = useProjectTeamMembers(projectId);
  const addTeamMember = useAddProjectTeamMember();
  const updateTeamMember = useUpdateProjectTeamMember();
  const removeTeamMember = useRemoveProjectTeamMember();

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

  const handleAddTeamMember = async (userId, role) => {
    try {
      await addTeamMember.mutateAsync({ projectId, userId, role });
      toast.success('Team member added successfully');
    } catch (error) {
      toast.error('Failed to add team member');
    }
  };

  const handleUpdateTeamMember = async (id, updates) => {
    try {
      await updateTeamMember.mutateAsync({ id, updates });
      toast.success('Team member updated successfully');
    } catch (error) {
      toast.error('Failed to update team member');
    }
  };

  const handleRemoveTeamMember = async (id) => {
    try {
      await removeTeamMember.mutateAsync({ id, projectId });
      toast.success('Team member removed successfully');
    } catch (error) {
      toast.error('Failed to remove team member');
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
              <TeamTab
                teamMembers={teamMembers}
                isLoading={teamMembersLoading}
                isOwner={isOwner}
                onAddMember={handleAddTeamMember}
                onUpdateMember={handleUpdateTeamMember}
                onRemoveMember={handleRemoveTeamMember}
              />
            </TabsContent>
            <TabsContent value="tasks">
              <TasksTab project={project} />
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

const OverviewTab = ({ project }) => (
  <div className="space-y-4">
    <p className="text-gray-600">{project.description}</p>
    <div className="grid grid-cols-2 gap-4">
      <div className="flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
        <span className="font-semibold">Budget: ${project.budget.toLocaleString()}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span className="font-semibold">Start Date: {format(new Date(project.start_date), 'PPP')}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span className="font-semibold">End Date: {format(new Date(project.end_date), 'PPP')}</span>
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
  </div>
);

const TeamTab = ({ teamMembers, isLoading, isOwner, onAddMember, onUpdateMember, onRemoveMember }) => {
  if (isLoading) return <div>Loading team members...</div>;
  
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Project Team</h3>
      {teamMembers && teamMembers.length > 0 ? (
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={member.user.avatar_url} alt={`${member.user.first_name} ${member.user.last_name}`} />
                    <AvatarFallback>{member.user.first_name[0]}{member.user.last_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{member.user.first_name} {member.user.last_name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                {isOwner && (
                  <div>
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => onUpdateMember(member.id, { role: 'New Role' })}>
                      Edit Role
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onRemoveMember(member.id)}>
                      Remove
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No team members yet.</p>
      )}
      {isOwner && (
        <Button className="mt-4" onClick={() => onAddMember('user_id', 'New Member Role')}>
          <UserPlus className="mr-2 h-4 w-4" /> Add Team Member
        </Button>
      )}
    </div>
  );
};

const TasksTab = ({ project }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Project Tasks</h3>
    {project.tasks && project.tasks.length > 0 ? (
      <div className="space-y-4">
        {project.tasks.map((task, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h4 className="font-semibold">{task.title}</h4>
              <p className="text-sm text-gray-600">{task.description}</p>
              <div className="flex justify-between items-center mt-2">
                <Badge variant={task.status === 'completed' ? 'success' : 'secondary'}>{task.status}</Badge>
                <span className="text-sm text-gray-500">Due: {format(new Date(task.due_date), 'PP')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p>No tasks have been added to this project yet.</p>
    )}
  </div>
);

const ImpactTab = ({ project }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Project Impact</h3>
    {project.impact_metrics && project.impact_metrics.length > 0 ? (
      <div className="space-y-4">
        {project.impact_metrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <h4 className="font-semibold">{metric.description}</h4>
              <Progress value={metric.impact_score} className="mt-2" />
              <p className="text-sm text-gray-600 mt-1">Impact Score: {metric.impact_score}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    ) : (
      <p>No impact metrics have been added to this project yet.</p>
    )}
    <ImpactMetricForm projectId={project.project_id} />
  </div>
);

const FeedbackTab = ({ projectId }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Project Feedback</h3>
    <ECKTSlider origin={`project_${projectId}`} readOnly={false} />
  </div>
);

export default ProjectDetailPage;