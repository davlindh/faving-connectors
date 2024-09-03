import { HomeIcon, UserIcon, BriefcaseIcon, BookOpenIcon, MessageSquareIcon, LogInIcon, UserPlusIcon, SearchIcon, SettingsIcon, HelpCircleIcon, FileTextIcon, CalendarIcon, BarChartIcon } from "lucide-react";
import Index from "./pages/Index";
import ProfilePage from "./components/profile/ProfilePage";
import ProjectListPage from "./components/project/ProjectListPage";
import ArticleListPage from "./components/knowledgeBase/ArticleListPage";
import MessagingInterface from "./components/messaging/MessagingInterface";
import LoginForm from "./components/auth/LoginForm";
import RegistrationForm from "./components/auth/RegistrationForm";
import ProfileSearchPage from "./components/profile/ProfileSearchPage";
import SettingsPage from "./components/settings/SettingsPage";
import HelpPage from "./components/help/HelpPage";
import ContractsPage from "./components/contracts/ContractsPage";
import CalendarPage from "./components/calendar/CalendarPage";
import AnalyticsPage from "./components/analytics/AnalyticsPage";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: HomeIcon,
    page: Index,
  },
  {
    title: "Profile",
    to: "/profile",
    icon: UserIcon,
    page: ProfilePage,
  },
  {
    title: "Projects",
    to: "/projects",
    icon: BriefcaseIcon,
    page: ProjectListPage,
    subItems: [
      { title: "All Projects", to: "/projects" },
      { title: "My Projects", to: "/projects/my-projects" },
      { title: "Create Project", to: "/projects/create" },
    ],
  },
  {
    title: "Knowledge Base",
    to: "/knowledge-base",
    icon: BookOpenIcon,
    page: ArticleListPage,
    subItems: [
      { title: "Articles", to: "/knowledge-base" },
      { title: "Create Article", to: "/knowledge-base/create" },
    ],
  },
  {
    title: "Messages",
    to: "/messages",
    icon: MessageSquareIcon,
    page: MessagingInterface,
  },
  {
    title: "Find Profiles",
    to: "/find-profiles",
    icon: SearchIcon,
    page: ProfileSearchPage,
  },
  {
    title: "Contracts",
    to: "/contracts",
    icon: FileTextIcon,
    page: ContractsPage,
  },
  {
    title: "Calendar",
    to: "/calendar",
    icon: CalendarIcon,
    page: CalendarPage,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: BarChartIcon,
    page: AnalyticsPage,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: SettingsIcon,
    page: SettingsPage,
  },
  {
    title: "Help",
    to: "/help",
    icon: HelpCircleIcon,
    page: HelpPage,
  },
  {
    title: "Login",
    to: "/login",
    icon: LogInIcon,
    page: LoginForm,
  },
  {
    title: "Register",
    to: "/register",
    icon: UserPlusIcon,
    page: RegistrationForm,
  },
];