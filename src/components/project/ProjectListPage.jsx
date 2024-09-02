import React, { useState } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectCard from './ProjectCard.jsx';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectListPage = () => {
  const { projects, isLoading, error, filters, setFilters, sortBy, setSortBy } = useProjectContext();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

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

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchTerm);
  };

  const filteredProjects = projects?.filter(project => 
    project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Projects</h1>
        <Button onClick={() => navigate('/projects/create')}>Create Project</Button>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-grow">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <SelectItem value="duration-short-to-long">Duration: Short to Long</SelectItem>
              <SelectItem value="duration-long-to-short">Duration: Long to Short</SelectItem>
            </SelectContent>
          </Select>

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
      </div>

      {isLoading && <div className="text-center">Loading projects...</div>}
      {error && <div className="text-center text-red-500">Error loading projects: {error.message}</div>}
      
      {filteredProjects && filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">No projects found matching your criteria.</div>
      )}
    </div>
  );
};

export default ProjectListPage;