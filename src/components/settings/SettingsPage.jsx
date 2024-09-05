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
import { useProfile, useCreateProfile, useUpdateProfile, useUser, useCreateUser, useUpdateUser } from '@/integrations/supabase';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const userSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

const profileSchema = z.object({
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  avatar_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const SettingsPage = () => {
  const { session } = useSupabase();
  const userId = session?.user?.id;
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(userId);
  const { data: user, isLoading: userLoading, error: userError } = useUser(userId);
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const navigate = useNavigate();
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: session?.user?.email || '',
    },
  });

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      location: '',
      bio: '',
      avatar_url: '',
    },
  });

  useEffect(() => {
    if (user) {
      userForm.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: session?.user?.email || '',
      });
    }
    if (profile) {
      profileForm.reset({
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
      });
    } else if (!profileLoading && !profileError) {
      setIsCreatingProfile(true);
    }
  }, [user, profile, profileLoading, profileError, userForm, profileForm, session]);

  const onSubmit = async (userData, profileData) => {
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      return;
    }

    try {
      // Handle user data
      const userPayload = {
        ...userData,
        user_id: userId,
        email: session.user.email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (user) {
        await updateUser.mutateAsync({ userId, updates: userPayload });
      } else {
        await createUser.mutateAsync(userPayload);
      }

      // Handle profile data
      if (isCreatingProfile) {
        await createProfile.mutateAsync({
          user_id: userId,
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        toast.success('Profile created successfully');
      } else {
        await updateProfile.mutateAsync({
          userId,
          updates: {
            ...profileData,
            updated_at: new Date().toISOString(),
          },
        });
        toast.success('Settings updated successfully');
      }
      
      navigate('/profile/' + userId);
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error(isCreatingProfile ? 'Failed to create profile' : 'Failed to update settings');
    }
  };

  if (userLoading || profileLoading) return <div className="text-center py-8">Loading settings...</div>;
  if (userError || profileError) return <div className="text-center text-red-500 py-8">Error loading settings: {userError?.message || profileError?.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isCreatingProfile ? 'Create Your Profile' : 'Edit Your Settings'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit((userData) => profileForm.handleSubmit((profileData) => onSubmit(userData, profileData))())} className="space-y-6">
              <FormField
                control={userForm.control}
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
                control={userForm.control}
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
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input {...field} id="email" type="email" placeholder="Enter your email" autoComplete="email" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
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
                control={profileForm.control}
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
                control={profileForm.control}
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
                  {isCreatingProfile ? 'Create Profile' : 'Update Settings'}
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