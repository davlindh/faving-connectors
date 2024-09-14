import React, { useState, useCallback, useMemo } from 'react';
import { useProjects, useProfile } from '@/integrations/supabase';
import ProjectCard from './ProjectCard';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from 'react-intersection-observer';
import ProjectListFilters from './ProjectListFilters';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const PROJECTS_PER_PAGE = 9;

const ProjectListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: 'all',
    minBudget: 0,
    maxBudget: 10000,
    skills: [],
    sortBy: 'latest'
  });
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: allProjects, isLoading: allProjectsLoading, error: allProjectsError } = useProjects(false);
  const { data: myProjects, isLoading: myProjectsLoading, error: myProjectsError } = useProjects(true);
  const { data: userProfile } = useProfile(session?.user?.id);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const matchProjects = useCallback((projects, userSkills) => {
    if (!userSkills || userSkills.length === 0) return projects;
    
    return projects.map(project => {
      const matchScore = project.required_skills.reduce((score, skill) => {
        return userSkills.includes(skill) ? score + 1 : score;
      }, 0) / project.required_skills.length;
      
      return { ...project, matchScore };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    const projects = activeTab === 'all' ? allProjects : myProjects;
    if (!projects) return [];

    let filtered = projects.filter(project => 
      (filters.searchTerm === '' || project.project_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) || (project.description && project.description.toLowerCase().includes(filters.searchTerm.toLowerCase()))) &&
      (filters.category === 'all' || project.category === filters.category) &&
      (project.budget >= filters.minBudget && project.budget <= filters.maxBudget) &&
      (filters.skills.length === 0 || (project.required_skills && filters.skills.every(skill => project.required_skills.includes(skill))))
    );

    filtered = matchProjects(filtered, userProfile?.skills);

    return filtered.sort((a, b) => {
      if (filters.sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
      if (filters.sortBy === 'budget-high-to-low') return b.budget - a.budget;
      if (filters.sortBy === 'budget-low-to-high') return a.budget - b.budget;
      if (filters.sortBy === 'match-score') return b.matchScore - a.matchScore;
      return 0;
    });
  }, [allProjects, myProjects, activeTab, filters, userProfile, matchProjects]);

  const displayedProjects = useMemo(() => {
    return filteredAndSortedProjects.slice(0, page * PROJECTS_PER_PAGE);
  }, [filteredAndSortedProjects, page]);

  const isProjectOwner = useCallback((project) => {
    return session?.user?.id === project.creator_id;
  }, [session]);

  if (inView) {
    setPage(prevPage => prevPage + 1);
  }

  const renderProject = useCallback(({ index, style }) => {
    const project = displayedProjects[index];
    if (!project) return null;
    return (
      <div style={style}>
        <ProjectCard
          key={project.project_id}
          project={project}
          isOwner={isProjectOwner(project)}
          onEdit={() => navigate(`/projects/edit/${project.project_id}`)}
        />
      </div>
    );
  }, [displayedProjects, isProjectOwner, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-0">Projects</h1>
        <Button onClick={() => navigate('/projects/create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => navigate('/projects')}>All Projects</TabsTrigger>
          <TabsTrigger value="my" onClick={() => navigate('/projects/my-projects')}>My Projects</TabsTrigger>
        </TabsList>

        <ProjectListFilters filters={filters} setFilters={setFilters} />

        <TabsContent value="all">
          <ProjectList
            projects={displayedProjects}
            isLoading={allProjectsLoading}
            error={allProjectsError}
            renderProject={renderProject}
          />
        </TabsContent>

        <TabsContent value="my">
          <ProjectList
            projects={displayedProjects}
            isLoading={myProjectsLoading}
            error={myProjectsError}
            renderProject={renderProject}
          />
        </TabsContent>
      </Tabs>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10" />
    </div>
  );
};

const ProjectList = ({ projects, isLoading, error, renderProject }) => {
  if (isLoading) return <div className="text-center py-8">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading projects: {error.message}</div>;
  if (projects.length === 0) return <div className="text-center py-8">No projects found matching your criteria.</div>;

  return (
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height || 400}
          itemCount={projects.length}
          itemSize={200}
          width={width || 300}
        >
          {renderProject}
        </List>
      )}
    </AutoSizer>
  );
};

export default ProjectListPage;
