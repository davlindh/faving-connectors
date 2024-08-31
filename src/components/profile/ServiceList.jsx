import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ServiceList = ({ services }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{service.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{service.description}</p>
            <p className="mt-2 font-bold">Price: ${service.price}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServiceList;