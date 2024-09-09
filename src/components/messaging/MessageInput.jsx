import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() || fileInputRef.current.files[0]) {
      onSendMessage(message, fileInputRef.current.files[0]);
      setMessage('');
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow"
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={() => {}} // Add any necessary logic for file selection
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current.click()}
      >
        <Paperclip className="h-4 w-4" />
      </Button>
      <Button type="submit">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;