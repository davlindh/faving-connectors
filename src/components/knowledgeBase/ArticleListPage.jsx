import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKnowledgeBase, useProfile } from '@/integrations/supabase';
import ArticleCard from './ArticleCard';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Search, Plus, Filter, Grid, List } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInView } from 'react-intersection-observer';
import { Checkbox } from "@/components/ui/checkbox";

const ARTICLES_PER_PAGE = 12;

const ArticleListPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    tags: [],
    readTime: [0, 60],
  });
  const [sortBy, setSortBy] = useState('latest');
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: allArticles, isLoading: articlesLoading, error: articlesError } = useKnowledgeBase();
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useProfile(session?.user?.id);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState({});

  useEffect(() => {
    if (allArticles) {
      const uniqueCategories = ['all', ...new Set(allArticles.map(article => article.category))];
      setCategories(uniqueCategories);

      const tags = allArticles.reduce((acc, article) => {
        if (article.tags) {
          article.tags.forEach(tag => {
            if (!acc[tag]) {
              acc[tag] = { count: 1, articles: [article.article_id] };
            } else {
              acc[tag].count++;
              acc[tag].articles.push(article.article_id);
            }
          });
        }
        return acc;
      }, {});
      setAllTags(tags);
    }
  }, [allArticles]);

  const filterAndSortArticles = useCallback(() => {
    if (!allArticles) return [];

    let filtered = allArticles.filter(article => 
      (searchTerm === '' || 
       article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.category === 'all' || article.category === filters.category) &&
      (filters.tags.length === 0 || filters.tags.every(tag => article.tags?.includes(tag))) &&
      (article.read_time >= filters.readTime[0] && article.read_time <= filters.readTime[1])
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'latest') return new Date(b.published_at) - new Date(a.published_at);
      if (sortBy === 'oldest') return new Date(a.published_at) - new Date(b.published_at);
      if (sortBy === 'most_viewed') return b.view_count - a.view_count;
      if (sortBy === 'highest_rated') return b.average_rating - a.average_rating;
      return 0;
    });

    return sorted;
  }, [allArticles, searchTerm, filters, sortBy]);

  useEffect(() => {
    const filteredAndSorted = filterAndSortArticles();
    setDisplayedArticles(filteredAndSorted.slice(0, page * ARTICLES_PER_PAGE));
  }, [filterAndSortArticles, page]);

  useEffect(() => {
    if (inView) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView]);

  const handleTagFilter = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCreateArticle = () => {
    if (!session) {
      toast.error('You must be logged in to create an article');
      return;
    }
    navigate('/knowledge-base/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <Button onClick={handleCreateArticle}>
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
          <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
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
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <div className="space-y-2">
                    {Object.entries(allTags).map(([tag, { count }]) => (
                      <div key={tag} className="flex items-center">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) handleTagFilter(tag);
                            else handleTagFilter(tag);
                          }}
                        />
                        <label htmlFor={`tag-${tag}`} className="ml-2 text-sm">
                          {tag} ({count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Read Time (minutes)</label>
                  <Slider
                    min={0}
                    max={60}
                    step={5}
                    value={filters.readTime}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, readTime: value }))}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{filters.readTime[0]} min</span>
                    <span>{filters.readTime[1]} min</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="cursor-pointer"
            onClick={() => handleTagFilter(tag)}
          >
            {tag} <X className="ml-1 h-3 w-3" />
          </Badge>
        ))}
      </div>

      {articlesLoading && <div className="text-center py-8">Loading articles...</div>}
      {articlesError && <div className="text-center text-red-500 py-8">Error loading articles: {articlesError.message}</div>}
      {displayedArticles.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3" : "space-y-4"}>
          {displayedArticles.map((article) => (
            <ArticleCard key={article.article_id} article={article} viewMode={viewMode} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No articles found matching your criteria.</div>
      )}

      <div ref={ref} className="h-10" />
    </div>
  );
};

export default ArticleListPage;