import React from 'react';
import { useParams } from 'react-router-dom';
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

const ProfilePage = () => {
  const { profileId } = useParams();
  const { profile, isLoading, error } = useProfileContext();
  const { session } = useSupabase();

  if (isLoading) return <div className="text-center mt-8">Loading profile...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;
  if (!profile) return <div className="text-center mt-8">No profile found</div>;

  const isOwnProfile = session?.user?.id === profile.user_id;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-grow">
            <CardTitle className="text-2xl">{profile.first_name} {profile.last_name}</CardTitle>
            <p className="text-gray-500">{profile.location}</p>
            <FaveScore score={profile.fave_score || 0} />
          </div>
          {isOwnProfile && (
            <Button variant="outline">Edit Profile</Button>
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
              <p className="text-gray-600 mb-4">{profile.bio || "No bio available."}</p>
              {isOwnProfile && (
                <ProfileForm profile={profile} />
              )}
            </TabsContent>
            <TabsContent value="skills">
              <h3 className="font-semibold mb-2">Skills</h3>
              <SkillList profileId={profile.profile_id} />
            </TabsContent>
            <TabsContent value="services">
              <h3 className="font-semibold mb-2">Services</h3>
              <ServiceList profileId={profile.profile_id} />
            </TabsContent>
            <TabsContent value="eckt">
              <h3 className="font-semibold mb-2">ECKT Score</h3>
              <ECKTSlider value={profile.eckt_score || 50} onChange={(value) => console.log('ECKT Score:', value)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;