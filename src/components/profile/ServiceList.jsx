import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useServices } from '@/integrations/supabase';
import BookingRequestForm from './BookingRequestForm';
import { Button } from "@/components/ui/button";

const ServiceList = ({ profileId }) => {
  const { data: services, isLoading, error } = useServices();
  const [selectedService, setSelectedService] = useState(null);

  if (isLoading) return <div>Loading services...</div>;
  if (error) return <div>Error loading services: {error.message}</div>;

  const profileServices = services.filter(service => service.user_id === profileId);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profileServices.map((service) => (
        <Card key={service.service_id}>
          <CardHeader>
            <CardTitle>{service.service_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{service.description}</p>
            <p className="mt-2 font-bold">Price: ${service.price}</p>
            <Button 
              className="mt-4" 
              onClick={() => setSelectedService(service)}
            >
              Book Service
            </Button>
          </CardContent>
        </Card>
      ))}
      {selectedService && (
        <BookingRequestForm
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default ServiceList;