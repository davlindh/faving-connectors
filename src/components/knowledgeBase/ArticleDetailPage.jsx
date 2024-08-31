import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ArticleDetailPage = ({ article }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <p className="text-gray-500">Published on: {article.publishDate}</p>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleDetailPage;