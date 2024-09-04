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

  if (teamLoading || projectsLoading || requestsLoading) return <div className="text-center py-8">Loading...</div>;
  if (teamError || projectsError || requestsError) return <div className="text-center text-red-500 py-8">Error: {teamError?.message || projectsError?.message || requestsError?.message}</div>;

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
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="requests">Join Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <h3 className="text-xl font-semibold mb-4">Team Overview</h3>
              <p>{team?.description}</p>
              <div className="mt-4">
                <h4 className="font-semibold">Team Stats:</h4>
                <p>Total Members: {teamMembers.length}</p>
                <p>Total Projects: {projects?.length || 0}</p>
                <p>Pending Requests: {pendingRequests.length}</p>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <h3 className="text-xl font-semibold mb-4">Team Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects?.map((project) => (
                  <ProjectCard key={project.project_id} project={project} />
                ))}
              </div>
              {projects?.length === 0 && <p>No projects found for this team.</p>}
            </TabsContent>
            <TabsContent value="members">
              <h3 className="text-xl font-semibold mb-4">Team Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
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
              {teamMembers.length === 0 && <p>No members in this team yet.</p>}
            </TabsContent>
            <TabsContent value="requests">
              <h3 className="text-xl font-semibold mb-4">Pending Join Requests</h3>
              {pendingRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                pendingRequests.map((request) => (
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
                        <Button onClick={() => handleRequestAction(request.id, 'approved')} className="mr-2" variant="outline">
                          Approve
                        </Button>
                        <Button onClick={() => handleRequestAction(request.id, 'rejected')} variant="destructive">
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamPage;