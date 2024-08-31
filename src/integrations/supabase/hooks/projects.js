import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### projects

| name            | type                    | format | required |
|-----------------|-------------------------|--------|----------|
| description     | text                    | string | false    |
| category        | text                    | string | false    |
| location        | text                    | string | false    |
| required_skills | text[]                  | array  | false    |
| start_date      | timestamp with time zone| string | false    |
| end_date        | timestamp with time zone| string | false    |
| creator_id      | uuid                    | uuid   | true     |
| project_name    | text                    | string | true     |
| interested_users| uuid[]                  | array  | true     |
| project_id      | uuid                    | uuid   | false    |

Note: project_id is the Primary Key
Foreign Key: creator_id references profiles.profile_id
*/

export const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: async () => {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    return data;
  },
});

export const useProject = (projectId) => useQuery({
  queryKey: ['projects', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('project_id', projectId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newProject) => {
      const { data, error } = await supabase.from('projects').insert([newProject]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, updates }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries(['projects']);
      queryClient.invalidateQueries(['projects', projectId]);
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId) => {
      const { data, error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', projectId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
    },
  });
};