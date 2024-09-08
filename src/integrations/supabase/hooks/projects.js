import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';
import { useSupabase } from '../SupabaseProvider';

export const useProjects = (fetchUserProjects = false) => {
  const { session } = useSupabase();
  
  return useQuery({
    queryKey: ['projects', fetchUserProjects],
    queryFn: async () => {
      let query = supabase.from('projects').select(`
        *,
        creator:users!creator_id(*),
        impact_metrics:project_impact_metrics(*),
        tasks:project_tasks(*),
        team_members:project_team_members(*)
      `);
      
      if (fetchUserProjects && session?.user?.id) {
        query = query.eq('creator_id', session.user.id);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !fetchUserProjects || !!session?.user?.id,
  });
};

export const useProject = (projectId) => useQuery({
  queryKey: ['projects', projectId],
  queryFn: async () => {
    if (!projectId || projectId === 'create') return null;
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        creator:users!creator_id(*),
        impact_metrics:project_impact_metrics(*),
        tasks:project_tasks(*),
        team_members:project_team_members(*),
        resources:project_resources(*)
      `)
      .eq('project_id', projectId)
      .single();
    
    if (error) throw error;

    // Fetch the creator's profile
    if (data.creator) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.creator.user_id)
        .single();
      
      if (profileError) throw profileError;
      data.creator.profile = profileData;
    }

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

export const useProjectImpactMetrics = (projectId) => useQuery({
  queryKey: ['project_impact_metrics', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('project_impact_metrics')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});

export const useProjectTasks = (projectId) => useQuery({
  queryKey: ['project_tasks', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});

export const useProjectTeamMembers = (projectId) => useQuery({
  queryKey: ['project_team_members', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('project_team_members')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});