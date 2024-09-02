import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject, useCreateProjectApplication, useProfile } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import ProjectDetails from './ProjectDetails';
import ProjectActions from './ProjectActions';
import ApplicationForm from './ApplicationForm';
import { Skeleton } from "@/components/ui/skeleton";

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading: projectLoading, error: projectError } = useProject(projectId);
  const { session } = useSupabase();
  const { data: userProfile, isLoading: profileLoading } = useProfile(session?.user?.id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createProjectApplication = useCreateProjectApplication();
  const [applicationText, setApplicationText] = useState('');

  const isOwner = session?.user?.id === project?.creator_id;
  const hasApplied = project?.applications?.some(app => app.user_id === session?.user?.id);

  const handleApply = async () => {
    if (!session) {
      toast.error('Please log in to apply for projects');
      return;
    }
    try {
      await createProjectApplication.mutateAsync({
        project_id: projectId,
        user_id: session.user.id,
        application_text: applicationText,
      });
      toast.success('Application submitted successfully!');
      setApplicationText('');
    } catch (error) {
      toast.error('Failed to submit application');
      console.error('Application submission error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (projectLoading || profileLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (projectError) {
    return <div className="text-center mt-8 text-red-500">Error loading project: {projectError.message}</div>;
  }

  if (!project) {
    return <div className="text-center mt-8">Project not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/projects" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2" /> Back to Projects
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">{project.project_name || 'Untitled Project'}</CardTitle>
            {project.category && <Badge variant="secondary">{project.category}</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProjectDetails project={project} />
          {isOwner && <ProjectActions projectId={projectId} onDelete={handleDelete} />}
        </CardContent>
        <CardFooter>
          {!isOwner && !hasApplied && (
            <ApplicationForm
              applicationText={applicationText}
              setApplicationText={setApplicationText}
              onSubmit={handleApply}
              isLoggedIn={!!session}
            />
          )}
          {hasApplied && (
            <div className="w-full">
              <p className="text-green-600 font-semibold">You have already applied to this project.</p>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

const ProjectDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4">
    <Skeleton className="h-6 w-32 mb-4" />
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  </div>
);

export default ProjectDetailPage;