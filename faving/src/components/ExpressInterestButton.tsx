'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'sonner';

interface ExpressInterestButtonProps {
  projectId: string;
  hasExpressedInterest: boolean;
}

const ExpressInterestButton: React.FC<ExpressInterestButtonProps> = ({ projectId, hasExpressedInterest }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleExpressInterest = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Please sign in to express interest');
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('project_interests')
        .upsert({ project_id: projectId, user_id: session.user.id }, { onConflict: 'project_id,user_id' });

      if (error) throw error;

      toast.success('Interest expressed successfully');
      router.refresh();
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest. Please try again.');
    }
  };

  return (
    <Button onClick={handleExpressInterest} disabled={hasExpressedInterest}>
      {hasExpressedInterest ? 'Interested' : 'Express Interest'}
    </Button>
  );
};

export default ExpressInterestButton;