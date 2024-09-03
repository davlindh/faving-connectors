import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProjectList from '@/components/ProjectList';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <ProjectList projects={projects || []} />
    </div>
  );
}