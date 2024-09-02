import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useProfiles = () => useQuery({
  queryKey: ['profiles'],
  queryFn: async () => {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error) throw error;
    return data;
  },
});

export const useProfile = (profileId) => useQuery({
  queryKey: ['profiles', profileId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_id', profileId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProfile) => {
      const { data, error } = await supabase.from('profiles').insert([newProfile]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.setQueryData(['profiles', data.profile_id], data);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profileId, updates }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('profile_id', profileId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.setQueryData(['profiles', data.profile_id], data);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId) => {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('profile_id', profileId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, profileId) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.removeQueries(['profiles', profileId]);
    },
  });
};