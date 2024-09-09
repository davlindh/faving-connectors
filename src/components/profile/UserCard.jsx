import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserCard = ({ user, projects }) => {
  const userProjects = projects?.filter(project => project.creator_id === user.user_id) || [];
  const recentProjects = userProjects.slice(0, 2);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
          <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{user.first_name} {user.last_name}</CardTitle>
          <p className="text-sm text-gray-500">{user.location || 'Location not specified'}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">{user.bio || 'No bio available'}</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-sm font-medium">Fave Score: {user.score || 0}</span>
          </div>
        </div>
        {user.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
              {user.skills.length > 3 && (
                <Badge variant="secondary">+{user.skills.length - 3} more</Badge>
              )}
            </div>
          </div>
        )}
        {recentProjects.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold mb-2">Recent Projects:</h4>
            <ul className="list-disc list-inside">
              {recentProjects.map(project => (
                <li key={project.project_id} className="text-sm">{project.project_name}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <Button asChild variant="outline" size="sm">
            <Link to={`/profile/${user.user_id}`}>View Profile</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/messages?recipientId=${user.user_id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;