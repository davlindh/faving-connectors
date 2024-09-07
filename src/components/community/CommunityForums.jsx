import React, { useState } from 'react';
import { useForums } from '@/integrations/supabase/hooks/forums';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { MessageSquare, Search, Plus } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityForums = () => {
  const { data: forums, isLoading, error } = useForums();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForums = forums?.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <ForumsSkeleton />;
  if (error) return <div className="text-center text-red-500 py-8">Error loading forums: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Community Forums</h1>
        <Button asChild>
          <Link to="/community/forums/create">
            <Plus className="mr-2 h-4 w-4" /> Create Forum
          </Link>
        </Button>
      </div>
      <div className="mb-6">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search forums..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredForums?.map((forum) => (
          <Card key={forum.id} className="hover:shadow-lg transition-shadow duration-300">
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
        ))}
      </div>
      {filteredForums?.length === 0 && (
        <div className="text-center py-8">No forums found matching your search criteria.</div>
      )}
    </div>
  );
};

const ForumsSkeleton = () => (
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

export default CommunityForums;