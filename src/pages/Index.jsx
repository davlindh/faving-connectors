import React from 'react';
import { useProjects, useProfiles } from '@/integrations/supabase';
import ProjectCard from '@/components/project/ProjectCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Index = () => {
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { data: profiles, isLoading: profilesLoading, error: profilesError } = useProfiles();

  const getFeaturedProjects = (projects) => {
    if (!projects) return [];
    // Sort projects by start_date (newest first) and take the first 3
    return projects.sort((a, b) => new Date(b.start_date) - new Date(a.start_date)).slice(0, 3);
  };

  const getFeaturedUsers = (profiles) => {
    if (!profiles) return [];
    // Sort profiles by some criteria (e.g., score) and take the first 3
    return profiles.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  };

  const featuredProjects = getFeaturedProjects(projects);
  const featuredUsers = getFeaturedUsers(profiles);

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Faving</h1>
        <p className="text-xl text-gray-600 mb-8">Connect, Collaborate, and Create Amazing Projects</p>
        <Button asChild size="lg">
          <Link to="/projects">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Find Projects</h3>
          <p className="text-gray-600">Discover exciting projects that match your skills and interests.</p>
        </div>
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connect with Talent</h3>
          <p className="text-gray-600">Collaborate with skilled professionals from around the world.</p>
        </div>
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Share Knowledge</h3>
          <p className="text-gray-600">Contribute to and learn from our extensive knowledge base.</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Featured Projects</h2>
        {projectsLoading && <div>Loading projects...</div>}
        {projectsError && <div>Error loading projects: {projectsError.message}</div>}
        {featuredProjects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/projects">View All Projects ({projects ? projects.length : 0}) <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Featured Users</h2>
        {profilesLoading && <div>Loading users...</div>}
        {profilesError && <div>Error loading users: {profilesError.message}</div>}
        {featuredUsers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredUsers.map((user) => (
              <div key={user.user_id} className="flex items-center p-4 bg-white rounded-lg shadow">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback>{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className="ml-4">
                  <h3 className="font-semibold">{user.first_name} {user.last_name}</h3>
                  <p className="text-sm text-gray-500">{user.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/find-profiles">View All Users <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;