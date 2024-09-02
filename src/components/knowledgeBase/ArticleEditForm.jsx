import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useUpdateKnowledgeBaseArticle } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
});

const ArticleEditForm = ({ article, onEditComplete }) => {
  const navigate = useNavigate();
  const updateArticle = useUpdateKnowledgeBaseArticle();

  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article.title,
      content: article.content,
      category: article.category,
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateArticle.mutateAsync({
        articleId: article.article_id,
        updates: {
          ...data,
          updated_at: new Date().toISOString(),
        },
      });
      toast.success('Article updated successfully');
      onEditComplete();
    } catch (error) {
      console.error('Update article error:', error);
      toast.error('Failed to update article');
    }
  };

  return (
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
          <Button type="button" variant="outline" onClick={() => navigate(`/knowledge-base/${article.article_id}`)}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateArticle.isPending}>
            {updateArticle.isPending ? 'Updating...' : 'Update Article'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleEditForm;