import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { useSubmitReview } from '@/integrations/supabase';
import { toast } from 'sonner';

const reviewSchema = z.object({
  communication: z.number().min(0).max(100),
  quality: z.number().min(0).max(100),
  timeliness: z.number().min(0).max(100),
  professionalism: z.number().min(0).max(100),
  comment: z.string().max(500, 'Comment must be 500 characters or less').optional(),
});

const ReviewForm = ({ profileId }) => {
  const { session } = useSupabase();
  const submitReview = useSubmitReview();
  const [isAnonymous, setIsAnonymous] = useState(!session);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      communication: 50,
      quality: 50,
      timeliness: 50,
      professionalism: 50,
      comment: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await submitReview.mutateAsync({
        profileId,
        reviewerId: session?.user?.id || null,
        isAnonymous,
        ...data,
      });
      toast.success('Review submitted successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to submit review');
      console.error('Submit review error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {['communication', 'quality', 'timeliness', 'professionalism'].map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel className="capitalize">{field}</FormLabel>
                <FormControl>
                  <Slider
                    value={[value]}
                    onValueChange={(newValue) => onChange(newValue[0])}
                    max={100}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comment (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Leave a comment..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {session && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous">Submit anonymously</label>
          </div>
        )}
        <Button type="submit" disabled={submitReview.isPending}>
          {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </Form>
  );
};

export default ReviewForm;