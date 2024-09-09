import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

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

export const useProjectForm = ({ projectId, project, createProject, updateProject, onSuccess }) => {
  const { session } = useSupabase();

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

  const onSubmit = async (data) => {
    try {
      const projectData = {
        ...data,
        budget: parseFloat(data.budget),
      };

      if (projectId) {
        await updateProject.mutateAsync({ projectId, updates: projectData });
        toast.success('Project updated successfully');
      } else {
        await createProject.mutateAsync({
          ...projectData,
          creator_id: session.user.id,
        });
        toast.success('Project created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Project operation error:', error);
      toast.error(projectId ? 'Failed to update project' : 'Failed to create project');
    }
  };

  return { form, onSubmit };
};