import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeam, useTeamProjects, useTeamMemberRequests, useUpdateTeamMemberRequest } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ProjectCard from '@/components/project/ProjectCard';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const TeamPage = () => {
  const { teamId } = useParams();
  const { data: team, isLoading: teamLoading, error: teamError } = useTeam(teamId);
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useTeamProjects(teamId);
  const { data: requests, isLoading: requestsLoading, error: requestsError } = useTeamMemberRequests(teamId);
  const updateRequest = useUpdateTeamMemberRequest();
  const [activeTab, setActiveTab] = useState('overview');

  const handleRequestAction = async (requestId, status) => {
    try {
      await updateRequest.mutateAsync({ requestId, status });
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  if (teamLoading || projectsLoading || requestsLoading) {
    return <LoadingState />;
  }

  if (teamError || projectsError || requestsError) {
    return <ErrorState error={teamError || projectsError || requestsError} />;
  }

  const pendingRequests = requests?.filter(request => request.status === 'pending') || [];
  const teamMembers = team?.members || [];

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Team: {team?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="requests">Join Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <OverviewTab team={team} />
            </TabsContent>
            <TabsContent value="members">
              <MembersTab members={teamMembers} />
            </TabsContent>
            <TabsContent value="projects">
              <ProjectsTab projects={projects} />
            </TabsContent>
            <TabsContent value="requests">
              <RequestsTab requests={pendingRequests} onAction={handleRequestAction} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingState = () => (
  <div className="container mx-auto p-4">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  </div>
);

const ErrorState = ({ error }) => (
  <div className="container mx-auto p-4">
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-red-500">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p>An error occurred while loading the team data: {error.message}</p>
      </CardContent>
    </Card>
  </div>
);

const OverviewTab = ({ team }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Overview</h3>
    <p>{team?.description}</p>
    <div className="mt-4">
      <h4 className="font-semibold">Team Stats:</h4>
      <p>Total Members: {team?.members?.length || 0}</p>
      <p>Created At: {new Date(team?.created_at).toLocaleDateString()}</p>
    </div>
  </div>
);

const MembersTab = ({ members }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Members</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.user_id}>
          <CardContent className="flex items-center p-4">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
              <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.first_name} {member.last_name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {members.length === 0 && <p>No members in this team yet.</p>}
  </div>
);

const ProjectsTab = ({ projects }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Projects</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects?.map((project) => (
        <ProjectCard key={project.project_id} project={project} />
      ))}
    </div>
    {projects?.length === 0 && <p>No projects found for this team.</p>}
  </div>
);

const RequestsTab = ({ requests, onAction }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Pending Join Requests</h3>
    {requests.length === 0 ? (
      <p>No pending requests.</p>
    ) : (
      requests.map((request) => (
        <Card key={request.id} className="mb-4">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={request.user.avatar_url} alt={`${request.user.first_name} ${request.user.last_name}`} />
                <AvatarFallback>{request.user.first_name[0]}{request.user.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{request.user.first_name} {request.user.last_name}</p>
                <p className="text-sm text-gray-500">{request.user.email}</p>
              </div>
            </div>
            <div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="mr-2" variant="outline">Approve</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Approve Join Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to approve this join request? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onAction(request.id, 'approved')}>Approve</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Reject</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Join Request</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this join request? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onAction(request.id, 'rejected')}>Reject</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))
    )}
  </div>
);

export default TeamPage;