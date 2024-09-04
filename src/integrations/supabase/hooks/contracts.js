import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useContracts = () => useQuery({
  queryKey: ['contracts'],
  queryFn: async () => {
    const { data, error } = await supabase.from('contracts').select('*');
    if (error) throw error;
    return data;
  },
});

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newContract) => {
      const { data, error } = await supabase.from('contracts').insert([newContract]).select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
    },
  });
};

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ contractId, updates }) => {
      const { data, error } = await supabase
        .from('contracts')
        .update(updates)
        .eq('id', contractId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
    },
  });
};

export const useDeleteContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (contractId) => {
      const { error } = await supabase.from('contracts').delete().eq('id', contractId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts']);
    },
  });
};