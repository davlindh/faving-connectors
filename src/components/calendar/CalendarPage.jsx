import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const CalendarPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Calendar functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarPage;