import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateKnowledgeBaseArticle } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});

const ArticleCreationForm = () => {
  const navigate = useNavigate();
  const createArticle = useCreateKnowledgeBaseArticle();
  const { session } = useSupabase();

  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
    },
  });

  const onSubmit = async (data) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create an article');
      return;
    }

    try {
      await createArticle.mutateAsync({
        ...data,
        author_id: session.user.id,
        published_at: new Date().toISOString(),
      });
      toast.success('Article created successfully');
      navigate('/knowledge-base');
    } catch (error) {
      toast.error('Failed to create article');
      console.error('Create article error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter article title" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Write your article content here" rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/knowledge-base')}>
              Cancel
            </Button>
            <Button type="submit" disabled={createArticle.isPending}>
              {createArticle.isPending ? 'Creating...' : 'Create Article'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ArticleCreationForm;