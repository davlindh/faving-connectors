import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject, useCreateProjectApplication } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign, Clock, MapPin, User, ArrowLeft, Edit, Trash, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Progress } from "@/components/ui/progress";
import ProjectDetails from './ProjectDetails';
import ProjectActions from './ProjectActions';
import ApplicationForm from './ApplicationForm';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createProjectApplication = useCreateProjectApplication();
  const { session } = useSupabase();
  const [applicationText, setApplicationText] = useState('');

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;
  const hasApplied = project.applications?.some(app => app.user_id === session?.user?.id);

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

export default ProjectDetailPage;