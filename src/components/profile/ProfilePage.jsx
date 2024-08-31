import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SkillList from './SkillList';
import ServiceList from './ServiceList';

const ProfilePage = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{user.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{user.bio}</p>
          <h3 className="font-semibold mb-2">Skills</h3>
          <SkillList skills={user.skills} />
          <h3 className="font-semibold mt-4 mb-2">Services</h3>
          <ServiceList services={user.services} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;