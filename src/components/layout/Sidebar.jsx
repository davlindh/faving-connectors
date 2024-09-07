import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationTree from './NavigationTree';
import CommunitySection from '../community/CommunitySection';
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  LogIn,
  UserPlus,
  Settings,
  HelpCircle,
  FileText,
  Calendar,
  BarChart,
  X,
  LogOut,
  Folder
} from 'lucide-react';
import { useSupabase } from '@/integrations/supabase/SupabaseProvider';
import { toast } from 'sonner';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, signOut } = useSupabase();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      to: "/",
    },
    {
      title: "Projects",
      icon: Briefcase,
      children: [
        { title: "All Projects", to: "/projects" },
        { title: "My Projects", to: "/projects/my-projects" },
        { title: "Create Project", to: "/projects/create" },
      ],
    },
    {
      title: "Knowledge Base",
      icon: BookOpen,
      children: [
        { title: "Articles", to: "/knowledge-base" },
        { title: "Create Article", to: "/knowledge-base/create" },
      ],
    },
    {
      title: "Resources",
      icon: Folder,
      children: [
        { title: "Contracts", to: "/contracts", icon: FileText },
        { title: "Calendar", to: "/calendar", icon: Calendar },
        { title: "Analytics", to: "/analytics", icon: BarChart },
      ],
    },
    { title: "Settings", to: "/settings", icon: Settings },
    { title: "Help", to: "/help", icon: HelpCircle },
  ];

  const authItems = session
    ? [{ title: "Logout", icon: LogOut, onClick: handleLogout }]
    : [
        { title: "Login", to: "/login", icon: LogIn },
        { title: "Register", to: "/register", icon: UserPlus },
      ];

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center px-4 border-b">
        <Link to="/" className="text-xl font-bold">Faving</Link>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="p-4">
          <NavigationTree items={navigationItems} />
          <CommunitySection />
          <div className="mt-4 pt-4 border-t">
            {session && (
              <Link to={`/profile/${session.user.id}`} className="flex items-center mb-4 text-sm hover:text-primary transition-colors">
                <User className="mr-2 h-4 w-4" />
                My Profile
              </Link>
            )}
            {authItems.map((item, index) => (
              <div key={index} className="mb-2">
                {item.to ? (
                  <Link
                    to={item.to}
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={item.onClick}
                  >
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white dark:bg-gray-800 border-r">
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