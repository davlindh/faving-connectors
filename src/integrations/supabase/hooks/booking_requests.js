import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '../supabase';

/*
### booking_requests

| name               | type                    | format | required |
|--------------------|-------------------------|--------|----------|
| booking_request_id | uuid                    | uuid   | true     |
| service_id         | uuid                    | uuid   | true     |
| user_id            | uuid                    | uuid   | true     |
| provider_id        | uuid                    | uuid   | true     |
| requested_date     | timestamp with time zone| string | true     |
| message            | text                    | string | false    |
| status             | text                    | string | true     |
| created_at         | timestamp with time zone| string | true     |

Note: booking_request_id is the Primary Key
*/

export const useCreateBookingRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newBookingRequest) => {
      const { data, error } = await supabase
        .from('booking_requests')
        .insert([newBookingRequest])
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['booking_requests']);
    },
  });
};

export const useBookingRequests = () => useQuery({
  queryKey: ['booking_requests'],
  queryFn: async () => {
    const { data, error } = await supabase.from('booking_requests').select('*');
    if (error) throw error;
    return data;
  },
});

export const useUpdateBookingRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingRequestId, updates }) => {
      const { data, error } = await supabase
        .from('booking_requests')
        .update(updates)
        .eq('booking_request_id', bookingRequestId)
        .select();
      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['booking_requests']);
      queryClient.invalidateQueries(['booking_requests', data.booking_request_id]);
    },
  });
};