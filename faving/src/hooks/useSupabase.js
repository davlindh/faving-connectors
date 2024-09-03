import { useContext, createContext } from 'react';
import { getSupabase } from '@/lib/supabase';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const supabase = getSupabase();

  return (
    <SupabaseContext.Provider value={{ supabase }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === null) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}