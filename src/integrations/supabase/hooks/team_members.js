import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useTeamMemberRequests = (projectId) => useQuery({
  queryKey: ['team_member_requests', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('team_member_requests')
      .select(`
        *,
        user:users(*)
      `)
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});

export const useCreateTeamMemberRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId }) => {
      const { data, error } = await supabase
        .from('team_member_requests')
        .insert({ project_id: projectId, user_id: userId, status: 'pending' })
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries(['team_member_requests', projectId]);
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
      queryClient.invalidateQueries(['team_member_requests', data.project_id]);
    },
  });
};