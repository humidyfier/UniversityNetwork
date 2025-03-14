import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { Menu, Home, BookOpen, FileText, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <header className="md:hidden bg-white dark:bg-slate-800 shadow-sm fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center justify-between p-4">
        <button 
          className="text-slate-700 dark:text-white" 
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="font-bold text-primary text-lg">UniManage</div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export function MobileNavbar() {
  const [location] = useLocation();
  const { isAdmin, isFaculty, isStudent } = useAuth();
  
  if (!isAdmin && !isFaculty && !isStudent) return null;
  
  // Define navigation items based on role
  let items = [];
  
  if (isAdmin) {
    items = [
      { icon: <Home className="text-xl" />, label: "Dashboard", path: "/" },
      { icon: <User className="text-xl" />, label: "Faculty", path: "/admin/faculty" },
      { icon: <FileText className="text-xl" />, label: "Students", path: "/admin/students" },
      { icon: <BookOpen className="text-xl" />, label: "Classrooms", path: "/admin/classrooms" },
    ];
  } else if (isFaculty) {
    items = [
      { icon: <Home className="text-xl" />, label: "Dashboard", path: "/faculty" },
      { icon: <BookOpen className="text-xl" />, label: "Classes", path: "/faculty/classes" },
      { icon: <FileText className="text-xl" />, label: "Assignments", path: "/faculty/assignments" },
      { icon: <User className="text-xl" />, label: "Profile", path: "/faculty/profile" },
    ];
  } else if (isStudent) {
    items = [
      { icon: <Home className="text-xl" />, label: "Dashboard", path: "/student" },
      { icon: <BookOpen className="text-xl" />, label: "Courses", path: "/student/courses" },
      { icon: <FileText className="text-xl" />, label: "Assignments", path: "/student/assignments" },
      { icon: <User className="text-xl" />, label: "Profile", path: "/student/profile" },
    ];
  }
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-2 px-4 z-30">
      <div className="flex justify-around">
        {items.map((item, index) => (
          <MobileNavItem 
            key={index}
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={location === item.path}
          />
        ))}
      </div>
    </nav>
  );
}

interface MobileNavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active: boolean;
}

function MobileNavItem({ icon, label, to, active }: MobileNavItemProps) {
  return (
    <Link href={to}>
      <a className="p-2 flex flex-col items-center">
        <span className={cn(
          "text-xl",
          active ? "text-primary" : "text-slate-500 dark:text-slate-400"
        )}>
          {icon}
        </span>
        <span className={cn(
          "text-xs mt-1",
          active ? "text-primary" : "text-slate-500 dark:text-slate-400"
        )}>
          {label}
        </span>
      </a>
    </Link>
  );
}
