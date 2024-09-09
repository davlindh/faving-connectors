import { useState } from 'react';
import { useMessages, useCreateMessage } from '@/integrations/supabase';
import { toast } from 'sonner';

export const useMessageHandling = (senderId, recipientId) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const { data: messages, isLoading, error } = useMessages(senderId, recipientId);
  const createMessage = useCreateMessage();

  const handleSendMessage = async (content, attachment) => {
    if (!selectedConversation) {
      toast.error('Please select a conversation first');
      return;
    }

    const formData = new FormData();
    formData.append('sender_id', senderId);
    formData.append('recipient_id', selectedConversation.user_id);
    formData.append('content', content);
    formData.append('sent_at', new Date().toISOString());

    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      await createMessage.mutateAsync(formData);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return {
    messages,
    isLoading,
    error,
    selectedConversation,
    setSelectedConversation,
    handleSendMessage,
  };
};