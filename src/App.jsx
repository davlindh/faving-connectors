import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SupabaseProvider } from './integrations/supabase/SupabaseProvider';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PerformanceProfiler from './components/PerformanceProfiler';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const ProjectListPage = lazy(() => import('./components/project/ProjectListPage'));
const ProjectCreationForm = lazy(() => import('./components/project/ProjectCreationForm'));
const ProjectDetailPage = lazy(() => import('./components/project/ProjectDetailPage'));
const ProfilePage = lazy(() => import('./components/profile/ProfilePage'));
const ArticleListPage = lazy(() => import('./components/knowledgeBase/ArticleListPage'));
const ArticleDetailPage = lazy(() => import('./components/knowledgeBase/ArticleDetailPage'));
const ArticleCreationForm = lazy(() => import('./components/knowledgeBase/ArticleCreationForm'));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SupabaseProvider>
          <PerformanceProfiler>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<ProjectListPage />} />
                  <Route path="/projects/create" element={<ProjectCreationForm />} />
                  <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                  <Route path="/profile/:profileId?" element={<ProfilePage />} />
                  <Route path="/knowledge-base" element={<ArticleListPage />} />
                  <Route path="/knowledge-base/:articleId" element={<ArticleDetailPage />} />
                  <Route path="/knowledge-base/create" element={<ArticleCreationForm />} />
                </Routes>
              </Suspense>
            </Layout>
          </PerformanceProfiler>
        </SupabaseProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
