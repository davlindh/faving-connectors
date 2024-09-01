import React from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectCard from './ProjectCard.jsx';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

const ProjectListPage = () => {
  const { projects, isLoading, error, filters, setFilters, sortBy, setSortBy } = useProjectContext();

  if (isLoading) return <div>Loading projects...</div>;
  if (error) return <div>Error loading projects: {error.message}</div>;

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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Available Projects</h1>
      
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="flex justify-between mt-1">
              <span>${filters.minBudget}</span>
              <span>${filters.maxBudget}</span>
            </div>
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

        <div>
          <label className="block text-sm font-medium mb-1">Skills</label>
          <Input
            placeholder="Add skills (press Enter)"
            onKeyPress={handleSkillAdd}
          />
          <div className="flex flex-wrap gap-2 mt-2">
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectListPage;
