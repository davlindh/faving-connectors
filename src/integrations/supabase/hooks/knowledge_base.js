import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### knowledge_base

| name        | type                    | format | required |
|-------------|-------------------------|--------|----------|
| article_id  | uuid                    | uuid   | true     |
| author_id   | uuid                    | uuid   | true     |
| title       | text                    | string | true     |
| content     | text                    | string | true     |
| category    | text                    | string | true     |
| published_at| timestamp with time zone| string | true     |
| updated_at  | time with time zone     | string | false    |
| created_at  | time with time zone     | string | false    |

Note: article_id is the Primary Key
*/

export const useKnowledgeBase = () => useQuery({
  queryKey: ['knowledge_base'],
  queryFn: async () => {
    const { data, error } = await supabase.from('knowledge_base').select('*');
    if (error) throw error;
    return data;
  },
});

export const useKnowledgeBaseArticle = (articleId) => useQuery({
  queryKey: ['knowledge_base', articleId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('article_id', articleId)
      .single();
    if (error) throw error;
    return data;
  },
});

export const useCreateKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newArticle) => {
      const { data, error } = await supabase.from('knowledge_base').insert([newArticle]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledge_base']);
    },
  });
};

export const useUpdateKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ articleId, updates }) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .update(updates)
        .eq('article_id', articleId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { articleId }) => {
      queryClient.invalidateQueries(['knowledge_base']);
      queryClient.invalidateQueries(['knowledge_base', articleId]);
    },
  });
};

export const useDeleteKnowledgeBaseArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (articleId) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('article_id', articleId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledge_base']);
    },
  });
};