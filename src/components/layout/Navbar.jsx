import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
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
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const NavItem = ({ icon: Icon, title, to, subItems, isActive, onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (subItems) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left font-normal",
          isActive && "bg-accent",
          subItems && "flex items-center justify-between"
        )}
        onClick={handleClick}
      >
        <div className="flex items-center">
          <Icon className="mr-2 h-4 w-4" />
          <span>{title}</span>
        </div>
        {subItems && (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
      </Button>
      {isOpen && subItems && (
        <div className="ml-4 mt-1 space-y-1">
          {subItems.map((subItem, index) => (
            <NavItem key={index} {...subItem} />
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const location = useLocation();
  const { session, signOut } = useSupabase();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { icon: Home, title: "Home", to: "/" },
    { icon: User, title: "Profile", to: "/profile" },
    {
      icon: Briefcase,
      title: "Projects",
      to: "/projects",
      subItems: [
        { title: "All Projects", to: "/projects" },
        { title: "Create Project", to: "/projects/create" },
        { title: "My Projects", to: "/projects/my-projects" },
      ],
    },
    {
      icon: BookOpen,
      title: "Knowledge Base",
      to: "/knowledge-base",
      subItems: [
        { title: "Articles", to: "/knowledge-base" },
        { title: "Create Article", to: "/knowledge-base/create" },
      ],
    },
    { icon: MessageSquare, title: "Messages", to: "/messages" },
    { icon: Search, title: "Find Profiles", to: "/find-profiles" },
    { icon: LogIn, title: "Login", to: "/login" },
    { icon: UserPlus, title: "Register", to: "/register" },
  ];

  const utilityItems = [
    { icon: Settings, title: "Settings", to: "/settings" },
    { icon: HelpCircle, title: "Help", to: "/help" },
  ];

  const renderNavItems = (items) => {
    return items.map((item, index) => {
      if ((item.title === 'Login' || item.title === 'Register') && session) {
        return null;
      }
      if ((item.title === 'Profile' || item.title === 'Messages') && !session) {
        return null;
      }
      return (
        <NavItem
          key={index}
          {...item}
          isActive={location.pathname === item.to}
          onClick={() => setIsMenuOpen(false)}
        />
      );
    });
  };

  return (
    <nav className="bg-background border-r">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="text-xl font-bold">Faving</Link>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {renderNavItems(navItems)}
            </div>
          </div>
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Utility
            </h2>
            <div className="space-y-1">
              {renderNavItems(utilityItems)}
            </div>
          </div>
        </div>
        {session && (
          <div className="px-3 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleSignOut}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </ScrollArea>
    </nav>
  );
};

export default Navbar;