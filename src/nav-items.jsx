import { HomeIcon, UserIcon, BriefcaseIcon, BookOpenIcon, MessageSquareIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import ProfilePage from "./components/profile/ProfilePage";
import ProjectListPage from "./components/project/ProjectListPage";
import ArticleListPage from "./components/knowledgeBase/ArticleListPage";
import MessagingInterface from "./components/messaging/MessagingInterface";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <ProfilePage />,
  },
  {
    title: "Projects",
    to: "/projects",
    icon: <BriefcaseIcon className="h-4 w-4" />,
    page: <ProjectListPage />,
  },
  {
    title: "Knowledge Base",
    to: "/knowledge-base",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <ArticleListPage />,
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <MessagingInterface />,
  },
];
