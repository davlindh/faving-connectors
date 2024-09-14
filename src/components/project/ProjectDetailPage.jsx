import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useDeleteProject } from '../../integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar, DollarSign, MapPin, ArrowLeft, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { useSupabase } from '../../integrations/supabase/SupabaseProvider';
import { ProjectProvider } from '../../contexts/ProjectContext';
import ProjectHeader from './ProjectHeader';
import ProjectTabs from './ProjectTabs';
import ProjectActions from './ProjectActions';

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;

  const handleDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <ProjectProvider projectId={projectId}>
      <div className="max-w-4xl mx-auto p-4">
        <Link to="/projects" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" /> Back to Projects
        </Link>
        <Card>
          <ProjectHeader 
            project={project} 
            isOwner={isOwner} 
            isEditing={isEditing} 
            onEditToggle={handleEditToggle} 
            onDelete={handleDelete} 
          />
          <CardContent>
            <ProjectTabs project={project} isEditing={isEditing} />
          </CardContent>
          <ProjectActions project={project} isOwner={isOwner} />
        </Card>
      </div>
    </ProjectProvider>
  );
};

export default ProjectDetailPage;
