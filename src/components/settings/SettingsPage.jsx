import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useProfile, useCreateProfile, useUpdateProfile } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const SettingsPage = () => {
  const { session } = useSupabase();
  const userId = session?.user?.id;
  const { data: profile, isLoading, error } = useProfile(userId);
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      location: '',
      bio: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    } else if (!isLoading && !error) {
      setIsCreating(true);
    }
  }, [profile, isLoading, error, form]);

  const onSubmit = async (data) => {
    try {
      if (isCreating) {
        await createProfile.mutateAsync({
          user_id: userId,
          ...data,
        });
        toast.success('Profile created successfully');
      } else {
        await updateProfile.mutateAsync({
          userId,
          updates: data,
        });
        toast.success('Profile updated successfully');
      }
      navigate('/profile/' + userId);
    } catch (error) {
      console.error('Profile operation error:', error);
      toast.error(isCreating ? 'Failed to create profile' : 'Failed to update profile');
    }
  };

  if (isLoading) return <div className="text-center py-8">Loading settings...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading settings: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isCreating ? 'Create Your Profile' : 'Edit Your Profile'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="first_name">First Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="first_name" placeholder="Enter your first name" autoComplete="given-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="last_name">Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} id="last_name" placeholder="Enter your last name" autoComplete="family-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="location">Location</FormLabel>
                    <FormControl>
                      <Input {...field} id="location" placeholder="e.g. New York, USA" autoComplete="address-level2" />
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
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="bio"
                        placeholder="Tell us about yourself"
                        rows={4}
                        autoComplete="off"
                      />
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
                    <FormLabel htmlFor="avatar_url">Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="avatar_url"
                        placeholder="https://example.com/avatar.jpg"
                        autoComplete="photo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                <Button type="submit">
                  {isCreating ? 'Create Profile' : 'Update Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;