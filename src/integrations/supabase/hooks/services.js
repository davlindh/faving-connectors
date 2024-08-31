import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### sevices (Note: This appears to be a typo in the OpenAPI spec, should be "services")

| name         | type    | format | required |
|--------------|---------|--------|----------|
| service_id   | uuid    | uuid   | true     |
| user_id      | uuid    | uuid   | true     |
| service_name | text    | string | true     |
| description  | text    | string | true     |
| category     | text    | string | false    |
| price        | numeric | number | false    |

Note: service_id is the Primary Key
*/

export const useServices = () => useQuery({
  queryKey: ['services'],
  queryFn: async () => {
    const { data, error } = await supabase.from('sevices').select('*');
    if (error) throw error;
    return data;
  },
});

export const useService = (serviceId) => useQuery({
  queryKey: ['services', serviceId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('sevices')
      .select('*')
      .eq('service_id', serviceId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newService) => {
      const { data, error } = await supabase.from('sevices').insert([newService]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ serviceId, updates }) => {
      const { data, error } = await supabase
        .from('sevices')
        .update(updates)
        .eq('service_id', serviceId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { serviceId }) => {
      queryClient.invalidateQueries(['services']);
      queryClient.invalidateQueries(['services', serviceId]);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId) => {
      const { data, error } = await supabase
        .from('sevices')
        .delete()
        .eq('service_id', serviceId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};