import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateKnowledgeBaseArticle, useUpdateKnowledgeBaseArticle, useKnowledgeBaseArticle, useKnowledgeBase } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from 'sonner';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().max(500, 'Summary must be 500 characters or less').optional(),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

const ArticleCreationForm = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const createArticle = useCreateKnowledgeBaseArticle();
  const updateArticle = useUpdateKnowledgeBaseArticle();
  const { data: article, isLoading: articleLoading } = useKnowledgeBaseArticle(articleId);
  const { session } = useSupabase();
  const { data: existingArticles } = useKnowledgeBase();
  const [activeTab, setActiveTab] = useState('edit');
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    if (articleId && article) {
      form.reset({
        title: article.title,
        content: article.content,
        category: article.category,
        summary: article.summary || '',
        tags: article.tags || [],
      });
    }
  }, [articleId, article, form]);

  const onSubmit = async (data) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to create an article');
      return;
    }

    try {
      const articleData = {
        ...data,
        author_id: session.user.id,
        published_at: new Date().toISOString(),
      };

      if (articleId) {
        await updateArticle.mutateAsync({
          articleId,
          updates: articleData,
        });
        toast.success('Article updated successfully');
      } else {
        await createArticle.mutateAsync(articleData);
        toast.success('Article created successfully');
      }
      navigate('/knowledge-base');
    } catch (error) {
      toast.error(articleId ? 'Failed to update article' : 'Failed to create article');
      console.error('Article operation error:', error);
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

  if (articleLoading) {
    return <div className="text-center mt-8">Loading article details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{articleId ? 'Edit Article' : 'Create New Article'}</CardTitle>
          <CardDescription>{articleId ? 'Update your article details' : 'Fill in the details for your new article'}</CardDescription>
        </CardHeader>
        <CardContent>
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
                          <Textarea {...field} placeholder="Enter a brief summary of the article" rows={3} />
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
                    <Button type="submit" disabled={createArticle.isPending || updateArticle.isPending}>
                      {articleId ? (updateArticle.isPending ? 'Updating...' : 'Update Article') : (createArticle.isPending ? 'Creating...' : 'Create Article')}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleCreationForm;