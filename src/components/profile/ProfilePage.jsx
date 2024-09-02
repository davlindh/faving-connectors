import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillList from './SkillList.jsx';
import ServiceList from './ServiceList.jsx';
import ProfileForm from './ProfileForm.jsx';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore.jsx';
import DetailedFeedback from '../shared/DetailedFeedback.jsx';
import ECKTSlider from '../shared/ECKTSlider.jsx';
import { useProfile, useUser, useUpdateUser } from '@/integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

const ProfilePage = () => {
  const { profileId } = useParams();
  const { session } = useSupabase();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(profileId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(profile?.user_id);
  const updateUser = useUpdateUser();
  const [isEditing, setIsEditing] = useState(false);
  const [ecktScores, setEcktScores] = useState([0, 0, 0, 0]);

  const isOwnProfile = session?.user?.id === profile?.user_id;

  React.useEffect(() => {
    if (user?.eckt_scores) {
      setEcktScores(user.eckt_scores);
    }
  }, [user]);

  if (profileLoading || userLoading) {
    return <ProfileSkeleton />;
  }

  if (profileError || userError) {
    return <div className="text-center mt-8 text-red-500">Error: {profileError?.message || userError?.message}</div>;
  }

  if (!profile || !user) {
    return <div className="text-center mt-8">No profile found</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Message functionality not implemented yet');
  };

  const handleEcktChange = async (newScores) => {
    setEcktScores(newScores);
    try {
      await updateUser.mutateAsync({
        userId: user.user_id,
        updates: { eckt_scores: newScores }
      });
      toast.success('ECKT scores updated successfully');
    } catch (error) {
      toast.error('Failed to update ECKT scores');
      console.error('Update ECKT scores error:', error);
    }
  };

  // Mock feedback data (replace with actual data in a real application)
  const mockFeedback = {
    communication: 85,
    quality: 90,
    timeliness: 80,
    professionalism: 95,
    comments: [
      "Great to work with!",
      "Delivered high-quality work on time.",
      "Excellent communication throughout the project."
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
            <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-2xl">{user.first_name} {user.last_name}</CardTitle>
            <p className="text-gray-500">{profile.location}</p>
            <FaveScore score={user.score || 0} />
          </div>
          {isOwnProfile ? (
            <Button variant="outline" onClick={handleEditToggle}>
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          ) : (
            <Button onClick={handleMessage}>Message</Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="eckt">ECKT</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <h3 className="font-semibold mb-2">Bio</h3>
              {isEditing ? (
                <ProfileForm profile={profile} onEditComplete={() => setIsEditing(false)} />
              ) : (
                <>
                  <p className="text-gray-600 mb-4">{profile.bio || "No bio available."}</p>
                  <p className="text-gray-600">Email: {user.email}</p>
                </>
              )}
            </TabsContent>
            <TabsContent value="skills">
              <h3 className="font-semibold mb-2">Skills</h3>
              <SkillList profileId={profile.profile_id} isEditable={isOwnProfile} />
            </TabsContent>
            <TabsContent value="services">
              <h3 className="font-semibold mb-2">Services</h3>
              <ServiceList profileId={profile.profile_id} isEditable={isOwnProfile} />
            </TabsContent>
            <TabsContent value="eckt">
              <ECKTSlider 
                value={ecktScores} 
                onChange={handleEcktChange} 
                readOnly={!isOwnProfile}
              />
            </TabsContent>
            <TabsContent value="feedback">
              <DetailedFeedback feedback={mockFeedback} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfileSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-grow">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  </div>
);

export default ProfilePage;