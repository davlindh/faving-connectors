import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const PasswordResetForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="email" placeholder="Email" type="email" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Send Reset Link</Button>
      </CardFooter>
    </Card>
  );
};

export default PasswordResetForm;