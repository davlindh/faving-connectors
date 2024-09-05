import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Link } from 'react-router-dom';
import { ExclamationTriangle } from 'lucide-react';

const AuthForm = ({ mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useSupabase();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    try {
      let result;
      if (mode === 'login') {
        result = await signIn({ email, password });
      } else {
        result = await signUp({ email, password });
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
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthError = (error) => {
    if (error.message === 'Email not confirmed') {
      setErrors({ general: 'Please confirm your email address. Check your inbox for a confirmation link.' });
    } else if (error.message === 'Invalid login credentials') {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } else if (error.message === 'User already registered') {
      setErrors({ email: 'An account with this email already exists. Please log in or use a different email.' });
    } else {
      setErrors({ general: `An error occurred: ${error.message}` });
    }
  };

  const handleResendConfirmation = async () => {
    try {
      const { error } = await signUp({ email, password });
      if (error) throw error;
      toast.success('Confirmation email resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend confirmation error:', error);
      toast.error('Failed to resend confirmation email. Please try again.');
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
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="auth-email"
                name="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'username' : 'email'}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="auth-password"
                name="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
          </div>
          {errors.general && (
            <Alert variant="destructive" className="mt-4">
              <ExclamationTriangle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
              {errors.general.includes('confirm your email') && (
                <Button onClick={handleResendConfirmation} variant="link" className="mt-2 p-0">
                  Resend confirmation email
                </Button>
              )}
            </Alert>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <Button className="w-full mb-2" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
        </Button>
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