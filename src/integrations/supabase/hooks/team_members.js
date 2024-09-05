import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useProjectTeamMembers = (projectId) => useQuery({
  queryKey: ['project_team_members', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('project_team_members')
      .select('*, user:users(*)')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});

export const useAddProjectTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId, role }) => {
      const { data, error } = await supabase
        .from('project_team_members')
        .insert({ project_id: projectId, user_id: userId, role })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['project_team_members', data.project_id]);
    },
  });
};

export const useUpdateProjectTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from('project_team_members')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['project_team_members', data.project_id]);
    },
  });
};

export const useRemoveProjectTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }) => {
      const { error } = await supabase
        .from('project_team_members')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return { id, projectId };
    },
    onSuccess: ({ projectId }) => {
      queryClient.invalidateQueries(['project_team_members', projectId]);
    },
  });
};

export const useCreateTeamMemberRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId, role }) => {
      const { data, error } = await supabase
        .from('team_member_requests')
        .insert({ team_id: teamId, user_id: userId, role, status: 'pending' })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team_member_requests', data.team_id]);
    },
  });
};

export const useTeamMemberRequests = (teamId) => useQuery({
  queryKey: ['team_member_requests', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('team_member_requests')
      .select('*, user:users(*)')
      .eq('team_id', teamId);
    if (error) throw error;
    return data;
  },
  enabled: !!teamId,
});

export const useUpdateTeamMemberRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, status }) => {
      const { data, error } = await supabase
        .from('team_member_requests')
        .update({ status })
        .eq('id', requestId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team_member_requests', data.team_id]);
      if (data.status === 'approved') {
        queryClient.invalidateQueries(['project_team_members', data.team_id]);
      }
    },
  });
};