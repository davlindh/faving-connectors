import React, { useState } from 'react';
import { useProfiles, useProjects } from '@/integrations/supabase';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from 'lucide-react';
import UserCard from './UserCard';

const ProfileSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();

  const filteredProfiles = profiles?.filter(profile => 
    profile.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const isLoading = profilesLoading || projectsLoading;
  const error = profilesError || projectsError;

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
      {isLoading && <div className="text-center py-4">Loading profiles...</div>}
      {error && <div className="text-center text-red-500 py-4">Error: {error.message}</div>}
      {!isLoading && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfiles.map((profile) => (
            <UserCard key={profile.user_id} user={profile} projects={projects} />
          ))}
        </div>
      )}
      {filteredProfiles.length === 0 && !isLoading && (
        <div className="text-center py-4">No profiles found matching your search criteria.</div>
      )}
    </div>
  );
};

export default ProfileSearchPage;