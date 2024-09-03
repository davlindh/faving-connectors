import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTeamMemberRequests, useUpdateTeamMemberRequest, useProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AdminPanel = () => {
  const { projectId } = useParams();
  const { data: requests, isLoading: requestsLoading, error: requestsError } = useTeamMemberRequests(projectId);
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const updateRequest = useUpdateTeamMemberRequest();
  const [activeTab, setActiveTab] = useState('pending');

  const handleRequestAction = async (requestId, status) => {
    try {
      await updateRequest.mutateAsync({ requestId, status });
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  if (requestsLoading || projectLoading) return <div className="text-center py-8">Loading...</div>;
  if (requestsError || projectError) return <div className="text-center text-red-500 py-8">Error: {requestsError?.message || projectError?.message}</div>;

  const pendingRequests = requests.filter(request => request.status === 'pending');
  const approvedRequests = requests.filter(request => request.status === 'approved');
  const rejectedRequests = requests.filter(request => request.status === 'rejected');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Team Management for {project.project_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
              <TabsTrigger value="approved">Team Members</TabsTrigger>
              <TabsTrigger value="rejected">Rejected Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {pendingRequests.length === 0 ? (
                <p>No pending requests.</p>
              ) : (
                pendingRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    onApprove={() => handleRequestAction(request.id, 'approved')}
                    onReject={() => handleRequestAction(request.id, 'rejected')}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="approved">
              {approvedRequests.length === 0 ? (
                <p>No team members yet.</p>
              ) : (
                approvedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    showActions={false}
                  />
                ))
              )}
            </TabsContent>
            <TabsContent value="rejected">
              {rejectedRequests.length === 0 ? (
                <p>No rejected requests.</p>
              ) : (
                rejectedRequests.map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    showActions={false}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const RequestCard = ({ request, onApprove, onReject, showActions = true }) => (
  <Card className="mb-4">
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
      {showActions ? (
        <div>
          <Button onClick={onApprove} className="mr-2" variant="outline">
            Approve
          </Button>
          <Button onClick={onReject} variant="destructive">
            Reject
          </Button>
        </div>
      ) : (
        <Badge variant={request.status === 'approved' ? 'success' : 'secondary'}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </Badge>
      )}
    </CardContent>
  </Card>
);

export default AdminPanel;