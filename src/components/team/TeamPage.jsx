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
import TeamOverview from './TeamOverview';
import TeamMembers from './TeamMembers';
import TeamProjects from './TeamProjects';
import TeamRequests from './TeamRequests';

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
      toast.error(`Failed to ${status} request: ${error.message}`);
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
              <TeamOverview team={team} />
            </TabsContent>
            <TabsContent value="members">
              <TeamMembers members={teamMembers} />
            </TabsContent>
            <TabsContent value="projects">
              <TeamProjects projects={projects} />
            </TabsContent>
            <TabsContent value="requests">
              <TeamRequests requests={pendingRequests} onAction={handleRequestAction} />
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

export default TeamPage;
