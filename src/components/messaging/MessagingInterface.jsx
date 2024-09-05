import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search } from 'lucide-react';
import { useProfiles, useMessages, useCreateMessage } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { format } from 'date-fns';
import { toast } from 'sonner';

const MessagingInterface = () => {
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { session } = useSupabase();
  const createMessage = useCreateMessage();
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(
    session?.user?.id,
    activeConversation?.user_id
  );

  const filteredProfiles = profiles?.filter(profile => 
    profile.user_id !== session?.user?.id &&
    (profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

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
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (profilesLoading) {
    return <div className="text-center p-4">Loading profiles...</div>;
  }

  if (profilesError) {
    return <div className="text-center p-4 text-red-500">Error loading profiles: {profilesError.message}</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-lg overflow-hidden bg-white">
      <div className="w-1/3 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold mb-2">Conversations</h2>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search profiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          {filteredProfiles.map((profile) => (
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
              <div>
                <h3 className="font-medium">{profile.first_name} {profile.last_name}</h3>
                <p className="text-sm text-gray-500 truncate">{profile.location || 'No location set'}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 flex flex-col">
        <Card className="flex-grow border-0 rounded-none shadow-none">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              {activeConversation ? `Chat with ${activeConversation.first_name} ${activeConversation.last_name}` : 'Select a profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-grow overflow-hidden">
            <ScrollArea className="h-full p-4">
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
              <div ref={messagesEndRef} />
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
          <Button type="submit" disabled={!activeConversation || newMessage.trim() === ''}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessagingInterface;