import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUpdateProfile, useUploadAvatar } from '@/integrations/supabase';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const profileSchema = z.object({
  location: z.string().max(100, 'Location must be 100 characters or less').optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
});

const ProfileForm = ({ profile, onEditComplete }) => {
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const [avatarFile, setAvatarFile] = useState(null);

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      location: profile.location || '',
      bio: profile.bio || '',
    },
  });

  const onSubmit = async (data) => {
    try {
      if (avatarFile) {
        const avatarData = await uploadAvatar.mutateAsync({ userId: profile.user_id, file: avatarFile });
        data.avatar_url = avatarData.avatar_url;
      }

      await updateProfile.mutateAsync({ userId: profile.user_id, updates: data });
      toast.success('Profile updated successfully');
      onEditComplete();
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
            <AvatarFallback>{profile.first_name?.[0]}{profile.last_name?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('avatar-upload').click()}
            >
              Change Avatar
            </Button>
          </div>
        </div>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="location">Location</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  id="location"
                  placeholder="e.g. New York, USA"
                  autoComplete="address-level2"
                />
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
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onEditComplete}>Cancel</Button>
          <Button type="submit" disabled={updateProfile.isPending || uploadAvatar.isPending}>
            {updateProfile.isPending || uploadAvatar.isPending ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;