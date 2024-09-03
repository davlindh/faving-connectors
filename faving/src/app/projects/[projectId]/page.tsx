import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import ProjectDetails from '@/components/ProjectDetails';

export const dynamic = 'force-dynamic';

export default async function ProjectPage({ params: { projectId } }: { params: { projectId: string } }) {
  const supabase = createServerComponentClient({ cookies });
  
  const { data: project, error } = await supabase
    .from('projects')
    .select(`
      *,
      creator:users!creator_id(user_id, first_name, last_name, email),
      interested_users:project_interests(user_id)
    `)
    .eq('project_id', projectId)
    .single();

  if (error || !project) {
    notFound();
  }

  const { data: session } = await supabase.auth.getSession();

  return <ProjectDetails project={project} currentUserId={session?.user?.id} />;
}