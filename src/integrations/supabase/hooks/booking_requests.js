import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

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