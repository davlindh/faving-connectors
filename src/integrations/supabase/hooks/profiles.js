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

export const useProfile = (userId) => useQuery({
  queryKey: ['profiles', userId],
  queryFn: async () => {
    if (!userId) return null;
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error('Profile fetch error:', error);
      throw error;
    }
    return data;
  },
  enabled: !!userId,
  retry: 3,
  retryDelay: 1000,
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
      queryClient.setQueryData(['profiles', data.user_id], data);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, updates }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', userId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.setQueryData(['profiles', data.user_id], data);
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.removeQueries(['profiles', userId]);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, file }) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatar_bucket')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('avatar_bucket')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId)
        .select();

      if (updateError) throw updateError;

      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profiles']);
      queryClient.setQueryData(['profiles', data.user_id], data);
    },
  });
};

export const useGetAvatarUrl = (userId) => useQuery({
  queryKey: ['avatar', userId],
  queryFn: async () => {
    if (!userId) return null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('user_id', userId)
      .single();

    if (profile && profile.avatar_url) {
      return profile.avatar_url;
    }
    return null;
  },
  enabled: !!userId,
});