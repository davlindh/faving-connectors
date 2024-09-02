import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useKnowledgeBaseArticle, useDeleteKnowledgeBaseArticle, useUpdateKnowledgeBaseArticle } from '@/integrations/supabase';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import ArticleEditForm from './ArticleEditForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ArticleDetailPage = () => {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { data: article, isLoading, error } = useKnowledgeBaseArticle(articleId);
  const deleteArticle = useDeleteKnowledgeBaseArticle();
  const updateArticle = useUpdateKnowledgeBaseArticle();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) return <div className="text-center mt-8">Loading article...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error loading article: {error.message}</div>;
  if (!article) return <div className="text-center mt-8">Article not found</div>;

  const handleDelete = async () => {
    try {
      await deleteArticle.mutateAsync(articleId);
      toast.success('Article deleted successfully');
      navigate('/knowledge-base');
    } catch (error) {
      console.error('Delete article error:', error);
      toast.error('Failed to delete article');
    }
  };

  const handleUpdate = async (updatedArticle) => {
    try {
      await updateArticle.mutateAsync({
        articleId,
        updates: {
          ...updatedArticle,
          updated_at: new Date().toISOString(),
        },
      });
      toast.success('Article updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Update article error:', error);
      toast.error('Failed to update article');
    }
  };

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
            {article.updated_at && ` (Updated: ${new Date(article.updated_at).toLocaleDateString()})`}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <ArticleEditForm article={article} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <div dangerouslySetInnerHTML={{ __html: article.content }} className="prose max-w-none" />
              {article.tags && article.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      {!isEditing && (
        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Article
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" /> Delete Article
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this article?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the article from the knowledge base.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};

export default ArticleDetailPage;