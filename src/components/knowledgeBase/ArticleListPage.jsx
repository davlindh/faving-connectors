import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleCard from './ArticleCard.jsx';
import SearchBar from '../shared/SearchBar.jsx';
import { useKnowledgeBase } from '@/integrations/supabase';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';

const ArticleListPage = () => {
  const { data: articles, isLoading, error } = useKnowledgeBase();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredArticles = articles?.filter(article => 
    (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     article.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (categoryFilter === 'all' || article.category === categoryFilter)
  );

  const categories = ['all', ...new Set(articles?.map(article => article.category) || [])];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <Button onClick={() => navigate('/knowledge-base/create')}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Article
        </Button>
      </div>
      <div className="flex space-x-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isLoading && <div className="text-center mt-8">Loading articles...</div>}
      {error && <div className="text-center mt-8 text-red-500">Error loading articles: {error.message}</div>}
      {filteredArticles && filteredArticles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.article_id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center mt-8">No articles found.</div>
      )}
    </div>
  );
};

export default ArticleListPage;