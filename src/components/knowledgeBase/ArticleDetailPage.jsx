import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useKnowledgeBaseArticle, useUpdateKnowledgeBaseArticle, useDeleteKnowledgeBaseArticle, useCreateComment, useArticleComments } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, ArrowLeft, Edit, Trash, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { calculateReadTime } from '@/utils/knowledgeBaseUtils';

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500, 'Comment must be 500 characters or less'),
});

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useKnowledgeBaseArticle(articleId);
  const updateArticle = useUpdateKnowledgeBaseArticle();
  const deleteArticle = useDeleteKnowledgeBaseArticle();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('content');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const createComment = useCreateComment();
  const { data: comments, isLoading: commentsLoading } = useArticleComments(articleId);
  const [likes, setLikes] = useState(0);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: '',
    },
  });

  useEffect(() => {
    if (article) {
      setEditedContent(article.content);
      setLikes(article.likes || 0);
    }
  }, [article]);

  if (isLoading) return <div className="text-center mt-8">Loading article details...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading article: {error.message}</div>;
  if (!article) return <div className="text-center mt-8">Article not found</div>;

  const handleDelete = async () => {
    try {
      await deleteArticle.mutateAsync(articleId);
      toast.success('Article deleted successfully');
      navigate('/knowledge-base');
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleEdit = async () => {
    try {
      await updateArticle.mutateAsync({
        articleId,
        updates: { content: editedContent, updated_at: new Date().toISOString() },
      });
      toast.success('Article updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update article');
    }
  };

  const handleCommentSubmit = async (data) => {
    try {
      await createComment.mutateAsync({
        article_id: articleId,
        user_id: session.user.id,
        content: data.content,
      });
      toast.success('Comment added successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleLike = async () => {
    try {
      const newLikes = likes + 1;
      await updateArticle.mutateAsync({
        articleId,
        updates: { likes: newLikes },
      });
      setLikes(newLikes);
      toast.success('Article liked!');
    } catch (error) {
      toast.error('Failed to like article');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Article link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/knowledge-base" className="inline-flex items-center mb-4 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2" /> Back to Knowledge Base
      </Link>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="secondary" className="mb-2">{article.category}</Badge>
              <CardTitle className="text-3xl mb-2">{article.title}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{format(new Date(article.published_at), 'PPP')}</span>
                <span className="mx-2">•</span>
                <span>{calculateReadTime(article.content)} min read</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleLike}>
                <ThumbsUp className="mr-2 h-4 w-4" /> {likes}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" /> Share
              </Button>
            </div>
          </div>
          {session?.user?.id === article.author_id && (
            <div className="flex space-x-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="mr-2 h-4 w-4" /> {isEditing ? 'Cancel Edit' : 'Edit Article'}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" /> Delete Article
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the article and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              {isEditing ? (
                <div className="mb-4">
                  <ReactQuill theme="snow" value={editedContent} onChange={setEditedContent} />
                  <Button onClick={handleEdit} className="mt-4">Save Changes</Button>
                </div>
              ) : (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
              )}
            </TabsContent>
            <TabsContent value="comments">
              <div className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCommentSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Add a comment</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Write your comment here..." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Post Comment</Button>
                  </form>
                </Form>
                {commentsLoading ? (
                  <div>Loading comments...</div>
                ) : comments && comments.length > 0 ? (
                  comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={comment.user.avatar_url} />
                            <AvatarFallback>{comment.user.first_name[0]}{comment.user.last_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold">{comment.user.first_name} {comment.user.last_name}</p>
                            <p className="text-sm text-gray-500">{format(new Date(comment.created_at), 'PPP')}</p>
                            <p className="mt-2">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No comments yet. Be the first to comment!</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleDetailPage;