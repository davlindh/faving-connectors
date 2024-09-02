import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary">{article.category}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(article.published_at).toLocaleDateString()}
          </div>
        </div>
        <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncateContent(article.content, 150)}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <User className="mr-1 h-4 w-4" />
          <span>{article.author_name || 'Anonymous'}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="link" className="ml-auto group">
          <Link to={`/knowledge-base/${article.article_id}`}>
            Read More
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;