import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProject, useUpdateProject, useProject } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import ProjectFormFields from './ProjectFormFields';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProjectForm } from '@/hooks/useProjectForm';

const ProjectCreationForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { session } = useSupabase();
  const [isEditing, setIsEditing] = useState(false);

  const { form, onSubmit } = useProjectForm({
    projectId,
    project,
    createProject,
    updateProject,
    onSuccess: () => navigate('/projects'),
  });

  useEffect(() => {
    if (projectId && project) {
      setIsEditing(true);
      form.reset({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        budget: project.budget.toString(),
        required_skills: project.required_skills || [],
      });
    }
  }, [projectId, project, form]);

  if (projectLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Project' : 'Create New Project'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ProjectFormFields form={form} onSubmit={onSubmit} isEditing={isEditing} />
      </CardContent>
    </Card>
  );
};

export default ProjectCreationForm;