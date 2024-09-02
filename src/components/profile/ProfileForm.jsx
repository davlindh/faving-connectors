import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateProfile } from '@/integrations/supabase';
import { toast } from 'sonner';

const profileSchema = z.object({
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const ProfileForm = ({ profile, onEditComplete }) => {
  const updateProfile = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      location: profile.location || '',
      bio: profile.bio || '',
      avatar_url: profile.avatar_url || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync({ profileId: profile.profile_id, updates: data });
      toast.success('Profile updated successfully');
      onEditComplete();
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. New York, USA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Tell us about yourself" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatar_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://example.com/avatar.jpg" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onEditComplete}>Cancel</Button>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;