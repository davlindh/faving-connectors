import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateImpactMetric, useUpdateImpactMetric } from '@/integrations/supabase';
import { toast } from 'sonner';

const impactMetricSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  impact_score: z.number().min(0).max(100),
});

const ImpactMetricForm = ({ projectId, metric = null, onSuccess }) => {
  const createImpactMetric = useCreateImpactMetric();
  const updateImpactMetric = useUpdateImpactMetric();

  const form = useForm({
    resolver: zodResolver(impactMetricSchema),
    defaultValues: {
      description: metric?.description || '',
      impact_score: metric?.impact_score || 0,
    },
  });

  const onSubmit = async (data) => {
    try {
      if (metric) {
        await updateImpactMetric.mutateAsync({ metricId: metric.metric_id, updates: data });
        toast.success('Impact metric updated successfully');
      } else {
        await createImpactMetric.mutateAsync({ ...data, project_id: projectId });
        toast.success('Impact metric created successfully');
      }
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Failed to save impact metric');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <Button type="submit">
          {metric ? 'Update Impact Metric' : 'Add Impact Metric'}
        </Button>
      </form>
    </Form>
  );
};

export default ImpactMetricForm;