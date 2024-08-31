import React from 'react';
import { Badge } from "@/components/ui/badge";
import { useSkills } from '@/integrations/supabase';

const SkillList = ({ profileId }) => {
  const { data: skills, isLoading, error } = useSkills();

  if (isLoading) return <div>Loading skills...</div>;
  if (error) return <div>Error loading skills: {error.message}</div>;

  const profileSkills = skills.filter(skill => skill.user_id === profileId);

  return (
    <div className="flex flex-wrap gap-2">
      {profileSkills.map((skill) => (
        <Badge key={skill.skill_id} variant="secondary">{skill.skill_name}</Badge>
      ))}
    </div>
  );
};

export default SkillList;
