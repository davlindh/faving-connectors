import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SupabaseProvider } from "./integrations/supabase/SupabaseProvider";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import ProfilePage from "./components/profile/ProfilePage";
import ProjectListPage from "./components/project/ProjectListPage";
import ProjectDetailPage from "./components/project/ProjectDetailPage";
import ProjectForm from "./components/project/ProjectForm";
import ArticleListPage from "./components/knowledgeBase/ArticleListPage";
import ArticleCreationForm from "./components/knowledgeBase/ArticleCreationForm";
import ArticleDetailPage from "./components/knowledgeBase/ArticleDetailPage";
import MessagingInterface from "./components/messaging/MessagingInterface";
import ProfileSearchPage from "./components/profile/ProfileSearchPage";
import ContractsPage from "./components/contracts/ContractsPage";
import CalendarPage from "./components/calendar/CalendarPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";
import SettingsPage from "./components/settings/SettingsPage";
import HelpPage from "./components/help/HelpPage";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import AdminPanel from "./components/admin/AdminPanel";
import TeamPage from "./components/team/TeamPage";
import CommunityForums from "./components/community/CommunityForums";
import ForumThread from "./components/community/ForumThread";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <SupabaseProvider>
        <ProfileProvider>
          <ProjectProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/profile/:profileId" element={<ProfilePage />} />
                <Route path="/projects" element={<ProjectListPage />} />
                <Route path="/projects/my-projects" element={<ProjectListPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/projects/create" element={<ProjectForm />} />
                <Route path="/projects/edit/:projectId" element={<ProjectForm isEditing={true} />} />
                <Route path="/knowledge-base" element={<ArticleListPage />} />
                <Route path="/knowledge-base/create" element={<ArticleCreationForm />} />
                <Route path="/knowledge-base/:articleId" element={<ArticleDetailPage />} />
                <Route path="/messages" element={<MessagingInterface />} />
                <Route path="/find-profiles" element={<ProfileSearchPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SignUpPage />} />
                <Route path="/admin/project/:projectId" element={<AdminPanel />} />
                <Route path="/team/:teamId" element={<TeamPage />} />
                <Route path="/community/forums" element={<CommunityForums />} />
                <Route path="/community/forums/:threadId" element={<ForumThread />} />
              </Routes>
            </Layout>
          </ProjectProvider>
        </ProfileProvider>
      </SupabaseProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;