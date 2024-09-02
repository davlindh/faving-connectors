import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import * as profileHooks from './hooks/profiles.js';
import * as serviceHooks from './hooks/services.js';
import * as knowledgeBaseHooks from './hooks/knowledge_base.js';
import * as projectHooks from './hooks/projects.js';
import * as skillHooks from './hooks/skills.js';
import * as userHooks from './hooks/users.js';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
};

export const {
  useProfiles,
  useProfile,
  useCreateProfile,
  useUpdateProfile,
  useDeleteProfile,
} = profileHooks;

export const {
  useServices,
  useService,
  useCreateService,
  useUpdateService,
  useDeleteService,
} = serviceHooks;

export const {
  useKnowledgeBase,
  useKnowledgeBaseArticle,
  useCreateKnowledgeBaseArticle,
  useUpdateKnowledgeBaseArticle,
  useDeleteKnowledgeBaseArticle,
} = knowledgeBaseHooks;

export const {
  useProjects,
  useProject,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useCreateProjectApplication,
} = projectHooks;

export const {
  useSkills,
  useSkill,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} = skillHooks;

export const {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} = userHooks;