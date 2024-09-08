import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, MapPin, Briefcase, Star } from 'lucide-react';
import { useStartConversation } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h3 className="font-semibold text-lg">{profile.first_name} {profile.last_name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{profile.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">{profile.bio || 'No bio available'}</p>
          </div>
          
          <div className="flex items-center mb-4">
            <Briefcase className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">{profile.job_title || 'Job title not specified'}</span>
          </div>
          
          <div className="flex items-center mb-4">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="font-medium">{profile.score || 0} Fave Score</span>
          </div>
          
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
                {profile.skills.length > 3 && (
                  <Badge variant="secondary">+{profile.skills.length - 3} more</Badge>
                )}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-4">
            <Button asChild variant="outline" size="sm">
              <Link to={`/profile/${profile.user_id}`}>View Profile</Link>
            </Button>
            <Button onClick={handleStartConversation} size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileCard;