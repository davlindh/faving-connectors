import React, { useState, useEffect } from 'react';
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
import ECKTSlider from '../shared/ECKTSlider.jsx';
import { useProfile, useUser, useUpdateProfile, useCreateProfile } from '@/integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';

const ProfilePage = () => {
  const { profileId } = useParams();
  const { session } = useSupabase();
  const userId = session?.user?.id;
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(profileId || userId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(profile?.user_id);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const updateProfile = useUpdateProfile();
  const createProfile = useCreateProfile();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const isOwnProfile = session?.user?.id === profile?.user_id;

  useEffect(() => {
    if (profileError && profileError.message.includes("No rows returned") && isOwnProfile) {
      setIsCreatingProfile(true);
    }
  }, [profileError, isOwnProfile]);

  const handleCreateProfile = async () => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create a profile');
      return;
    }

    try {
      const newProfile = {
        user_id: session.user.id,
        first_name: '',
        last_name: '',
        bio: '',
        location: '',
        avatar_url: '',
      };

      await createProfile.mutateAsync(newProfile);
      toast.success('Profile created successfully');
      setIsCreatingProfile(false);
      window.location.reload(); // Reload the page to fetch the new profile
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  if (profileLoading || userLoading) {
    return <ProfileSkeleton />;
  }

  if (isCreatingProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You don't have a profile yet. Let's create one!</p>
            <Button onClick={handleCreateProfile}>Create Profile</Button>
          </CardContent>
        </Card>
      </div>
    );
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

  const handleECKTUpdate = async (newECKTScores, feedback) => {
    try {
      await updateProfile.mutateAsync({
        userId: profile.user_id,
        updates: {
          eckt_scores: newECKTScores,
          feedback: feedback
        }
      });
      toast.success('ECKT scores and feedback updated successfully');
    } catch (error) {
      toast.error('Failed to update ECKT scores and feedback');
      console.error('Update ECKT error:', error);
    }
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="eckt">ECKT & Feedback</TabsTrigger>
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
                  value={profile.eckt_scores || [0, 0, 0, 0]}
                  feedback={profile.feedback || ''}
                  onChange={handleECKTUpdate}
                  readOnly={!isOwnProfile}
                />
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