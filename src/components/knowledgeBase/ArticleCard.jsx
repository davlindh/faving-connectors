import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
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
          {article.content.slice(0, 150)}...
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Calendar className="mr-2 h-4 w-4" />
          {new Date(article.published_at).toLocaleDateString()}
        </div>
      </CardContent>
      <div className="p-4 pt-0 mt-auto">
        <Button asChild className="w-full">
          <Link to={`/knowledge-base/${article.article_id}`}>Read More</Link>
        </Button>
      </div>
    </Card>
  );
};

export default ArticleCard;