import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### users

| name       | type                    | format | required |
|------------|-------------------------|--------|----------|
| user_id    | uuid                    | uuid   | true     |
| first_name | text                    | string | false    |
| last_name  | text                    | string | false    |
| email      | text                    | string | true     |
| created_at | timestamp with time zone| string | true     |
| updated_at | time with time zone     | string | false    |
| score      | numeric                 | number | false    |

Note: user_id is the Primary Key
*/

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
      const { data, error } = await supabase.from('users').insert([newUser]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
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
        .eq('user_id', userId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['users', userId]);
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
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};