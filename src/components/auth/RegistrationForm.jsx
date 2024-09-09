import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreateProfile, useCreateUser } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { TextField, TextAreaField } from '@/components/shared/FormFields';

const formSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  confirmPassword: z.string(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const RegistrationForm = () => {
  const { signUp } = useSupabase();
  const createProfile = useCreateProfile();
  const createUser = useCreateUser();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      location: '',
      bio: '',
      termsAccepted: false,
    },
  });

  const { onSubmit, isSubmitting } = useFormSubmit(
    async (data) => {
      const { data: authData, error: authError } = await signUp({
        email: data.email,
        password: data.password,
      });
      if (authError) throw authError;

      if (authData.user) {
        const userId = authData.user.id;
        const now = new Date().toISOString();

        await createUser.mutateAsync({
          user_id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          created_at: now,
          updated_at: now,
        });

        await createProfile.mutateAsync({
          user_id: userId,
          first_name: data.firstName,
          last_name: data.lastName,
          location: data.location,
          bio: data.bio,
          created_at: now,
          updated_at: now,
        });

        navigate('/login');
      }
    },
    'Registration successful! Please check your email to verify your account.',
    'An error occurred during registration. Please try again.'
  );

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <TextField name="firstName" label="First Name" control={form.control} placeholder="John" />
              <TextField name="lastName" label="Last Name" control={form.control} placeholder="Doe" />
            </div>
            <TextField name="email" label="Email" control={form.control} type="email" placeholder="john.doe@example.com" />
            <TextField name="password" label="Password" control={form.control} type="password" placeholder="Create a strong password" />
            <TextField name="confirmPassword" label="Confirm Password" control={form.control} type="password" placeholder="Confirm your password" />
            <TextField name="location" label="Location (Optional)" control={form.control} placeholder="City, Country" />
            <TextAreaField name="bio" label="Bio (Optional)" control={form.control} placeholder="Tell us about yourself" />
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I accept the terms and conditions
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;