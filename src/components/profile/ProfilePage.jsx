import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillList from './SkillList.jsx';
import ServiceList from './ServiceList.jsx';
import ProfileForm from './ProfileForm.jsx';
import { useProfileContext } from '@/contexts/ProfileContext';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore.jsx';
import ECKTSlider from '../shared/ECKTSlider.jsx';
import { useProfile, useUser } from '@/integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { profileId } = useParams();
  const { session } = useSupabase();
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(profileId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(profile?.user_id);
  const [isEditing, setIsEditing] = React.useState(false);

  const isOwnProfile = session?.user?.id === profile?.user_id;

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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="eckt">ECKT</TabsTrigger>
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
              <h3 className="font-semibold mb-2">ECKT Score</h3>
              <ECKTSlider value={user.score || 50} onChange={(value) => console.log('ECKT Score:', value)} />
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