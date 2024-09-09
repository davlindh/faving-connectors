import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProfiles } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { useMessageHandling } from '@/hooks/useMessageHandling';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationList from './ConversationList';
import { ScrollArea } from "@/components/ui/scroll-area";

const MessagingInterface = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const { session } = useSupabase();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const {
    messages,
    isLoading: messagesLoading,
    error: messagesError,
    selectedConversation,
    setSelectedConversation,
    handleSendMessage,
  } = useMessageHandling(session?.user?.id, recipientId);

  if (profilesLoading || messagesLoading) {
    return <div className="text-center p-4">Loading conversations...</div>;
  }

  if (messagesError) {
    return <div className="text-center text-red-500 p-4">Error loading messages: {messagesError.message}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden bg-white">
      <div className="w-1/3 border-r">
        <ConversationList
          profiles={profiles}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
        />
      </div>
      <div className="w-2/3 flex flex-col">
        <Card className="flex-grow border-0 rounded-none shadow-none">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              {selectedConversation ? `Chat with ${selectedConversation.first_name} ${selectedConversation.last_name}` : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-full p-4">
              {selectedConversation && (
                <MessageList
                  messages={messages}
                  currentUserId={session?.user?.id}
                />
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        <div className="p-4 border-t">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;