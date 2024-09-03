import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateBookingRequest } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';

const bookingSchema = z.object({
  requested_date: z.string().min(1, 'Requested date is required'),
  message: z.string().max(500, 'Message must be 500 characters or less').optional(),
});

const BookingRequestForm = ({ service, onClose }) => {
  const createBookingRequest = useCreateBookingRequest();
  const { session } = useSupabase();

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      requested_date: '',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    if (!session?.user?.id) {
      toast.error('You must be logged in to book a service');
      return;
    }

    try {
      await createBookingRequest.mutateAsync({
        service_id: service.service_id,
        user_id: session.user.id,
        provider_id: service.user_id,
        requested_date: data.requested_date,
        message: data.message,
        status: 'pending',
      });
      toast.success('Booking request sent successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to send booking request');
      console.error('Booking request error:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Service: {service.service_name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requested_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any additional details or requests" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Send Booking Request</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingRequestForm;