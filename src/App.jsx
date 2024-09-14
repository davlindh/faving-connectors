import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/shared/LoadingSpinner';
import PerformanceProfiler from './components/PerformanceProfiler';

// Lazy load components
const Index = React.lazy(() => import('./pages/Index'));
const ProjectListPage = React.lazy(() => import('./components/project/ProjectListPage'));
const ProjectCreationForm = React.lazy(() => import('./components/project/ProjectCreationForm'));
const ProjectDetailPage = React.lazy(() => import('./components/project/ProjectDetailPage'));
const ProfilePage = React.lazy(() => import('./components/profile/ProfilePage'));
const ArticleListPage = React.lazy(() => import('./components/knowledgeBase/ArticleListPage'));
const ArticleDetailPage = React.lazy(() => import('./components/knowledgeBase/ArticleDetailPage'));
const ArticleCreationForm = React.lazy(() => import('./components/knowledgeBase/ArticleCreationForm'));

const App = () => {
  return (
    <PerformanceProfiler>
      <Router>
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
      </Router>
    </PerformanceProfiler>
  );
};

export default App;
