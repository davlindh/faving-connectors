// Import all the relevant exports from other files in the supabase directory
import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';

// Import hooks
import * as profileHooks from './hooks/profiles';
import * as serviceHooks from './hooks/services';
import * as knowledgeBaseHooks from './hooks/knowledge_base';
import * as projectHooks from './hooks/projects';
import * as skillHooks from './hooks/skills';
import * as userHooks from './hooks/users';

// Export all the imported functions and objects
export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  ...profileHooks,
  ...serviceHooks,
  ...knowledgeBaseHooks,
  ...projectHooks,
  ...skillHooks,
  ...userHooks,
};