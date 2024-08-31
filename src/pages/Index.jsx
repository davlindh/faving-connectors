import React from 'react';
import { useProjects } from '@/integrations/supabase';
import ProjectCard from '@/components/project/ProjectCard';
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Faving</h1>
        <p className="text-xl text-gray-600 mb-8">Connect, Collaborate, and Create Amazing Projects</p>
        <Button asChild size="lg">
          <Link to="/projects">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
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

      <section>
        <h2 className="text-3xl font-semibold mb-6">Featured Projects</h2>
        {isLoading && <div>Loading projects...</div>}
        {error && <div>Error loading projects: {error.message}</div>}
        {projects && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        )}
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/projects">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
