import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useCreateProjectInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newInterest) => {
      const { data, error } = await supabase
        .from('project_interests')
        .insert([newInterest])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['projects', data.project_id]);
      queryClient.invalidateQueries(['project_interests']);
    },
  });
};

export const useProjectInterests = (projectId) => {
  return useQuery({
    queryKey: ['project_interests', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_interests')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    enabled: !!projectId,
  });
};