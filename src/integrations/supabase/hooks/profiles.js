import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### profiles

| name       | type                | format                | required |
|------------|---------------------|------------------------|----------|
| profile_id | uuid                | uuid                   | true     |
| user_id    | uuid                | uuid                   | true     |
| location   | text                | string                 | false    |
| bio        | text                | string                 | false    |
| created_at | time with time zone | string                 | false    |
| updated_at | time with time zone | string                 | false    |
| avatar_url | text                | string (URL)           | false    |

Note: profile_id is the Primary Key
*/

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
      const { data, error } = await supabase.from('profiles').insert([newProfile]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
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
        .eq('profile_id', profileId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { profileId }) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.invalidateQueries(['profiles', profileId]);
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
    onSuccess: () => {
      queryClient.invalidateQueries(['profiles']);
    },
  });
};