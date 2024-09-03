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
    mutationFn: async (newMessage) => {
      const { data, error } = await supabase
        .from('messages')
        .insert([newMessage])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['messages', data.sender_id, data.recipient_id]);
    },
  });
};