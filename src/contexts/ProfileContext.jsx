import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { useProfile } from '@/integrations/supabase';

const ProfileContext = createContext(null);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const auth = useSupabaseAuth();
  const [profileId, setProfileId] = useState(null);
  const { data: profile, isLoading, error } = useProfile(profileId);

  useEffect(() => {
    if (auth && auth.session?.user?.id) {
      setProfileId(auth.session.user.id);
    }
  }, [auth]);

  const value = {
    profile,
    isLoading,
    error,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};