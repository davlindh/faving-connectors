import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkillList from './SkillList.jsx';
import ServiceList from './ServiceList.jsx';
import ProfileForm from './ProfileForm.jsx';
import SkillForm from './SkillForm.jsx';
import ServiceForm from './ServiceForm.jsx';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import FaveScore from '../shared/FaveScore.jsx';
import DetailedFeedback from '../shared/DetailedFeedback.jsx';
import ECKTSlider from '../shared/ECKTSlider.jsx';
import { useProfile, useUser } from '@/integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const { profileId } = useParams();
  const { session } = useSupabase();
  const userId = session?.user?.id;
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(profileId || userId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(profile?.user_id);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

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
    setActiveTab('about');
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
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
          {isOwnProfile && (
            <Button variant="outline" onClick={handleEditToggle}>
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <ProfileForm profile={profile} onEditComplete={handleEditToggle} />
              </TabsContent>
              <TabsContent value="skills">
                <SkillForm profileId={profile.user_id} />
              </TabsContent>
              <TabsContent value="services">
                <ServiceForm profileId={profile.user_id} />
              </TabsContent>
            </Tabs>
          ) : (
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
                <p className="text-gray-600 mb-4">{profile.bio || "No bio available."}</p>
                <p className="text-gray-600">Email: {user.email}</p>
              </TabsContent>
              <TabsContent value="skills">
                <h3 className="font-semibold mb-2">Skills</h3>
                <SkillList profileId={profile.user_id} />
              </TabsContent>
              <TabsContent value="services">
                <h3 className="font-semibold mb-2">Services</h3>
                <ServiceList profileId={profile.user_id} />
              </TabsContent>
              <TabsContent value="eckt">
                <ECKTSlider 
                  value={user.eckt_scores || [0, 0, 0, 0]}
                  onChange={() => {}}
                  readOnly={true}
                />
              </TabsContent>
              <TabsContent value="feedback">
                <DetailedFeedback feedback={mockFeedback} />
              </TabsContent>
            </Tabs>
          )}
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