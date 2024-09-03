import React from 'react';
import { useProjects, useProfiles, useKnowledgeBase } from '@/integrations/supabase';
import ProjectCard from '@/components/project/ProjectCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();
  const { data: articles, isLoading: articlesLoading, error: articlesError } = useKnowledgeBase();

  const getFeaturedProjects = (projects) => {
    if (!projects) return [];
    return projects.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).slice(0, 3);
  };

  const getFeaturedUsers = (profiles) => {
    if (!profiles) return [];
    return profiles.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  };

  const getFeaturedArticles = (articles) => {
    if (!articles) return [];
    return articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, 3);
  };

  const featuredProjects = getFeaturedProjects(projects);
  const featuredUsers = getFeaturedUsers(profiles);
  const featuredArticles = getFeaturedArticles(articles);

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to Faving</h1>
        <p className="text-xl sm:text-2xl text-gray-600 mb-8">Connect, Collaborate, and Create Amazing Projects</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/projects">Explore Projects</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/register">Join Now</Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
          <CardContent className="p-6 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Find Projects</h3>
            <p className="text-gray-600 dark:text-gray-300">Discover exciting projects that match your skills and interests.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
          <CardContent className="p-6 text-center">
            <Users className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Connect with Talent</h3>
            <p className="text-gray-600 dark:text-gray-300">Collaborate with skilled professionals from around the world.</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900 dark:to-amber-900">
          <CardContent className="p-6 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-yellow-600 dark:text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
            <p className="text-gray-600 dark:text-gray-300">Contribute to and learn from our extensive knowledge base.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Featured Projects</h2>
        {projectsLoading && <div className="text-center py-8">Loading projects...</div>}
        {projectsError && <div className="text-center text-red-500 py-8">Error loading projects: {projectsError.message}</div>}
        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/projects">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Featured Users</h2>
        {profilesLoading && <div className="text-center py-8">Loading users...</div>}
        {profilesError && <div className="text-center text-red-500 py-8">Error loading users: {profilesError.message}</div>}
        {featuredUsers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredUsers.map((user) => (
              <Card key={user.user_id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                      <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg">{user.first_name} {user.last_name}</h3>
                      <p className="text-sm text-gray-500">{user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-1" />
                      <span className="font-medium">{user.score || 0}</span>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/profile/${user.user_id}`}>View Profile</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/find-profiles">View All Users <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Latest from Knowledge Base</h2>
        {articlesLoading && <div className="text-center py-8">Loading articles...</div>}
        {articlesError && <div className="text-center text-red-500 py-8">Error loading articles: {articlesError.message}</div>}
        {featuredArticles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Card key={article.article_id} className="hover:shadow-lg transition-shadow duration-300">
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
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline" size="lg">
            <Link to="/knowledge-base">Explore Knowledge Base <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Join our community of innovators and start collaborating on exciting projects today!</p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;