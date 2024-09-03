import React from 'react';
import { useParams } from 'react-router-dom';
import { useTeamMemberRequests, useUpdateTeamMemberRequest } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';

const AdminPanel = () => {
  const { projectId } = useParams();
  const { data: requests, isLoading, error } = useTeamMemberRequests(projectId);
  const updateRequest = useUpdateTeamMemberRequest();

  const handleRequestAction = async (requestId, status) => {
    try {
      await updateRequest.mutateAsync({ requestId, status });
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} request`);
    }
  };

  if (isLoading) return <div>Loading requests...</div>;
  if (error) return <div>Error loading requests: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Member Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
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
                  <Button
                    onClick={() => handleRequestAction(request.id, 'approved')}
                    className="mr-2"
                    variant="outline"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleRequestAction(request.id, 'rejected')}
                    variant="destructive"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;