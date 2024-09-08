import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useFeedback = (origin) => useQuery({
  queryKey: ['feedback', origin],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('origin', origin);
    if (error) throw error;
    return data;
  },
});

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newFeedback) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([newFeedback])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['feedback', data.origin]);
    },
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ feedbackId, updates }) => {
      const { data, error } = await supabase
        .from('feedback')
        .update(updates)
        .eq('feedback_id', feedbackId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['feedback', data.origin]);
    },
  });
};

export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (feedbackId) => {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('feedback_id', feedbackId);
      if (error) throw error;
    },
    onSuccess: (_, feedbackId) => {
      queryClient.invalidateQueries(['feedback']);
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newComment) => {
      const { data, error } = await supabase
        .from('feedback')
        .insert([{
          ...newComment,
          type: 'comment',
          origin: `article_${newComment.article_id}`,
        }])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['feedback', `article_${data.article_id}`]);
    },
  });
};

export const useArticleComments = (articleId) => useQuery({
  queryKey: ['feedback', `article_${articleId}`, 'comments'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('feedback')
      .select('*, user:users(*)')
      .eq('origin', `article_${articleId}`)
      .eq('type', 'comment')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  enabled: !!articleId,
});