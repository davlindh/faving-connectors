import React, { useState } from 'react';
import { useTeamMembers, useAddTeamMember, useUpdateTeamMember, useRemoveTeamMember } from '@/integrations/supabase/hooks/team_members';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ProfileSelector from './ProfileSelector';

const teamMemberSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  role: z.string().min(1, 'Role is required'),
});

const TeamManagement = ({ projectId }) => {
  const { data: teamMembers, isLoading, error } = useTeamMembers(projectId);
  const addTeamMember = useAddTeamMember();
  const updateTeamMember = useUpdateTeamMember();
  const removeTeamMember = useRemoveTeamMember();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const form = useForm({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      userId: '',
      role: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (editingMember) {
        await updateTeamMember.mutateAsync({ id: editingMember.id, updates: { role: data.role } });
        toast.success('Team member updated successfully');
      } else {
        await addTeamMember.mutateAsync({ projectId, ...data });
        toast.success('Team member added successfully');
      }
      setIsAddDialogOpen(false);
      setEditingMember(null);
      form.reset();
    } catch (error) {
      toast.error('Failed to manage team member');
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeTeamMember.mutateAsync({ id, projectId });
      toast.success('Team member removed successfully');
    } catch (error) {
      toast.error('Failed to remove team member');
    }
  };

  if (isLoading) return <div>Loading team members...</div>;
  if (error) return <div>Error loading team members: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Team Members
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingMember(null); form.reset(); }}>Add Team Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMember ? 'Edit' : 'Add'} Team Member</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <ProfileSelector
                    control={form.control}
                    name="userId"
                    label="User"
                    disabled={!!editingMember}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter role" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{editingMember ? 'Update' : 'Add'} Team Member</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <TeamMemberItem
              key={member.id}
              member={member}
              onEdit={() => {
                setEditingMember(member);
                form.setValue('userId', member.user_id);
                form.setValue('role', member.role);
                setIsAddDialogOpen(true);
              }}
              onRemove={() => handleRemove(member.id)}
            />
          ))
        ) : (
          <p>No team members yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

const TeamMemberItem = ({ member, onEdit, onRemove }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center">
      <Avatar className="h-10 w-10 mr-4">
        <AvatarImage src={member.user?.avatar_url} alt={`${member.user?.first_name} ${member.user?.last_name}`} />
        <AvatarFallback>{member.user?.first_name?.[0]}{member.user?.last_name?.[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{member.user?.first_name} {member.user?.last_name}</p>
        <p className="text-sm text-gray-500">{member.role}</p>
      </div>
    </div>
    <div>
      <Button variant="outline" className="mr-2" onClick={onEdit}>Edit</Button>
      <Button variant="destructive" onClick={onRemove}>Remove</Button>
    </div>
  </div>
);

export default TeamManagement;
