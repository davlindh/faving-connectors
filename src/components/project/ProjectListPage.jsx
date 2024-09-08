import React, { useState, useEffect, useCallback } from 'react';
import { useProjects, useProfile } from '@/integrations/supabase';
import ProjectCard from './ProjectCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Card, CardContent } from "@/components/ui/card";
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
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: allProjects, isLoading: allProjectsLoading, error: allProjectsError } = useProjects(false);
  const { data: myProjects, isLoading: myProjectsLoading, error: myProjectsError } = useProjects(true);
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useProfile(session?.user?.id);

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

  const loadMoreProjects = useCallback(() => {
    const projects = activeTab === 'all' ? allProjects : myProjects;
    if (projects) {
      let filtered = projects.filter(project => 
        (searchTerm === '' || project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filters.category === 'all' || project.category === filters.category) &&
        (project.budget >= filters.minBudget && project.budget <= filters.maxBudget) &&
        (filters.skills.length === 0 || (project.required_skills && filters.skills.every(skill => project.required_skills.includes(skill))))
      );

      filtered = matchProjects(filtered, userProfile?.skills);

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
        if (sortBy === 'budget-high-to-low') return b.budget - a.budget;
        if (sortBy === 'budget-low-to-high') return a.budget - b.budget;
        if (sortBy === 'match-score') return b.matchScore - a.matchScore;
        return 0;
      });

      const newProjects = sorted.slice(0, page * PROJECTS_PER_PAGE);
      setDisplayedProjects(newProjects);
    }
  }, [allProjects, myProjects, activeTab, searchTerm, filters, sortBy, page, userProfile, matchProjects]);

  useEffect(() => {
    loadMoreProjects();
  }, [loadMoreProjects]);

  useEffect(() => {
    if (inView) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView]);

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFilters({
        ...filters,
        skills: [...filters.skills, e.target.value]
      });
      e.target.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFilters({
      ...filters,
      skills: filters.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const isProjectOwner = (project) => {
    return session?.user?.id === project.creator_id;
  };

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
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="my">My Projects</TabsTrigger>
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
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="budget-high-to-low">Budget: High to Low</SelectItem>
                <SelectItem value="budget-low-to-high">Budget: Low to High</SelectItem>
                <SelectItem value="match-score">Best Match</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" /> Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => setFilters({ ...filters, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="web-development">Web Development</SelectItem>
                        <SelectItem value="mobile-app">Mobile App</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="writing">Writing</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Budget Range</label>
                    <Slider
                      min={0}
                      max={10000}
                      step={100}
                      value={[filters.minBudget, filters.maxBudget]}
                      onValueChange={([min, max]) => setFilters({ ...filters, minBudget: min, maxBudget: max })}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>${filters.minBudget}</span>
                      <span>${filters.maxBudget}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Skills</label>
                    <Input
                      placeholder="Add skills (press Enter)"
                      onKeyPress={handleSkillAdd}
                      className="mb-2"
                    />
                    <div className="flex flex-wrap gap-2">
                      {filters.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => handleSkillRemove(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <TabsContent value="all">
          {allProjectsLoading && <div className="text-center py-8">Loading all projects...</div>}
          {allProjectsError && <div className="text-center text-red-500 py-8">Error loading all projects: {allProjectsError.message}</div>}
          {!allProjectsLoading && !allProjectsError && displayedProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project) => (
                <Card key={project.project_id} className="relative">
                  <CardContent className="p-0">
                    <ProjectCard project={project} />
                    {isProjectOwner(project) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => navigate(`/projects/edit/${project.project_id}`)}
                      >
                        Edit
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">No projects found matching your criteria.</div>
          )}
        </TabsContent>

        <TabsContent value="my">
          {myProjectsLoading && <div className="text-center py-8">Loading your projects...</div>}
          {myProjectsError && <div className="text-center text-red-500 py-8">Error loading your projects: {myProjectsError.message}</div>}
          {!myProjectsLoading && !myProjectsError && displayedProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedProjects.map((project) => (
                <Card key={project.project_id} className="relative">
                  <CardContent className="p-0">
                    <ProjectCard project={project} />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => navigate(`/projects/edit/${project.project_id}`)}
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">You haven't created any projects yet.</div>
          )}
        </TabsContent>
      </Tabs>

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default ProjectListPage;