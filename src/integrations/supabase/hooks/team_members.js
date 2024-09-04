import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useTeam = (teamId) => useQuery({
  queryKey: ['team', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('teams')
      .select(`
        *,
        members:team_members(*)
      `)
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

export const useTeamMemberRequests = (teamId) => useQuery({
  queryKey: ['team_member_requests', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('team_member_requests')
      .select(`
        *,
        user:users(*)
      `)
      .eq('team_id', teamId);
    if (error) throw error;
    return data;
  },
  enabled: !!teamId,
});

export const useCreateTeamMemberRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId }) => {
      const { data, error } = await supabase
        .from('team_member_requests')
        .insert({ team_id: teamId, user_id: userId, status: 'pending' })
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (_, { teamId }) => {
      queryClient.invalidateQueries(['team_member_requests', teamId]);
    },
  });
};

export const useUpdateTeamMemberRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, status }) => {
      const { data, error } = await supabase
        .from('team_member_requests')
        .update({ status })
        .eq('id', requestId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team_member_requests', data.team_id]);
      queryClient.invalidateQueries(['team', data.team_id]);
    },
  });
};