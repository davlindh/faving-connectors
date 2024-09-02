import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  },
});

export const useProject = (projectId) => useQuery({
  queryKey: ['projects', projectId],
  queryFn: async () => {
    if (!projectId || projectId === 'create') return null;
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:creator_id(*),
        team_members:project_team_members(*),
        tasks:project_tasks(*),
        impact_metrics:project_impact_metrics(*),
        resources:project_resources(*)
      `)
      .eq('project_id', projectId)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!projectId && projectId !== 'create',
});

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject) => {
      const { data, error } = await supabase.from('projects').insert([newProject]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.setQueryData(['projects', data.project_id], data);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updates }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('project_id', projectId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.setQueryData(['projects', data.project_id], data);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId) => {
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.removeQueries(['projects', projectId]);
    },
  });
};