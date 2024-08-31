import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### skills

| name       | type | format | required |
|------------|------|--------|----------|
| skill_id   | uuid | uuid   | true     |
| user_id    | uuid | uuid   | true     |
| skill_name | text | string | true     |

Note: skill_id is the Primary Key
*/

export const useSkills = () => useQuery({
  queryKey: ['skills'],
  queryFn: async () => {
    const { data, error } = await supabase.from('skills').select('*');
    if (error) throw error;
    return data;
  },
});

export const useSkill = (skillId) => useQuery({
  queryKey: ['skills', skillId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('skill_id', skillId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newSkill) => {
      const { data, error } = await supabase.from('skills').insert([newSkill]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills']);
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ skillId, updates }) => {
      const { data, error } = await supabase
        .from('skills')
        .update(updates)
        .eq('skill_id', skillId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { skillId }) => {
      queryClient.invalidateQueries(['skills']);
      queryClient.invalidateQueries(['skills', skillId]);
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (skillId) => {
      const { data, error } = await supabase
        .from('skills')
        .delete()
        .eq('skill_id', skillId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['skills']);
    },
  });
};