import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeBaseArticle } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash } from 'lucide-react';

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useKnowledgeBaseArticle(articleId);

  if (isLoading) return <div className="text-center mt-8">Loading article...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading article: {error.message}</div>;
  if (!article) return <div className="text-center mt-8">Article not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button variant="ghost" onClick={() => navigate('/knowledge-base')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Knowledge Base
      </Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl">{article.title}</CardTitle>
            <Badge>{article.category}</Badge>
          </div>
          <div className="text-sm text-gray-500">
            Published on: {new Date(article.published_at).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent>
          <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose max-w-none" />
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end space-x-4">
        <Button variant="outline" onClick={() => navigate(`/knowledge-base/edit/${articleId}`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Article
        </Button>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete Article
        </Button>
      </div>
    </div>
  );
};

export default ArticleDetailPage;