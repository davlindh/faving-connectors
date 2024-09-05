import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useStartConversation } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const startConversation = useStartConversation();
  const { session } = useSupabase();

  const handleStartConversation = async () => {
    if (!session?.user?.id) {
      toast.error('Please log in to send messages');
      return;
    }

    try {
      const { data } = await startConversation.mutateAsync({
        senderId: session.user.id,
        recipientId: profile.user_id,
        content: 'Hello! I would like to start a conversation.',
      });
      navigate(`/messages?recipientId=${profile.user_id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <h3 className="font-semibold text-lg">{profile.first_name} {profile.last_name}</h3>
            <p className="text-sm text-gray-500">{profile.location}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button asChild variant="outline" size="sm">
            <Link to={`/profile/${profile.user_id}`}>View Profile</Link>
          </Button>
          <Button onClick={handleStartConversation} size="sm">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;