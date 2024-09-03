import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  BarChart,
  X,
  LogOut
} from 'lucide-react';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const SidebarItem = ({ icon: Icon, title, to, isActive, onClick }) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full justify-start text-left font-normal",
      isActive && "bg-accent"
    )}
    asChild
    onClick={onClick}
  >
    <Link to={to}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{title}</span>
    </Link>
  </Button>
);

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const { supabase, session } = useSupabase();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

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
  ];

  const authItems = session
    ? [{ icon: LogOut, title: "Logout", onClick: handleLogout }]
    : [
        { icon: LogIn, title: "Login", to: "/auth/login" },
        { icon: UserPlus, title: "Register", to: "/auth/signup" },
      ];

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center px-4 border-b">
        <Link to="/" className="text-xl font-bold">Faving</Link>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="space-y-1 p-2">
          {navItems.map((item) => (
            <SidebarItem
              key={item.to}
              {...item}
              isActive={location.pathname === item.to}
              onClick={() => setOpen(false)}
            />
          ))}
          {authItems.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              isActive={location.pathname === item.to}
              onClick={() => {
                if (item.onClick) item.onClick();
                setOpen(false);
              }}
            />
          ))}
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r">
        {sidebarContent}
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          {sidebarContent}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Sidebar;