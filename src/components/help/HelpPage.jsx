import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const HelpPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Help & Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the Help & Support page. Here you can find information and resources to assist you with using our platform.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;