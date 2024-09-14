import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeam, useTeamProjects, useTeamMemberRequests } from '@/integrations/supabase/hooks/teams';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TeamOverview from './TeamOverview';
import TeamMembers from './TeamMembers';
import TeamProjects from './TeamProjects';
import TeamRequests from './TeamRequests';
import TeamActions from './TeamActions';

const TeamPage = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const { data: team, isLoading: teamLoading, error: teamError } = useTeam(teamId);
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useTeamProjects(teamId);
  const { data: requests, isLoading: requestsLoading, error: requestsError } = useTeamMemberRequests(teamId);
  const [activeTab, setActiveTab] = useState('overview');

  if (teamLoading || projectsLoading || requestsLoading) {
    return <LoadingState />;
  }

  if (teamError || projectsError || requestsError) {
    return <ErrorState error={teamError || projectsError || requestsError} />;
  }

  const isTeamMember = team?.members?.some(member => member.user_id === user?.id);
  const isTeamAdmin = team?.members?.some(member => member.user_id === user?.id && member.role === 'admin');

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Team: {team?.name}</CardTitle>
          <TeamActions team={team} isTeamMember={isTeamMember} isTeamAdmin={isTeamAdmin} />
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              {isTeamAdmin && <TabsTrigger value="requests">Join Requests</TabsTrigger>}
            </TabsList>
            <TabsContent value="overview">
              <TeamOverview team={team} />
            </TabsContent>
            <TabsContent value="members">
              <TeamMembers members={team?.members} isTeamAdmin={isTeamAdmin} />
            </TabsContent>
            <TabsContent value="projects">
              <TeamProjects projects={projects} />
            </TabsContent>
            {isTeamAdmin && (
              <TabsContent value="requests">
                <TeamRequests requests={requests} teamId={teamId} />
              </TabsContent>
            )}
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
