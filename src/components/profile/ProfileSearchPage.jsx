import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProfiles } from '@/integrations/supabase';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from 'lucide-react';

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Find Profiles</h1>
      <div className="mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Button onClick={() => setSearchTerm('')} variant="outline" className="mt-2">
          Clear
        </Button>
      </div>
      {isLoading && <p className="text-center py-4">Loading profiles...</p>}
      {error && <p className="text-center text-red-500 py-4">Error: {error.message}</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <Card key={profile.profile_id}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
                  <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{profile.first_name} {profile.last_name}</h2>
                  <p className="text-sm text-gray-500 mb-2">{profile.location}</p>
                  <Link to={`/profile/${profile.profile_id}`} className="text-blue-500 hover:underline text-sm">
                    View Profile
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {filteredProfiles.length === 0 && (
        <p className="text-center py-4">No profiles found matching your search criteria.</p>
      )}
    </div>
  );
};

export default ProfileSearchPage;