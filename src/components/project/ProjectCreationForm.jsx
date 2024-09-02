import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProject, useUpdateProject, useProject, useProjects, useProfile } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Pencil } from "lucide-react";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';

const projectSchema = z.object({
  project_name: z.string().min(1, 'Project name is required').max(100, 'Project name must be 100 characters or less'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  category: z.string().min(1, 'Category is required'),
  budget: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Budget must be a positive number",
  }),
  start_date: z.date().min(new Date(), 'Start date must be in the future'),
  end_date: z.date(),
  location: z.string().optional(),
  required_skills: z.array(z.string()).min(1, 'At least one skill is required'),
}).refine((data) => data.end_date > data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

const ProjectCreationForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { session } = useSupabase();
  const { data: userProjects, isLoading: userProjectsLoading } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const { data: userProfile, isLoading: profileLoading } = useProfile(session?.user?.id);

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_name: '',
      description: '',
      category: '',
      budget: '',
      start_date: new Date(),
      end_date: new Date(),
      location: '',
      required_skills: [],
    },
  });

  useEffect(() => {
    if (projectId && project) {
      setIsEditing(true);
      form.reset({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        budget: project.budget ? project.budget.toString() : '',
        required_skills: project.required_skills || [],
      });
    }
  }, [projectId, project, form]);

  const onSubmit = async (data) => {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to create or edit a project');
        return;
      }

      if (!userProfile) {
        toast.error('User profile not found. Please ensure your profile is set up.');
        return;
      }

      const projectData = {
        ...data,
        budget: parseFloat(data.budget),
        creator_id: session.user.id,
        start_date: data.start_date.toISOString(),
        end_date: data.end_date.toISOString(),
        interested_users: [],
      };

      if (isEditing) {
        await updateProject.mutateAsync({
          projectId,
          updates: projectData,
        });
        toast.success('Project updated successfully');
      } else {
        await createProject.mutateAsync(projectData);
        toast.success('Project created successfully');
      }
      navigate('/projects');
    } catch (error) {
      console.error('Project operation error:', error);
      toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
    }
  };

  const userCreatedProjects = userProjects?.filter(p => p.creator_id === session?.user?.id) || [];

  if (projectLoading || userProjectsLoading || profileLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
          <CardDescription>{isEditing ? 'Update your project details' : 'Fill in the details for your new project'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="project_name" placeholder="Enter project name" />
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
                      <Textarea {...field} id="description" placeholder="Describe your project" rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input {...field} id="budget" type="text" placeholder="Enter budget" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              id="start_date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a start date</span>
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
                              date < new Date() || date < new Date("1900-01-01")
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
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              id="end_date"
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick an end date</span>
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
                              date <= form.getValues('start_date') || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} id="location" placeholder="Enter project location" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="required_skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                    <FormControl>
                      <Input
                        id="required_skills"
                        placeholder="Enter skills (comma-separated)"
                        value={field.value.join(', ')}
                        onChange={(e) => field.onChange(e.target.value.split(',').map(skill => skill.trim()))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={createProject.isPending || updateProject.isPending}>
                {isEditing ? (updateProject.isPending ? 'Updating...' : 'Update Project') : (createProject.isPending ? 'Creating...' : 'Create Project')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {userCreatedProjects.length > 0 && (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Edit your existing projects</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {userCreatedProjects.map((project) => (
                <li key={project.project_id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                  <span>{project.project_name}</span>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/projects/edit/${project.project_id}`)}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectCreationForm;