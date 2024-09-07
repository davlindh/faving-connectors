import React, { useState } from 'react';
import { useForums } from '@/integrations/supabase/hooks/forums';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from 'react-router-dom';
import { MessageSquare, Search } from 'lucide-react';

const CommunityForums = () => {
  const { data: forums, isLoading, error } = useForums();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredForums = forums?.filter(forum =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forum.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="text-center py-8">Loading forums...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading forums: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community Forums</h1>
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
                <span className="text-sm text-gray-500">{forum.topic_count} topics</span>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/community/forums/${forum.id}`}>View Forum</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityForums;