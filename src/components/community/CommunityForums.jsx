import React, { useState } from 'react';
import { useForums, useTeams } from '@/integrations/supabase/hooks/forums';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { MessageSquare, Search, Plus, Users } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommunityForums = () => {
  const { data: forums, isLoading: forumsLoading, error: forumsError } = useForums();
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('forums');

  const filteredForums = forums?.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeams = teams?.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (forumsLoading || teamsLoading) return <LoadingSkeleton />;
  if (forumsError || teamsError) return <ErrorMessage error={forumsError || teamsError} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community</h1>
        <Button asChild>
          <Link to="/community/create">
            <Plus className="mr-2 h-4 w-4" /> Create Forum or Team
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search forums and teams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="forums">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredForums?.map((forum) => (
              <ForumCard key={forum.id} forum={forum} />
            ))}
          </div>
          {filteredForums?.length === 0 && (
            <EmptyState message="No forums found matching your search criteria." />
          )}
        </TabsContent>
        <TabsContent value="teams">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTeams?.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
          {filteredTeams?.length === 0 && (
            <EmptyState message="No teams found matching your search criteria." />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ForumCard = ({ forum }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{forum.name}</span>
        <MessageSquare className="h-5 w-5 text-gray-400" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{forum.description}</p>
      <div className="flex justify-between items-center">
        <Badge variant="secondary">{forum.category}</Badge>
        <span className="text-sm text-gray-500">{forum.thread_count} threads</span>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-4 w-full">
        <Link to={`/community/forums/${forum.id}`}>View Forum</Link>
      </Button>
    </CardContent>
  </Card>
);

const TeamCard = ({ team }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>{team.name}</span>
        <Users className="h-5 w-5 text-gray-400" />
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{team.description}</p>
      <div className="flex justify-between items-center">
        <Badge variant="secondary">{team.members?.length || 0} members</Badge>
        <span className="text-sm text-gray-500">{team.project_count} projects</span>
      </div>
      <Button asChild variant="outline" size="sm" className="mt-4 w-full">
        <Link to={`/community/teams/${team.id}`}>View Team</Link>
      </Button>
    </CardContent>
  </Card>
);

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-32" />
    </div>
    <Skeleton className="h-10 w-full mb-6" />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="text-center text-red-500 py-8">
    Error loading community data: {error.message}
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-8">{message}</div>
);

export default CommunityForums;