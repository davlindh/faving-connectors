import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavigationTree from './NavigationTree';
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
    { title: "Dashboard", icon: Home, to: "/" },
    { title: "Projects", icon: Briefcase, to: "/projects" },
    { title: "Knowledge Base", icon: BookOpen, to: "/knowledge-base" },
    { title: "Calendar", icon: Calendar, to: "/calendar" },
    { title: "Analytics", icon: BarChart, to: "/analytics" },
    { title: "Settings", icon: Settings, to: "/settings" },
    { title: "Help", icon: HelpCircle, to: "/help" },
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
        <Link to="/" className="text-2xl font-bold text-primary">Faving</Link>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="p-4 space-y-2">
          <NavigationTree items={navigationItems} />
          {session && (
            <Link to={`/profile/${session.user.id}`} className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-primary/10 transition-colors">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          )}
          {authItems.map((item, index) => (
            <div key={index} className="py-1">
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center py-2 px-3 rounded-md text-sm hover:bg-primary/10 transition-colors"
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
        </nav>
      </ScrollArea>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white/80 backdrop-blur-md border-r">
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