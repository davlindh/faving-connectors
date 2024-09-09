import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProject, useUpdateProject, useProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProjectForm } from '@/hooks/useProjectForm';
import ProjectFormFields from './ProjectFormFields';

const ProjectForm = ({ isEditing = false }) => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: project, isLoading: projectLoading } = useProject(projectId);

  const { form, onSubmit } = useProjectForm({
    projectId,
    project,
    createProject,
    updateProject,
    onSuccess: () => navigate('/projects'),
  });

  useEffect(() => {
    if (isEditing && project) {
      form.reset({
        ...project,
        start_date: new Date(project.start_date),
        end_date: new Date(project.end_date),
        budget: project.budget.toString(),
        required_skills: project.required_skills || [],
      });
    }
  }, [isEditing, project, form]);

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

export default ProjectForm;