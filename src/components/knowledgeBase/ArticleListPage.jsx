import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from './ArticleCard';
import { useKnowledgeBase } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ArticleListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    tags: [],
  });
  const [sortBy, setSortBy] = useState('latest');
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: articles, isLoading, error } = useKnowledgeBase();

  useEffect(() => {
    if (articles) {
      const uniqueCategories = [...new Set(articles.map(article => article.category))];
      setCategories(['all', ...uniqueCategories]);

      const tags = articles.reduce((acc, article) => {
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

      let filtered = articles.filter(article => 
        (searchTerm === '' || article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.category === 'all' || article.category === filters.category) &&
        (filters.tags.length === 0 || filters.tags.every(tag => article.tags?.includes(tag)))
      );

      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'latest') return new Date(b.published_at) - new Date(a.published_at);
        if (sortBy === 'oldest') return new Date(a.published_at) - new Date(b.published_at);
        if (sortBy === 'most_viewed') return b.view_count - a.view_count;
        return 0;
      });

      setDisplayedArticles(sorted);
    }
  }, [articles, searchTerm, filters, sortBy]);

  const handleCreateArticle = () => {
    if (!session) {
      toast.error('You must be logged in to create an article');
      return;
    }
    navigate('/knowledge-base/create');
  };

  const handleTagFilter = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <Button onClick={handleCreateArticle}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Article
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
                  <Label className="text-sm font-medium mb-1">Category</Label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1">Tags</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {Object.entries(allTags).map(([tag, { count }]) => (
                      <div key={tag} className="flex items-center">
                        <Checkbox
                          id={tag}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={() => handleTagFilter(tag)}
                        />
                        <label htmlFor={tag} className="ml-2 text-sm">
                          {tag} ({count})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.tags.map(tag => (
          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleTagFilter(tag)}>
            {tag} <span className="ml-1">×</span>
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="grid" className="mb-6">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedArticles.map((article) => (
              <ArticleCard key={article.article_id} article={article} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list">
          <div className="space-y-4">
            {displayedArticles.map((article) => (
              <Card key={article.article_id}>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(article.published_at).toLocaleDateString()} | {article.category}
                  </p>
                  <p className="text-sm mb-2">{article.content.substring(0, 150)}...</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags?.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {isLoading && <div className="text-center py-8">Loading articles...</div>}
      {error && <div className="text-center text-red-500 py-8">Error loading articles: {error.message}</div>}
      {displayedArticles.length === 0 && !isLoading && !error && (
        <div className="text-center py-8">No articles found matching your criteria.</div>
      )}
    </div>
  );
};

export default ArticleListPage;