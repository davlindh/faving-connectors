import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useImpactMetrics = (projectId) => useQuery({
  queryKey: ['impact_metrics', projectId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('project_impact_metrics')
      .select('*')
      .eq('project_id', projectId);
    if (error) throw error;
    return data;
  },
  enabled: !!projectId,
});

export const useCreateImpactMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMetric) => {
      const { data, error } = await supabase
        .from('project_impact_metrics')
        .insert([newMetric])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['impact_metrics', data.project_id]);
    },
  });
};

export const useUpdateImpactMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ metricId, updates }) => {
      const { data, error } = await supabase
        .from('project_impact_metrics')
        .update(updates)
        .eq('metric_id', metricId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['impact_metrics', data.project_id]);
    },
  });
};

export const useDeleteImpactMetric = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (metricId) => {
      const { data, error } = await supabase
        .from('project_impact_metrics')
        .delete()
        .eq('metric_id', metricId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['impact_metrics', data.project_id]);
    },
  });
};