import React from 'react';
import { Button } from "@/components/ui/button";
import { useLeaveTeam, useJoinTeam } from '@/integrations/supabase/hooks/teams';
import { toast } from 'sonner';

const TeamActions = ({ team, isTeamMember, isTeamAdmin }) => {
  const leaveTeam = useLeaveTeam();
  const joinTeam = useJoinTeam();

  const handleLeaveTeam = async () => {
    try {
      await leaveTeam.mutateAsync(team.team_id);
      toast.success('You have left the team');
    } catch (error) {
      toast.error('Failed to leave the team');
    }
  };

  const handleJoinTeam = async () => {
    try {
      await joinTeam.mutateAsync(team.team_id);
      toast.success('Join request sent successfully');
    } catch (error) {
      toast.error('Failed to send join request');
    }
  };

  if (isTeamMember) {
    return (
      <Button onClick={handleLeaveTeam} variant="destructive">
        Leave Team
      </Button>
    );
  }

  if (!isTeamMember && team.join_type === 'open') {
    return (
      <Button onClick={handleJoinTeam}>
        Join Team
      </Button>
    );
  }

  return null;
};

export default TeamActions;
