import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useForums = () => useQuery({
  queryKey: ['forums'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('forums')
      .select('*');
    if (error) throw error;
    return data;
  },
});

export const useForum = (forumId) => useQuery({
  queryKey: ['forums', forumId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .eq('id', forumId)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!forumId,
});

export const useCreateForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newForum) => {
      const { data, error } = await supabase
        .from('forums')
        .insert([newForum])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forums']);
    },
  });
};

export const useUpdateForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ forumId, updates }) => {
      const { data, error } = await supabase
        .from('forums')
        .update(updates)
        .eq('id', forumId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['forums']);
      queryClient.invalidateQueries(['forums', data.id]);
    },
  });
};

export const useDeleteForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (forumId) => {
      const { error } = await supabase
        .from('forums')
        .delete()
        .eq('id', forumId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forums']);
    },
  });
};