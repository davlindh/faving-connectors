import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase, useProfile } from '@/integrations/supabase';
import ArticleCard from './ArticleCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from 'react-intersection-observer';

const ARTICLES_PER_PAGE = 9;

const ArticleListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    readTime: [0, 60],
    tags: []
  });
  const [sortBy, setSortBy] = useState('latest');
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: allArticles, isLoading: articlesLoading, error: articlesError } = useKnowledgeBase();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useProfile(session?.user?.id);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadMoreArticles = useCallback(() => {
    if (allArticles) {
      let filtered = allArticles.filter(article => 
        (searchTerm === '' || article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.category === 'all' || article.category === filters.category) &&
        (article.read_time >= filters.readTime[0] && article.read_time <= filters.readTime[1]) &&
        (filters.tags.length === 0 || filters.tags.every(tag => article.tags?.includes(tag)))
      );

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.published_at) - new Date(a.published_at);
        if (sortBy === 'oldest') return new Date(a.published_at) - new Date(b.published_at);
        if (sortBy === 'most_viewed') return b.view_count - a.view_count;
        if (sortBy === 'highest_rated') return b.average_rating - a.average_rating;
        return 0;
      });

      const newArticles = sorted.slice(0, page * ARTICLES_PER_PAGE);
      setDisplayedArticles(newArticles);
    }
  }, [allArticles, searchTerm, filters, sortBy, page]);

  useEffect(() => {
    loadMoreArticles();
  }, [loadMoreArticles]);

  useEffect(() => {
    if (inView) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView]);

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && e.target.value) {
      setFilters({
        ...filters,
        tags: [...filters.tags, e.target.value]
      });
      e.target.value = '';
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFilters({
      ...filters,
      tags: filters.tags.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Knowledge Base</h1>
        <Button onClick={() => navigate('/knowledge-base/create')}>
          <Plus className="mr-2 h-4 w-4" /> Create Article
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <div className="relative">
            <Input
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most_viewed">Most Viewed</SelectItem>
              <SelectItem value="highest_rated">Highest Rated</SelectItem>
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
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time (minutes)</label>
                  <Slider
                    min={0}
                    max={60}
                    step={5}
                    value={filters.readTime}
                    onValueChange={(value) => setFilters({ ...filters, readTime: value })}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.readTime[0]} min</span>
                    <span>{filters.readTime[1]} min</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <Input
                    placeholder="Add tags (press Enter)"
                    onKeyPress={handleSkillAdd}
                    className="mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {filters.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-4 w-4 p-0"
                          onClick={() => handleSkillRemove(tag)}
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

      {articlesLoading && <div className="text-center py-8">Loading articles...</div>}
      {articlesError && <div className="text-center text-red-500 py-8">Error loading articles: {articlesError.message}</div>}
      {!articlesLoading && !articlesError && displayedArticles.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-xl font-semibold mb-2">No articles found</p>
          <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
          <Button className="mt-4" onClick={() => navigate('/knowledge-base/create')}>
            Create New Article
          </Button>
        </div>
      )}

      <div ref={ref} className="h-10" />
    </div>
  );
};

export default ArticleListPage;