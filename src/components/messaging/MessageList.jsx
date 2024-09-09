import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageList = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div key={message.message_id} className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender_id === currentUserId ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg p-3`}>
            <div className="flex items-center mb-1">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={message.sender.avatar_url} alt={`${message.sender.first_name} ${message.sender.last_name}`} />
                <AvatarFallback>{message.sender.first_name[0]}{message.sender.last_name[0]}</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-sm">{message.sender.first_name} {message.sender.last_name}</span>
            </div>
            <p>{message.content}</p>
            {message.attachment_url && (
              <a href={message.attachment_url} target="_blank" rel="noopener noreferrer" className="text-sm underline mt-1 block">
                View Attachment
              </a>
            )}
            <span className="text-xs opacity-75 mt-1 block">
              {format(new Date(message.sent_at), 'MMM d, yyyy HH:mm')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;