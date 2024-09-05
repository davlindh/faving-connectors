import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useTeam = (teamId) => useQuery({
  queryKey: ['teams', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('teams')
      .select('*, members:team_members(*)')
      .eq('team_id', teamId)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!teamId,
});

export const useTeamProjects = (teamId) => useQuery({
  queryKey: ['team_projects', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return data;
  },
  enabled: !!teamId,
});

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newTeam) => {
      const { data, error } = await supabase
        .from('teams')
        .insert([newTeam])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teams']);
      queryClient.setQueryData(['teams', data.team_id], data);
    },
  });
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, updates }) => {
      const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('team_id', teamId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['teams']);
      queryClient.setQueryData(['teams', data.team_id], data);
    },
  });
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (teamId) => {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('team_id', teamId);
      if (error) throw error;
    },
    onSuccess: (_, teamId) => {
      queryClient.invalidateQueries(['teams']);
      queryClient.removeQueries(['teams', teamId]);
    },
  });
};