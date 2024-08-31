import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SkillList from './SkillList.jsx';
import ServiceList from './ServiceList.jsx';
import { useProfile } from '@/integrations/supabase';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { profileId } = useParams();
  const { data: profile, isLoading, error } = useProfile(profileId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{profile.bio}</p>
          <h3 className="font-semibold mb-2">Skills</h3>
          <SkillList profileId={profile.profile_id} />
          <h3 className="font-semibold mt-4 mb-2">Services</h3>
          <ServiceList profileId={profile.profile_id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
