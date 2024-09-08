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

const ArticleListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    tags: [],
  });
  const [sortBy, setSortBy] = useState('latest');
  const [displayedArticles, setDisplayedArticles] = useState([]);
  const navigate = useNavigate();
  const { session } = useSupabase();

  const { data: articles, isLoading, error } = useKnowledgeBase();

  useEffect(() => {
    if (articles) {
      let filtered = articles.filter(article => 
        (searchTerm === '' || article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filters.category === 'all' || article.category === filters.category) &&
        (filters.tags.length === 0 || filters.tags.every(tag => article.tags.includes(tag)))
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

  const categories = ['All', 'Technology', 'Design', 'Business', 'Marketing', 'Development'];
  const tags = ['React', 'Node.js', 'Python', 'UI/UX', 'SEO', 'Project Management'];

  if (isLoading) return <div className="text-center mt-8">Loading articles...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">Error loading articles: {error.message}</div>;

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
                        <SelectItem key={category} value={category.toLowerCase()}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-1">Tags</Label>
                  <div className="space-y-2">
                    {tags.map((tag) => (
                      <div key={tag} className="flex items-center">
                        <Checkbox
                          id={tag}
                          checked={filters.tags.includes(tag)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({ ...filters, tags: [...filters.tags, tag] });
                            } else {
                              setFilters({ ...filters, tags: filters.tags.filter(t => t !== tag) });
                            }
                          }}
                        />
                        <label htmlFor={tag} className="ml-2 text-sm">{tag}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {displayedArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedArticles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">No articles found matching your criteria.</div>
      )}
    </div>
  );
};

export default ArticleListPage;