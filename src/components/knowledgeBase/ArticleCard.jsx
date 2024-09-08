import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, Eye, ThumbsUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const ArticleCard = ({ article }) => {
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    const truncated = content.slice(0, maxLength).trim() + '...';
    return truncated.replace(/<[^>]*$/, '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary">{article.category}</Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              {format(new Date(article.published_at), 'MMM d, yyyy')}
            </div>
          </div>
          <CardTitle className="text-xl">
            <Link to={`/knowledge-base/${article.article_id}`} className="hover:underline hover:text-primary transition-colors duration-300">
              {article.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="text-gray-600 dark:text-gray-300 mb-4 prose prose-sm max-w-none line-clamp-3"
            dangerouslySetInnerHTML={{ __html: truncateContent(article.content, 150) }}
          />
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <User className="mr-1 h-4 w-4" />
            <span>{article.author_name || 'Anonymous'}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="mr-1 h-4 w-4" />
              <span>{article.view_count || 0} views</span>
            </div>
            <div className="flex items-center">
              <ThumbsUp className="mr-1 h-4 w-4" />
              <span>{article.likes || 0} likes</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4 border-t">
          <Button asChild className="w-full group hover:bg-primary hover:text-white transition-colors duration-300">
            <Link to={`/knowledge-base/${article.article_id}`}>
              Read More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ArticleCard;