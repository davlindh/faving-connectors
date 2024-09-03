import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from 'lucide-react';

const dummyConversations = [
  { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', avatar: '/path/to/john.jpg' },
  { id: 2, name: 'Jane Smith', lastMessage: 'Can we discuss the project?', avatar: '/path/to/jane.jpg' },
  { id: 3, name: 'Bob Johnson', lastMessage: 'Thanks for your help!', avatar: '/path/to/bob.jpg' },
];

const MessagingInterface = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      <div className="w-1/3 border-r bg-gray-50">
        <h2 className="text-xl font-semibold p-4 border-b">Conversations</h2>
        <ScrollArea className="h-[calc(600px-57px)]">
          {dummyConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`flex items-center p-4 hover:bg-gray-100 cursor-pointer ${
                activeConversation === conversation.id ? 'bg-gray-200' : ''
              }`}
              onClick={() => setActiveConversation(conversation.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.avatar} alt={conversation.name} />
                <AvatarFallback>{conversation.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-medium">{conversation.name}</h3>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
      <div className="w-2/3 flex flex-col">
        <Card className="flex-grow border-0 rounded-none">
          <CardHeader className="border-b">
            <CardTitle>Chat with {activeConversation ? dummyConversations.find(c => c.id === activeConversation)?.name : 'Select a conversation'}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[450px] p-4">
              {messages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender === 'You' ? 'text-right' : ''}`}>
                  <div className={`inline-block p-2 rounded-lg ${message.sender === 'You' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    <p>{message.content}</p>
                    <span className="text-xs text-gray-500 mt-1 block">{message.timestamp}</span>
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
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default MessagingInterface;