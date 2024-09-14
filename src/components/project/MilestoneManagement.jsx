import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import MilestoneForm from './MilestoneForm';
import MilestoneList from './MilestoneList';
import ProjectProgress from './ProjectProgress';

const MilestoneManagement = ({ projectId }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const { data: milestones, isLoading, error } = useQuery({
    queryKey: ['milestones', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('order');
      if (error) throw error;
      return data;
    },
  });

  const queryClient = useQueryClient();

  const createMilestone = useMutation({
    mutationFn: async (newMilestone) => {
      const { data, error } = await supabase
        .from('milestones')
        .insert([{ ...newMilestone, project_id: projectId, order: milestones.length }])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milestones', projectId]);
      toast.success('Milestone added successfully');
    },
    onError: () => toast.error('Failed to add milestone'),
  });

  const updateMilestone = useMutation({
    mutationFn: async ({ milestoneId, updates }) => {
      const { data, error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', milestoneId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milestones', projectId]);
      toast.success('Milestone updated successfully');
    },
    onError: () => toast.error('Failed to update milestone'),
  });

  const deleteMilestone = useMutation({
    mutationFn: async (milestoneId) => {
      const { data, error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', milestoneId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milestones', projectId]);
      toast.success('Milestone deleted successfully');
    },
    onError: () => toast.error('Failed to delete milestone'),
  });

  const reorderMilestones = useMutation({
    mutationFn: async (updates) => {
      const { data, error } = await supabase
        .from('milestones')
        .upsert(updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['milestones', projectId]);
    },
    onError: () => toast.error('Failed to reorder milestones'),
  });

  const handleSubmit = async (data) => {
    try {
      if (editingMilestone) {
        await updateMilestone.mutateAsync({ milestoneId: editingMilestone.id, updates: data });
      } else {
        await createMilestone.mutateAsync(data);
      }
      setIsAddDialogOpen(false);
      setEditingMilestone(null);
    } catch (error) {
      console.error('Milestone operation error:', error);
    }
  };

  if (isLoading) return <div>Loading milestones...</div>;
  if (error) return <div>Error loading milestones: {error.message}</div>;

  const completedMilestones = milestones.filter(m => m.is_completed).length;
  const totalMilestones = milestones.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Project Milestones
          <Button onClick={() => { setEditingMilestone(null); setIsAddDialogOpen(true); }}>Add Milestone</Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectProgress completed={completedMilestones} total={totalMilestones} />
        <MilestoneList
          milestones={milestones}
          onEdit={setEditingMilestone}
          onDelete={deleteMilestone.mutate}
          onReorder={reorderMilestones.mutate}
          onToggleComplete={(milestone) => updateMilestone.mutate({
            milestoneId: milestone.id,
            updates: { is_completed: !milestone.is_completed },
          })}
        />
        <MilestoneForm
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleSubmit}
          editingMilestone={editingMilestone}
        />
      </CardContent>
    </Card>
  );
};

export default MilestoneManagement;
