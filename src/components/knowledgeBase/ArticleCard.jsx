import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ArticleCard = ({ article }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <Button>Read More</Button>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;