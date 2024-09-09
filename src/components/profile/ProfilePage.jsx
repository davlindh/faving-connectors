import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { useProfile, useUser, useUpdateProfile, useCreateProfile, useProjects, useSkills, useServices } from '@/integrations/supabase';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from 'sonner';
import ProfileForm from './ProfileForm';
import SkillList from './SkillList';
import ServiceList from './ServiceList';
import ProjectCard from '../project/ProjectCard';
import ECKTSlider from '../shared/ECKTSlider';

const ProfilePage = () => {
  const { profileId } = useParams();
  const { session } = useSupabase();
  const userId = profileId || session?.user?.id;
  const { data: profile, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useProfile(userId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(profile?.user_id);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const updateProfile = useUpdateProfile();
  const createProfile = useCreateProfile();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const { data: userProjects, isLoading: projectsLoading, error: projectsError } = useProjects(profile?.user_id);
  const { data: userSkills, isLoading: skillsLoading, error: skillsError } = useSkills(profile?.user_id);
  const { data: userServices, isLoading: servicesLoading, error: servicesError } = useServices(profile?.user_id);

  const isOwnProfile = session?.user?.id === profile?.user_id;

  useEffect(() => {
    if (profileError && profileError.message.includes("No rows returned") && isOwnProfile) {
      setIsCreatingProfile(true);
    }
  }, [profileError, isOwnProfile]);

  useEffect(() => {
    refetchProfile();
  }, [profileId, refetchProfile]);

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
      refetchProfile();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile');
    }
  };

  if (profileLoading || userLoading) {
    return <ProfileSkeleton />;
  }

  if (profileError) {
    console.error('Profile error:', profileError);
    return <div className="text-center mt-8">Error loading profile: {profileError.message}</div>;
  }

  if (userError) {
    console.error('User error:', userError);
    return <div className="text-center mt-8">Error loading user data: {userError.message}</div>;
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
           </div>
          {isOwnProfile && (
            <Button variant="outline" onClick={handleEditToggle}>
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ProfileForm profile={profile} onEditComplete={handleEditToggle} />
          ) : (
            <Tabs defaultValue="about" onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
              </TabsList>
              <TabsContent value="about">
                <AboutTab profile={profile} user={user} />
              </TabsContent>
              <TabsContent value="skills">
                <SkillsTab skills={userSkills} isLoading={skillsLoading} error={skillsError} />
              </TabsContent>
              <TabsContent value="services">
                <ServicesTab services={userServices} isLoading={servicesLoading} error={servicesError} />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsTab projects={userProjects} isLoading={projectsLoading} error={projectsError} />
              </TabsContent>
              <TabsContent value="feedback">
                <FeedbackTab profile={profile} isOwnProfile={isOwnProfile} onUpdate={handleECKTUpdate} />
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
      <CardHeader>
        <Skeleton className="h-8 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-4" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <Skeleton className="h-4 w-1/2" />
      </CardContent>
    </Card>
  </div>
);

const AboutTab = ({ profile, user }) => (
  <div>
    <h3 className="font-semibold mb-2">Bio</h3>
    <p className="text-gray-600 mb-4">{profile.bio || "No bio available."}</p>
    <p className="text-gray-600">Email: {user.email}</p>
  </div>
);

const SkillsTab = ({ skills, isLoading, error }) => (
  <div>
    <h3 className="font-semibold mb-2">Skills</h3>
    {isLoading ? (
      <p>Loading skills...</p>
    ) : error ? (
      <p>Error loading skills: {error.message}</p>
    ) : (
      <SkillList skills={skills} />
    )}
  </div>
);

const ServicesTab = ({ services, isLoading, error }) => (
  <div>
    <h3 className="font-semibold mb-2">Services</h3>
    {isLoading ? (
      <p>Loading services...</p>
    ) : error ? (
      <p>Error loading services: {error.message}</p>
    ) : (
      <ServiceList services={services} />
    )}
  </div>
);

const ProjectsTab = ({ projects, isLoading, error }) => (
  <div>
    <h3 className="font-semibold mb-2">Projects</h3>
    {isLoading ? (
      <p>Loading projects...</p>
    ) : error ? (
      <p>Error loading projects: {error.message}</p>
    ) : projects && projects.length > 0 ? (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    ) : (
      <p>No projects found for this user.</p>
    )}
  </div>
);

const FeedbackTab = ({ profile, isOwnProfile, onUpdate }) => (
  <div>
    <h3 className="font-semibold mb-2">Feedback and ECKT Scores</h3>
    <ECKTSlider 
      value={profile.eckt_scores || [0, 0, 0, 0]}
      feedback={profile.feedback || ''}
      onChange={onUpdate}
      readOnly={!isOwnProfile}
    />
  </div>
);

export default ProfilePage;