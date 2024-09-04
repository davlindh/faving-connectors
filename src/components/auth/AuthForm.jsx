import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const AuthForm = ({ mode = 'login' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, signUp } = useSupabase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (mode === 'login') {
        result = await signIn({ email, password });
      } else {
        result = await signUp({ email, password });
      }

      if (result.error) throw result.error;

      toast.success(mode === 'login' ? 'Logged in successfully' : 'Signed up successfully');
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred during authentication');
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
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input
                id="password"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSubmit}>
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;