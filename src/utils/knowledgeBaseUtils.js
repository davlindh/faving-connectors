import { format } from 'date-fns';

export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMMM d, yyyy');
};

export const truncateContent = (content, maxLength = 150) => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trim() + '...';
};

export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return readTime;
};

export const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const categorizeArticles = (articles) => {
  return articles.reduce((acc, article) => {
    if (!acc[article.category]) {
      acc[article.category] = [];
    }
    acc[article.category].push(article);
    return acc;
  }, {});
};

export const searchArticles = (articles, searchTerm) => {
  const lowercasedTerm = searchTerm.toLowerCase();
  return articles.filter(
    article =>
      article.title.toLowerCase().includes(lowercasedTerm) ||
      article.content.toLowerCase().includes(lowercasedTerm) ||
      article.category.toLowerCase().includes(lowercasedTerm)
  );
};

export const sortArticles = (articles, sortBy = 'date') => {
  return [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.published_at) - new Date(a.published_at);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
};

export const getRelatedArticles = (currentArticle, allArticles, limit = 3) => {
  return allArticles
    .filter(article => 
      article.article_id !== currentArticle.article_id && 
      (article.category === currentArticle.category || 
       article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .slice(0, limit);
};

export const extractKeywords = (content, limit = 5) => {
  const words = content.toLowerCase().match(/\b(\w+)\b/g);
  const wordCount = {};
  words.forEach(word => {
    if (word.length > 3) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
};