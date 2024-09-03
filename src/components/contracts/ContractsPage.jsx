import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ContractsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the Contracts page. Content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractsPage;