import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const ConversationList = ({ profiles, selectedConversation, onSelectConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles?.filter(profile => 
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
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
              selectedConversation?.user_id === profile.user_id ? 'bg-gray-200' : ''
            }`}
            onClick={() => onSelectConversation(profile)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{profile.first_name} {profile.last_name}</h3>
              <p className="text-sm text-gray-500 truncate">{profile.email}</p>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;