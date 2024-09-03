import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useUsers = () => useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;
    return data;
  },
});

export const useUser = (userId) => useQuery({
  queryKey: ['users', userId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUser) => {
      // Remove user_id from newUser object if it exists
      const { user_id, ...userDataWithoutId } = newUser;
      
      const { data, error } = await supabase
        .from('users')
        .insert([userDataWithoutId])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.setQueryData(['users', data.user_id], data);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, updates }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['users']);
      queryClient.setQueryData(['users', data.user_id], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId) => {
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries(['users']);
      queryClient.removeQueries(['users', userId]);
    },
  });
};