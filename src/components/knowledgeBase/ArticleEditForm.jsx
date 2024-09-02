import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be 255 characters or less'),
  content: z.string().min(1, 'Content is required'),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).max(5, 'Maximum 5 tags allowed'),
});

const categories = [
  'Technology', 'Design', 'Business', 'Marketing', 'Development', 'Other'
];

const ArticleEditForm = ({ article, onSubmit, onCancel }) => {
  const form = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article.title,
      content: article.content,
      category: article.category,
      tags: article.tags || [],
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newTag = e.target.value.trim();
      const currentTags = form.getValues('tags');
      if (!currentTags.includes(newTag) && currentTags.length < 5) {
        form.setValue('tags', [...currentTags, newTag]);
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    const currentTags = form.getValues('tags');
    form.setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <FormControl>
                <Input
                  placeholder="Add tags (press Enter)"
                  onKeyPress={addTag}
                />
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
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Update Article
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ArticleEditForm;