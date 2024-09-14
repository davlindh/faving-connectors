import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const TeamMembers = ({ members }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">Team Members</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member) => (
        <Card key={member.user_id}>
          <CardContent className="flex items-center p-4">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={member.avatar_url} alt={`${member.first_name} ${member.last_name}`} />
              <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{member.first_name} {member.last_name}</p>
              <p className="text-sm text-gray-500">{member.role}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {members.length === 0 && <p>No members in this team yet.</p>}
  </div>
);

export default TeamMembers;