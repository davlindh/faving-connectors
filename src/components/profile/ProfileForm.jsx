import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

const ProfileForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input id="name" placeholder="Full Name" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Input id="location" placeholder="Location" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Textarea id="bio" placeholder="Bio" />
            </div>
            {/* TODO: Add fields for skills and services */}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;