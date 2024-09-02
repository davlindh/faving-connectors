import React, { useState, useEffect } from 'react';
import { useProjectContext } from '@/contexts/ProjectContext';
import ProjectCard from './ProjectCard.jsx';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";

const ProjectListPage = () => {
  const { projects, isLoading, error, filters, setFilters, sortBy, setSortBy } = useProjectContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    if (projects) {
      const filtered = projects.filter(project => 
        (searchTerm === '' || project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || project.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.category === 'all' || project.category === filters.category) &&
        project.budget >= filters.minBudget &&
        project.budget <= filters.maxBudget &&
        (filters.skills.length === 0 || filters.skills.every(skill => project.required_skills.includes(skill)))
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

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = displayedProjects.slice(indexOfFirstProject, indexOfLastProject);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Projects</h1>
        <Button onClick={() => navigate('/projects/create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-2">
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
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
          <div className="mt-4">
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
          <div className="mt-4">
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
        </CardContent>
      </Card>

      {isLoading && <div className="text-center py-8">Loading projects...</div>}
      {error && <div className="text-center text-red-500 py-8">Error loading projects: {error.message}</div>}
      
      {!isLoading && !error && displayedProjects.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentProjects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            {Array.from({ length: Math.ceil(displayedProjects.length / projectsPerPage) }, (_, i) => (
              <Button
                key={i}
                onClick={() => paginate(i + 1)}
                variant={currentPage === i + 1 ? "default" : "outline"}
                className="mx-1"
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">No projects found matching your criteria.</div>
      )}
    </div>
  );
};

export default ProjectListPage;