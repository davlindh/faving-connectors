import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import { useCreateProjectInterest } from '@/integrations/supabase';

const ExpressInterestButton = ({ projectId, hasExpressedInterest }) => {
  const navigate = useNavigate();
  const { session } = useSupabase();
  const createProjectInterest = useCreateProjectInterest();

  const handleExpressInterest = async () => {
    if (!session) {
      toast.error('Please sign in to express interest');
      navigate('/login');
      return;
    }

    try {
      await createProjectInterest.mutateAsync({
        project_id: projectId,
        user_id: session.user.id,
        expressed_at: new Date().toISOString(),
      });
      toast.success('Interest expressed successfully');
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest. Please try again.');
    }
  };

  return (
    <Button onClick={handleExpressInterest} disabled={hasExpressedInterest}>
      {hasExpressedInterest ? 'Interest Expressed' : 'Express Interest'}
    </Button>
  );
};

export default ExpressInterestButton;