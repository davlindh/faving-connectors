import React, { useState, useEffect } from 'react';
import { useProjects } from '@/integrations/supabase';
import ProjectCard from './ProjectCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';

const ProjectListPage = () => {
  const { data: projects, isLoading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minBudget: 0,
    maxBudget: 10000,
    skills: []
  });
  const [sortBy, setSortBy] = useState('latest');
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const navigate = useNavigate();
  const { session } = useSupabase();

  useEffect(() => {
    if (projects) {
      const filtered = projects.filter(project => 
        (searchTerm === '' || project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
        (filters.category === 'all' || project.category === filters.category) &&
        (project.budget >= filters.minBudget && project.budget <= filters.maxBudget) &&
        (filters.skills.length === 0 || (project.required_skills && filters.skills.every(skill => project.required_skills.includes(skill))))
      );

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
        if (sortBy === 'budget-high-to-low') return b.budget - a.budget;
        if (sortBy === 'budget-low-to-high') return a.budget - b.budget;
        return 0;
      });

      setDisplayedProjects(sorted);
    }
  }, [projects, searchTerm, filters, sortBy]);

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Projects</h1>
        <Button onClick={() => navigate('/projects/create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
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

      {isLoading && <div className="text-center py-8">Loading projects...</div>}
      {error && <div className="text-center text-red-500 py-8">Error loading projects: {error.message}</div>}
      
      {!isLoading && !error && displayedProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {displayedProjects.map((project) => (
            <div key={project.project_id} className="relative">
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
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No projects found matching your criteria.</div>
      )}
    </div>
  );
};

export default ProjectListPage;