import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfiles } from '@/integrations/supabase';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfileSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: profiles, isLoading, error } = useProfiles();

  const filteredProfiles = profiles?.filter(profile => 
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Find Profiles</h1>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search profiles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Button onClick={() => setSearchTerm('')}>Clear</Button>
      </div>
      {isLoading && <p>Loading profiles...</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <Card key={profile.profile_id}>
            <CardContent className="flex items-center p-4">
              <Avatar className="h-12 w-12 mr-4">
                <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{profile.first_name} {profile.last_name}</h2>
                <p className="text-sm text-gray-500">{profile.location}</p>
                <Link to={`/profile/${profile.profile_id}`} className="text-blue-500 hover:underline">
                  View Profile
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileSearchPage;