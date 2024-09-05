import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const impactMetricSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  impact_score: z.number().min(0).max(100),
});

const ImpactMetricForm = ({ onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(impactMetricSchema),
    defaultValues: {
      description: '',
      impact_score: 0,
    },
  });

  const handleSubmit = (data) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter impact metric description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="impact_score"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact Score (0-100)</FormLabel>
              <FormControl>
                <Input {...field} type="number" min="0" max="100" step="1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Impact Metric</Button>
      </form>
    </Form>
  );
};

export default ImpactMetricForm;