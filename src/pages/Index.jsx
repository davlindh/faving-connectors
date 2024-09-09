import React from 'react';
import { useProjects, useProfiles, useKnowledgeBase } from '@/integrations/supabase';
import ProjectCard from '@/components/project/ProjectCard';
import UserCard from '@/components/profile/UserCard';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();
  const { data: articles, isLoading: articlesLoading, error: articlesError } = useKnowledgeBase();

  const getFeaturedItems = (items, count = 3) => items?.slice(0, count) || [];

  const featuredProjects = getFeaturedItems(projects);
  const featuredUsers = getFeaturedItems(profiles);
  const featuredArticles = getFeaturedItems(articles);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Welcome to Faving
        </h1>
        <p className="text-2xl text-gray-600 mb-8">Connect, Collaborate, and Create Amazing Projects</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Link to="/projects">Explore Projects</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/register">Join Now</Link>
          </Button>
        </div>
      </section>

      <FeaturedSection
        title="Featured Projects"
        items={featuredProjects}
        loading={projectsLoading}
        error={projectsError}
        emptyMessage="No featured projects available at the moment."
        renderItem={(project) => <ProjectCard key={project.project_id} project={project} />}
        viewAllLink="/projects"
        viewAllText="View All Projects"
      />

      <FeaturedSection
        title="Featured Users"
        items={featuredUsers}
        loading={profilesLoading}
        error={profilesError}
        emptyMessage="No featured users available at the moment."
        renderItem={(user) => (
          <UserCard key={user.user_id} user={user} projects={projects} />
        )}
        viewAllLink="/find-profiles"
        viewAllText="View All Users"
      />

      <FeaturedSection
        title="Latest from Knowledge Base"
        items={featuredArticles}
        loading={articlesLoading}
        error={articlesError}
        emptyMessage="No featured articles available at the moment."
        renderItem={(article) => (
          <ArticleCard key={article.article_id} article={article} />
        )}
        viewAllLink="/knowledge-base"
        viewAllText="Explore Knowledge Base"
      />

      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-12 mb-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join our community of innovators and start collaborating on exciting projects today!</p>
          <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeaturedSection = ({ title, items, loading, error, emptyMessage, renderItem, viewAllLink, viewAllText }) => (
  <section className="mb-16">
    <h2 className="text-3xl font-semibold mb-8 text-center">{title}</h2>
    {loading && <div className="text-center py-8">Loading...</div>}
    {error && <div className="text-center text-red-500 py-8">Error: {error.message}</div>}
    {items?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(renderItem)}
      </div>
    ) : (
      <div className="text-center py-8">{emptyMessage}</div>
    )}
    <div className="text-center mt-8">
      <Button asChild variant="outline" size="lg">
        <Link to={viewAllLink}>{viewAllText} <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </div>
  </section>
);

const ArticleCard = ({ article }) => (
  <Card className="hover:shadow-lg transition-shadow duration-300">
    <CardHeader>
      <CardTitle className="text-xl">{article.title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.content}</p>
      <div className="flex justify-between items-center">
        <Badge>{article.category}</Badge>
        <Button asChild variant="link" size="sm">
          <Link to={`/knowledge-base/${article.article_id}`}>Read More</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default Index;