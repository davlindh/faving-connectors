import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useTeamEvents = (teamId) => useQuery({
  queryKey: ['team_events', teamId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('team_events')
      .select('*')
      .eq('team_id', teamId);
    if (error) throw error;
    return data;
  },
  enabled: !!teamId,
});

export const useCreateTeamEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEvent) => {
      const { data, error } = await supabase
        .from('team_events')
        .insert([newEvent])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team_events', data.team_id]);
    },
  });
};

export const useDeleteTeamEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId) => {
      const { data, error } = await supabase
        .from('team_events')
        .delete()
        .eq('id', eventId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['team_events', data.team_id]);
    },
  });
};