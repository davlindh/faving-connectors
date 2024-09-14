import React, { useState, useCallback, useMemo } from 'react';
import { useProjects, useProfile } from '@/integrations/supabase';
import ProjectCard from './ProjectCard';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from 'react-intersection-observer';

const PROJECTS_PER_PAGE = 9;

const ProjectListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minBudget: 0,
    maxBudget: 10000,
    skills: []
  });
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
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
      (searchTerm === '' || project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filters.category === 'all' || project.category === filters.category) &&
      (project.budget >= filters.minBudget && project.budget <= filters.maxBudget) &&
      (filters.skills.length === 0 || (project.required_skills && filters.skills.every(skill => project.required_skills.includes(skill))))
    );

    filtered = matchProjects(filtered, userProfile?.skills);

    return filtered.sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
      if (sortBy === 'budget-high-to-low') return b.budget - a.budget;
      if (sortBy === 'budget-low-to-high') return a.budget - b.budget;
      if (sortBy === 'match-score') return b.matchScore - a.matchScore;
      return 0;
    });
  }, [allProjects, myProjects, activeTab, searchTerm, filters, sortBy, userProfile, matchProjects]);

  const displayedProjects = useMemo(() => {
    return filteredAndSortedProjects.slice(0, page * PROJECTS_PER_PAGE);
  }, [filteredAndSortedProjects, page]);

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, e.target.value]
      }));
      e.target.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const isProjectOwner = (project) => {
    return session?.user?.id === project.creator_id;
  };

  if (inView) {
    setPage(prevPage => prevPage + 1);
  }

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

        <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
          <div className="flex-grow">
            <div className="relative">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="flex gap-2">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              {/* Select options */}
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                {/* Filter content */}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value="all">
          <ProjectList
            projects={displayedProjects}
            isLoading={allProjectsLoading}
            error={allProjectsError}
            isProjectOwner={isProjectOwner}
          />
        </TabsContent>

        <TabsContent value="my">
          <ProjectList
            projects={displayedProjects}
            isLoading={myProjectsLoading}
            error={myProjectsError}
            isProjectOwner={isProjectOwner}
            showEditButton
          />
        </TabsContent>
      </Tabs>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10" />
    </div>
  );
};

const ProjectList = ({ projects, isLoading, error, isProjectOwner, showEditButton }) => {
  const navigate = useNavigate();

  if (isLoading) return <div className="text-center py-8">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 py-8">Error loading projects: {error.message}</div>;
  if (projects.length === 0) return <div className="text-center py-8">No projects found matching your criteria.</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.project_id} className="relative">
          <ProjectCard project={project} />
          {(isProjectOwner(project) || showEditButton) && (
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => navigate(`/projects/edit/${project.project_id}`)}
            >
              Edit
            </Button>
          )}
        </Card>
      ))}
    </div>
  );
};

export default ProjectListPage;
