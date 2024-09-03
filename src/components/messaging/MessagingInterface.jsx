import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';
import { useProfiles, useMessages, useCreateMessage } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { format } from 'date-fns';

const MessagingInterface = () => {
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { session } = useSupabase();
  const createMessage = useCreateMessage();
  
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(
    session?.user?.id,
    activeConversation?.user_id
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !activeConversation) return;

    try {
      await createMessage.mutateAsync({
        sender_id: session.user.id,
        recipient_id: activeConversation.user_id,
        content: newMessage,
        sent_at: new Date().toISOString(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      <div className="w-1/3 border-r bg-gray-50">
        <h2 className="text-xl font-semibold p-4 border-b">Profiles</h2>
        <ScrollArea className="h-[calc(600px-57px)]">
          {profilesLoading && <p className="p-4">Loading profiles...</p>}
          {profilesError && <p className="p-4 text-red-500">Error loading profiles: {profilesError.message}</p>}
          {profiles && profiles.map((profile) => (
            <div
              key={profile.user_id}
              className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                activeConversation?.user_id === profile.user_id ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveConversation(profile)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{profile.first_name} {profile.last_name}</h3>
                <p className="text-sm text-gray-500 truncate">{profile.location || 'No location set'}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 flex flex-col">
        <Card className="flex-grow border-0 rounded-none">
          <CardHeader className="border-b">
            <CardTitle>Chat with {activeConversation ? `${activeConversation.first_name} ${activeConversation.last_name}` : 'Select a profile'}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px] p-4">
              {messagesLoading && <p className="text-center">Loading messages...</p>}
              {messagesError && <p className="text-center text-red-500">Error loading messages: {messagesError.message}</p>}
              {messages && messages.map((message) => (
                <div key={message.message_id} className={`mb-4 ${message.sender_id === session.user.id ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.sender_id === session.user.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1 block">
                      {format(new Date(message.sent_at), 'MMM d, yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        <form onSubmit={handleSendMessage} className="p-4 border-t flex">
          <Input
            className="flex-grow mr-2"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!activeConversation}
          />
          <Button type="submit" disabled={!activeConversation}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessagingInterface;