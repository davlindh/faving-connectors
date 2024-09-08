import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateKnowledgeBaseArticle, useKnowledgeBase } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { X } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().max(500, 'Summary must be 500 characters or less').optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

const ArticleCreationForm = () => {
  const navigate = useNavigate();
  const createArticle = useCreateKnowledgeBaseArticle();
  const { session } = useSupabase();
  const [activeTab, setActiveTab] = useState('edit');
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const { data: existingArticles } = useKnowledgeBase();

  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: '',
      content: '',
      category: '',
      summary: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (existingArticles) {
      const uniqueCategories = [...new Set(existingArticles.map(article => article.category))];
      setCategories(uniqueCategories);
    }
  }, [existingArticles]);

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

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !form.getValues('tags').includes(newTag) && form.getValues('tags').length < 5) {
      form.setValue('tags', [...form.getValues('tags'), newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    form.setValue('tags', form.getValues('tags').filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit">
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                        <SelectItem value="new">+ Add New Category</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === 'new' && (
                      <Input
                        placeholder="Enter new category name"
                        onChange={(e) => {
                          const newCategory = e.target.value;
                          setCategories([...categories, newCategory]);
                          field.onChange(newCategory);
                        }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter a brief summary of the article" />
                    </FormControl>
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
                      <ReactQuill theme="snow" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {field.value.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} className="ml-2">
                        Add Tag
                      </Button>
                    </div>
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
        </TabsContent>
        <TabsContent value="preview">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-2">{form.getValues('title')}</h2>
              <div className="flex gap-2 mb-4">
                <Badge>{form.getValues('category')}</Badge>
                {form.getValues('tags').map((tag, index) => (
                  <Badge key={index} variant="outline">{tag}</Badge>
                ))}
              </div>
              {form.getValues('summary') && (
                <p className="text-gray-600 mb-4">{form.getValues('summary')}</p>
              )}
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: form.getValues('content') }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticleCreationForm;