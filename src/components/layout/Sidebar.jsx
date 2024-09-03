import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  MessageSquare,
  Search,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  BarChart
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, title, to, isActive }) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start text-left font-normal",
      isActive && "bg-accent"
    )}
    asChild
  >
    <Link to={to}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{title}</span>
    </Link>
  </Button>
);

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, title: "Home", to: "/" },
    { icon: User, title: "Profile", to: "/profile" },
    { icon: Briefcase, title: "Projects", to: "/projects" },
    { icon: BookOpen, title: "Knowledge Base", to: "/knowledge-base" },
    { icon: MessageSquare, title: "Messages", to: "/messages" },
    { icon: Search, title: "Find Profiles", to: "/find-profiles" },
    { icon: FileText, title: "Contracts", to: "/contracts" },
    { icon: Calendar, title: "Calendar", to: "/calendar" },
    { icon: BarChart, title: "Analytics", to: "/analytics" },
    { icon: Settings, title: "Settings", to: "/settings" },
    { icon: HelpCircle, title: "Help", to: "/help" },
    { icon: LogIn, title: "Login", to: "/login" },
    { icon: UserPlus, title: "Register", to: "/register" },
  ];

  return (
    <div className="w-64 bg-background border-r">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="text-xl font-bold">Faving</Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {navItems.map((item) => (
                <SidebarItem
                  key={item.to}
                  {...item}
                  isActive={location.pathname === item.to}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;