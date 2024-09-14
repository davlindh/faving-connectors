import React, { useState } from 'react';
import { useProjectMilestones, useCreateProjectMilestone, useUpdateProjectMilestone, useDeleteProjectMilestone } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const milestoneSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_date: z.date(),
  is_completed: z.boolean().default(false),
});

const MilestoneManagement = ({ projectId }) => {
  const { data: milestones, isLoading, error } = useProjectMilestones(projectId);
  const createMilestone = useCreateProjectMilestone();
  const updateMilestone = useUpdateProjectMilestone();
  const deleteMilestone = useDeleteProjectMilestone();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const form = useForm({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      title: '',
      description: '',
      due_date: new Date(),
      is_completed: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (editingMilestone) {
        await updateMilestone.mutateAsync({ milestoneId: editingMilestone.id, updates: data });
        toast.success('Milestone updated successfully');
      } else {
        await createMilestone.mutateAsync({ projectId, ...data });
        toast.success('Milestone added successfully');
      }
      setIsAddDialogOpen(false);
      setEditingMilestone(null);
      form.reset();
    } catch (error) {
      toast.error('Failed to manage milestone');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMilestone.mutateAsync(id);
      toast.success('Milestone deleted successfully');
    } catch (error) {
      toast.error('Failed to delete milestone');
    }
  };

  const handleToggleComplete = async (milestone) => {
    try {
      await updateMilestone.mutateAsync({
        milestoneId: milestone.id,
        updates: { is_completed: !milestone.is_completed },
      });
      toast.success(`Milestone marked as ${milestone.is_completed ? 'incomplete' : 'complete'}`);
    } catch (error) {
      toast.error('Failed to update milestone status');
    }
  };

  if (isLoading) return <div>Loading milestones...</div>;
  if (error) return <div>Error loading milestones: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Project Milestones
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingMilestone(null); form.reset(); }}>Add Milestone</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingMilestone ? 'Edit' : 'Add'} Milestone</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter milestone title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter milestone description" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="is_completed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Mark as completed
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">{editingMilestone ? 'Update' : 'Add'} Milestone</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {milestones?.length > 0 ? (
          milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center justify-between mb-4 p-4 bg-gray-100 rounded-lg">
              <div className="flex items-center">
                <Checkbox
                  checked={milestone.is_completed}
                  onCheckedChange={() => handleToggleComplete(milestone)}
                  className="mr-4"
                />
                <div>
                  <h3 className={`font-semibold ${milestone.is_completed ? 'line-through text-gray-500' : ''}`}>
                    {milestone.title}
                  </h3>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  <p className="text-xs text-gray-500">Due: {format(new Date(milestone.due_date), 'PPP')}</p>
                </div>
              </div>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => {
                    setEditingMilestone(milestone);
                    form.reset({
                      title: milestone.title,
                      description: milestone.description,
                      due_date: new Date(milestone.due_date),
                      is_completed: milestone.is_completed,
                    });
                    setIsAddDialogOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(milestone.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No milestones added yet.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MilestoneManagement;
