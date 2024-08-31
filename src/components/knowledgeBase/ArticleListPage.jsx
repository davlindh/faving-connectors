import React from 'react';
import ArticleCard from './ArticleCard';
import SearchBar from '../shared/SearchBar';

const ArticleListPage = ({ articles }) => {
  const handleSearch = (searchTerm) => {
    // TODO: Implement search functionality
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Knowledge Base</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

export default ArticleListPage;