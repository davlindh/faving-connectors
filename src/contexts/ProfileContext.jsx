import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
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
  const { session } = useSupabase();
  const [profileId, setProfileId] = useState(null);
  const { data: profile, isLoading, error } = useProfile(profileId);

  useEffect(() => {
    if (session?.user?.id) {
      setProfileId(session.user.id);
    }
  }, [session]);

  const value = {
    profile,
    isLoading,
    error,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};