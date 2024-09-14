import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ProjectProgress from './ProjectProgress';
import ProjectOverview from './ProjectOverview';
import TaskList from './TaskList';
import TeamManagement from '../team/TeamManagement';
import MilestoneManagement from './MilestoneManagement';
import ImpactMetricForm from './ImpactMetricForm';
import ECKTSlider from '../shared/ECKTSlider';
import ResourcesTab from './ResourcesTab';
import ProjectForm from './ProjectForm';

const ProjectTabs = ({ project, isEditing, isOwner, setIsEditing }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (isEditing) {
    return (
      <ProjectForm
        project={project}
        onSuccess={() => {
          setIsEditing(false);
          toast.success('Project updated successfully');
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <ProjectProgress />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="overview"><ProjectOverview project={project} /></TabsContent>
        <TabsContent value="tasks"><TaskList projectId={project.project_id} /></TabsContent>
        <TabsContent value="team"><TeamManagement projectId={project.project_id} isOwner={isOwner} /></TabsContent>
        <TabsContent value="milestones"><MilestoneManagement projectId={project.project_id} isOwner={isOwner} /></TabsContent>
        <TabsContent value="impact"><ImpactMetricForm projectId={project.project_id} /></TabsContent>
        <TabsContent value="feedback"><ECKTSlider origin={`project_${project.project_id}`} /></TabsContent>
        <TabsContent value="resources"><ResourcesTab resources={project.resources} /></TabsContent>
      </Tabs>
    </>
  );
};

export default ProjectTabs;
