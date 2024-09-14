import React from 'react';
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const ProjectListFilters = ({ filters, setFilters }) => {
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

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-4">
      <div className="flex-grow">
        <div className="relative">
          <Input
            placeholder="Search projects..."
            value={filters.searchTerm}
            onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="flex gap-2">
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
        >
          <option value="latest">Latest</option>
          <option value="budget-high-to-low">Budget: High to Low</option>
          <option value="budget-low-to-high">Budget: Low to High</option>
          <option value="match-score">Best Match</option>
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
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
                >
                  <option value="all">All Categories</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="design">Design</option>
                  <option value="writing">Writing</option>
                  <option value="marketing">Marketing</option>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Budget Range</label>
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minBudget, filters.maxBudget]}
                  onValueChange={([min, max]) => setFilters(prev => ({ ...prev, minBudget: min, maxBudget: max }))}
                />
                <div className="flex justify-between text-sm mt-2">
                  <span>${filters.minBudget}</span>
                  <span>${filters.maxBudget}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Skills</label>
                <Input
                  placeholder="Add skills (press Enter)"
                  onKeyPress={handleSkillAdd}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                      <Button
                        type="button"
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
  );
};

export default ProjectListFilters;