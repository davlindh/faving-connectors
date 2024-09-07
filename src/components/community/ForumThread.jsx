import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForumThread, useCreateForumPost } from '@/integrations/supabase/hooks/forums';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from 'date-fns';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const ForumThread = () => {
  const { threadId } = useParams();
  const { data: thread, isLoading, error } = useForumThread(threadId);
  const createPost = useCreateForumPost();
  const [newPost, setNewPost] = useState('');
  const { session } = useSupabase();

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    if (!session) {
      toast.error('You must be logged in to post');
      return;
    }
    try {
      await createPost.mutateAsync({
        thread_id: threadId,
        user_id: session.user.id,
        content: newPost,
      });
      setNewPost('');
      toast.success('Post submitted successfully');
    } catch (error) {
      toast.error('Failed to submit post');
    }
  };

  if (isLoading) return <ThreadSkeleton />;
  if (error) return <div className="text-center text-red-500 py-8">Error loading thread: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{thread.title}</CardTitle>
          <div className="text-sm text-gray-500">
            Started by {thread.author.name} on {format(new Date(thread.created_at), 'PPP')}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {thread.posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarImage src={post.author.avatar_url} alt={post.author.name} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{post.author.name}</div>
                      <div className="text-sm text-gray-500">{format(new Date(post.created_at), 'PPP')}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmitPost} className="w-full">
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Write your reply..."
              className="mb-4"
            />
            <Button type="submit" disabled={!newPost.trim() || createPost.isPending}>
              {createPost.isPending ? 'Posting...' : 'Post Reply'}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

const ThreadSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <Card>
      <CardHeader>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-4" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  </div>
);

export default ForumThread;