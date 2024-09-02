import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateService } from '@/integrations/supabase';
import { toast } from 'sonner';

const serviceSchema = z.object({
  service_name: z.string().min(1, 'Service name is required').max(100, 'Service name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional(),
  price: z.string().refine((val) => !isNaN(parseFloat(val)), {
    message: "Price must be a valid number",
  }),
});

const ServiceForm = ({ profileId }) => {
  const createService = useCreateService();
  const [services, setServices] = useState([]);

  const form = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      service_name: '',
      description: '',
      price: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await createService.mutateAsync({
        user_id: profileId,
        service_name: data.service_name,
        description: data.description,
        price: parseFloat(data.price),
      });
      setServices([...services, data]);
      form.reset();
      toast.success('Service added successfully');
    } catch (error) {
      toast.error('Failed to add service');
      console.error('Add service error:', error);
    }
  };

  return (
    <div>
      <h3 className="font-semibold mb-4">Add Services</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="service_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter a service name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Describe your service" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} type="number" step="0.01" placeholder="Enter price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={createService.isPending}>
            {createService.isPending ? 'Adding...' : 'Add Service'}
          </Button>
        </form>
      </Form>
      <div className="mt-4">
        <h4 className="font-semibold mb-2">Added Services:</h4>
        <ul className="list-disc list-inside">
          {services.map((service, index) => (
            <li key={index}>{service.service_name} - ${service.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ServiceForm;