import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';

export const useSubscription = (channel, callback) => {
  useEffect(() => {
    const subscription = supabase
      .channel(channel)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channel, callback]);
};