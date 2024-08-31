import React from 'react';
import { Badge } from "@/components/ui/badge";

const SkillList = ({ skills }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <Badge key={index} variant="secondary">{skill}</Badge>
      ))}
    </div>
  );
};

export default SkillList;