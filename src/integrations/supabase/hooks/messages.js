import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useMessages = (senderId, recipientId) => useQuery({
  queryKey: ['messages', senderId, recipientId],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${senderId},recipient_id.eq.${senderId}`)
      .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
      .order('sent_at', { ascending: true });
    if (error) throw error;
    return data;
  },
  enabled: !!senderId && !!recipientId,
});

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      let attachment_url = null;
      if (formData.get('attachment')) {
        const file = formData.get('attachment');
        const { data: fileData, error: fileError } = await supabase.storage
          .from('message_attachments')
          .upload(`${Date.now()}_${file.name}`, file);
        
        if (fileError) throw fileError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('message_attachments')
          .getPublicUrl(fileData.path);
        
        attachment_url = publicUrl;
      }

      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: formData.get('sender_id'),
          recipient_id: formData.get('recipient_id'),
          content: formData.get('content'),
          sent_at: formData.get('sent_at'),
          attachment_url: attachment_url
        }])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['messages', data.sender_id, data.recipient_id]);
    },
  });
};

export const useRecentConversations = (userId) => useQuery({
  queryKey: ['recentConversations', userId],
  queryFn: async () => {
    const { data, error } = await supabase.rpc('get_recent_conversations', { p_user_id: userId });
    if (error) {
      console.error('Error fetching recent conversations:', error);
      return []; // Return an empty array instead of throwing an error
    }
    return data;
  },
  enabled: !!userId,
});

export const useStartConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ senderId, recipientId, content }) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          sender_id: senderId,
          recipient_id: recipientId,
          content: content,
          sent_at: new Date().toISOString(),
        }])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['recentConversations', data.sender_id]);
      queryClient.invalidateQueries(['messages', data.sender_id, data.recipient_id]);
    },
  });
};