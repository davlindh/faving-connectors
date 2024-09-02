import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{article.title}</CardTitle>
          <Badge>{article.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 mb-4">
          {truncateContent(article.content, 150)}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(article.published_at).toLocaleDateString()}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="link" className="p-0">
          <Link to={`/knowledge-base/${article.article_id}`}>Read More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArticleCard;