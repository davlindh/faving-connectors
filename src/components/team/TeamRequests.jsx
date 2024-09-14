import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const TeamRequests = ({ requests, onAction }) => (
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

export default TeamRequests;