import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useForums = () => useQuery({
  queryKey: ['forums'],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('forums')
      .select('*');
    if (error) throw error;
    return data;
  },
});

export const useForum = (forumId) => useQuery({
  queryKey: ['forums', forumId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('forums')
      .select('*')
      .eq('id', forumId)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!forumId,
});

export const useForumThread = (threadId) => useQuery({
  queryKey: ['forum_threads', threadId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('forum_threads')
      .select(`
        *,
        author:users(id, name, avatar_url),
        posts:forum_posts(
          id,
          content,
          created_at,
          author:users(id, name, avatar_url)
        )
      `)
      .eq('id', threadId)
      .single();
    if (error) throw error;
    return data;
  },
  enabled: !!threadId,
});

export const useCreateForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newForum) => {
      const { data, error } = await supabase
        .from('forums')
        .insert([newForum])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forums']);
    },
  });
};

export const useCreateForumThread = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newThread) => {
      const { data, error } = await supabase
        .from('forum_threads')
        .insert([newThread])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['forums', data.forum_id]);
      queryClient.invalidateQueries(['forum_threads']);
    },
  });
};

export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([newPost])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['forum_threads', data.thread_id]);
    },
  });
};

export const useUpdateForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ forumId, updates }) => {
      const { data, error } = await supabase
        .from('forums')
        .update(updates)
        .eq('id', forumId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['forums']);
      queryClient.invalidateQueries(['forums', data.id]);
    },
  });
};

export const useDeleteForum = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (forumId) => {
      const { error } = await supabase
        .from('forums')
        .delete()
        .eq('id', forumId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['forums']);
    },
  });
};