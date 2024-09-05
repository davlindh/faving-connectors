import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  },
  fetch: (url, options) => {
    options.headers = {
      ...options.headers,
      'Accept': 'application/json, application/vnd.pgrst.object+json',
    };
    return fetch(url, options);
  },
});

export { supabase };

export const getSupabase = () => supabase;