import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign, Clock, MapPin, User, ArrowLeft, Edit, Trash } from 'lucide-react';
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

const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading, error } = useProject(projectId);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const { session } = useSupabase();
  const [applicationText, setApplicationText] = useState('');

  if (isLoading) return <div className="text-center mt-8">Loading project details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading project: {error.message}</div>;
  if (!project) return <div className="text-center mt-8">Project not found</div>;

  const isOwner = session?.user?.id === project.creator_id;

  const handleApply = () => {
    // TODO: Implement application logic
    toast.success('Application submitted successfully!');
    setApplicationText('');
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
            <CardTitle className="text-3xl">{project.project_name}</CardTitle>
            {project.category && <Badge variant="secondary">{project.category}</Badge>}
          </div>
          {isOwner && (
            <div className="flex space-x-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/projects/edit/${projectId}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Project
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" /> Delete Project
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this project?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the project and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{project.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Budget: ${project.budget}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Start Date: {new Date(project.start_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">End Date: {new Date(project.end_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span className="font-semibold">Location: {project.location || 'Not specified'}</span>
            </div>
          </div>
          
          {project.required_skills && project.required_skills.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {project.required_skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold mb-2">Project Creator</h3>
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2 text-gray-500" />
              <span>{project.creator_name || 'Anonymous'}</span>
            </div>
          </div>

          {project.interested_users && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Interested Users</h3>
              <span>{project.interested_users.length} user(s) interested</span>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!isOwner && (
            <div className="w-full space-y-4">
              <Textarea
                placeholder="Why are you interested in this project? Describe your relevant skills and experience."
                value={applicationText}
                onChange={(e) => setApplicationText(e.target.value)}
                rows={4}
              />
              <Button className="w-full" onClick={handleApply}>Apply for Project</Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProjectDetailPage;