import React from 'react';
import { useProjects } from '@/integrations/supabase';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectCard from './ProjectCard.jsx';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

const ProjectListPage = () => {
  const { data: projects, isLoading, error } = useProjects();
  const { filters, setFilters, sortBy, setSortBy } = useProjectContext();

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

  const filteredProjects = projects.filter(project => {
    return (
      (!filters.category || project.category === filters.category) &&
      project.budget >= filters.minBudget &&
      project.budget <= filters.maxBudget &&
      (filters.skills.length === 0 || filters.skills.every(skill => project.required_skills.includes(skill)))
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.start_date) - new Date(a.start_date);
    if (sortBy === 'budget-high-to-low') return b.budget - a.budget;
    if (sortBy === 'budget-low-to-high') return a.budget - b.budget;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Projects</h1>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.category}
          onValueChange={(value) => setFilters({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            <SelectItem value="web-development">Web Development</SelectItem>
            <SelectItem value="mobile-app">Mobile App</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            {/* Add more categories as needed */}
          </SelectContent>
        </Select>

        <div>
          <label className="block text-sm font-medium mb-1">Budget Range</label>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[filters.minBudget, filters.maxBudget]}
            onValueChange={([min, max]) => setFilters({ ...filters, minBudget: min, maxBudget: max })}
          />
        </div>

        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest</SelectItem>
            <SelectItem value="budget-high-to-low">Budget: High to Low</SelectItem>
            <SelectItem value="budget-low-to-high">Budget: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedProjects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectListPage;
