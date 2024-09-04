import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Layout from "./components/layout/Layout";
import { SupabaseProvider } from "./integrations/supabase/SupabaseProvider";
import { SupabaseAuthProvider } from "./integrations/supabase/auth";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import ProjectDetailPage from "./components/project/ProjectDetailPage";
import ProfilePage from "./components/profile/ProfilePage";
import ArticleCreationForm from "./components/knowledgeBase/ArticleCreationForm";
import ArticleDetailPage from "./components/knowledgeBase/ArticleDetailPage";
import ProjectForm from "./components/project/ProjectForm";
import AdminPanel from "./components/admin/AdminPanel";
import TeamPage from "./components/team/TeamPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SupabaseProvider>
      <SupabaseAuthProvider>
        <ProfileProvider>
          <ProjectProvider>
            <TooltipProvider>
              <Toaster />
              <BrowserRouter>
                <Layout>
                  <Routes>
                    {navItems.map(({ to, page: PageComponent }) => (
                      <Route key={to} path={to} element={<PageComponent />} />
                    ))}
                    <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                    <Route path="/projects/create" element={<ProjectForm />} />
                    <Route path="/projects/edit/:projectId" element={<ProjectForm isEditing={true} />} />
                    <Route path="/profile/:profileId" element={<ProfilePage />} />
                    <Route path="/knowledge-base/create" element={<ArticleCreationForm />} />
                    <Route path="/knowledge-base/:articleId" element={<ArticleDetailPage />} />
                    <Route path="/admin/project/:projectId" element={<AdminPanel />} />
                    <Route path="/team/:teamId" element={<TeamPage />} />
                  </Routes>
                </Layout>
              </BrowserRouter>
            </TooltipProvider>
          </ProjectProvider>
        </ProfileProvider>
      </SupabaseAuthProvider>
    </SupabaseProvider>
  </QueryClientProvider>
);

export default App;