import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AuthForm = ({ mode = 'login' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSupabase();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === 'login') {
        result = await signIn({ email: data.email, password: data.password });
      } else {
        result = await signUp({ email: data.email, password: data.password });
      }

      if (result.error) throw result.error;

      if (mode === 'login') {
        toast.success('Logged in successfully');
        navigate('/');
      } else {
        toast.success('Signed up successfully. Please check your email to confirm your account.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</CardTitle>
        <CardDescription>
          {mode === 'login' ? 'Enter your credentials to access your account' : 'Create a new account'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      autoComplete={mode === 'login' ? 'username' : 'email'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {mode === 'login' ? (
          <p className="text-sm">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;