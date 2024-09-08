import React, { useState } from 'react';
import { useProjectTasks, useCreateProjectTask, useUpdateProjectTask, useDeleteProjectTask } from '@/integrations/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';

const TaskList = ({ projectId }) => {
  const { data: tasks, isLoading, error } = useProjectTasks(projectId);
  const createTask = useCreateProjectTask();
  const updateTask = useUpdateProjectTask();
  const deleteTask = useDeleteProjectTask();
  const [newTaskName, setNewTaskName] = useState('');

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    try {
      await createTask.mutateAsync({ project_id: projectId, name: newTaskName, status: 'pending' });
      setNewTaskName('');
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      await updateTask.mutateAsync({ taskId, updates: { status: currentStatus === 'completed' ? 'pending' : 'completed' } });
      toast.success('Task status updated');
    } catch (error) {
      toast.error('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask.mutateAsync(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error loading tasks: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateTask} className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            placeholder="New task name"
            className="flex-grow"
          />
          <Button type="submit">Add Task</Button>
        </form>
        <ul className="space-y-2">
          {tasks?.map((task) => (
            <li key={task.task_id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={task.status === 'completed'}
                  onCheckedChange={() => handleToggleTask(task.task_id, task.status)}
                />
                <span className={task.status === 'completed' ? 'line-through' : ''}>{task.name}</span>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteTask(task.task_id)}>Delete</Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TaskList;