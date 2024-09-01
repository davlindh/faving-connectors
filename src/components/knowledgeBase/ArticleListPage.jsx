import React from 'react';
import ArticleCard from './ArticleCard.jsx';
import SearchBar from '../shared/SearchBar.jsx';
import { useKnowledgeBase } from '@/integrations/supabase';

const ArticleListPage = () => {
  const { data: articles, isLoading, error } = useKnowledgeBase();

  const handleSearch = (searchTerm) => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  if (isLoading) return <div className="text-center mt-8">Loading articles...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading articles: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
      <SearchBar onSearch={handleSearch} />
      {articles && articles.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          {articles.map((article) => (
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
