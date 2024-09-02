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
import ProjectCreationForm from "./components/project/ProjectCreationForm";

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
                    {navItems.map(({ to, page }) => (
                      <Route key={to} path={to} element={page} />
                    ))}
                    <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                    <Route path="/projects/create" element={<ProjectCreationForm />} />
                    <Route path="/projects/edit/:projectId" element={<ProjectCreationForm />} />
                    <Route path="/profile/:profileId" element={<ProfilePage />} />
                    <Route path="/knowledge-base/create" element={<ArticleCreationForm />} />
                    <Route path="/knowledge-base/:articleId" element={<ArticleDetailPage />} />
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