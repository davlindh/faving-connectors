import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
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
      impact_score: metric?.impact_score || 50,
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
          render={({ field: { onChange, value } }) => (
            <FormItem>
              <FormLabel>Impact Score</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-4">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[value]}
                    onValueChange={(vals) => onChange(vals[0])}
                    className="w-full"
                  />
                  <span className="w-12 text-center">{value}%</span>
                </div>
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