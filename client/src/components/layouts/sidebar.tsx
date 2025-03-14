import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { UserRole } from "@shared/schema";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Building2, 
  DoorOpen, 
  Settings, 
  User, 
  BookOpen, 
  FileText,
  Calendar, 
  FileUp, 
  Trophy, 
  UsersRound,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface SidebarProps {
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ className, isMobile, onClose }: SidebarProps) {
  const { user, logoutMutation, isAdmin, isFaculty, isStudent } = useAuth();
  const [location] = useLocation();
  
  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };
  
  // Get role label
  const getRoleLabel = () => {
    if (isAdmin) return "Administrator";
    if (isFaculty) return "Faculty Member";
    if (isStudent) return "Student";
    return "User";
  };
  
  return (
    <aside 
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-800 shadow-lg z-40 flex flex-col transition-transform duration-300 ease-in-out", 
        isMobile && "transform -translate-x-full md:translate-x-0",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl">U</div>
            <span className="ml-3 font-bold text-xl text-primary">UniManage</span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
              <AvatarFallback className="bg-slate-200 dark:bg-slate-600">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-medium text-sm">{user?.firstName} {user?.lastName}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{getRoleLabel()}</div>
            </div>
          </div>
        </div>
        
        {/* Navigation based on role */}
        <div className="py-4 flex-1 overflow-y-auto">
          {/* Admin Navigation */}
          {isAdmin && (
            <>
              <div className="px-4 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Management</div>
              <nav>
                <NavLink 
                  to="/"
                  icon={<LayoutDashboard className="w-5 h-5 mr-3" />}
                  label="Dashboard"
                  active={location === "/"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/admin/faculty"
                  icon={<Users className="w-5 h-5 mr-3" />}
                  label="Faculty Management"
                  active={location === "/admin/faculty"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/admin/students"
                  icon={<UserPlus className="w-5 h-5 mr-3" />}
                  label="Student Management"
                  active={location === "/admin/students"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/admin/departments"
                  icon={<Building2 className="w-5 h-5 mr-3" />}
                  label="Departments"
                  active={location === "/admin/departments"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/admin/classrooms"
                  icon={<DoorOpen className="w-5 h-5 mr-3" />}
                  label="Classroom Management"
                  active={location === "/admin/classrooms"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/admin/settings"
                  icon={<Settings className="w-5 h-5 mr-3" />}
                  label="System Settings"
                  active={location === "/admin/settings"}
                  onClick={isMobile ? onClose : undefined}
                />
              </nav>
            </>
          )}
          
          {/* Faculty Navigation */}
          {isFaculty && (
            <>
              <div className="px-4 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Teaching</div>
              <nav>
                <NavLink 
                  to="/faculty"
                  icon={<LayoutDashboard className="w-5 h-5 mr-3" />}
                  label="Dashboard"
                  active={location === "/faculty"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/faculty/classes"
                  icon={<Users className="w-5 h-5 mr-3" />}
                  label="My Classes"
                  active={location === "/faculty/classes"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/faculty/assignments"
                  icon={<BookOpen className="w-5 h-5 mr-3" />}
                  label="Assignments"
                  active={location === "/faculty/assignments"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/faculty/tests"
                  icon={<FileText className="w-5 h-5 mr-3" />}
                  label="Test Results"
                  active={location === "/faculty/tests"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/faculty/timetables"
                  icon={<Calendar className="w-5 h-5 mr-3" />}
                  label="Timetables"
                  active={location === "/faculty/timetables"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/faculty/materials"
                  icon={<FileUp className="w-5 h-5 mr-3" />}
                  label="Study Materials"
                  active={location === "/faculty/materials"}
                  onClick={isMobile ? onClose : undefined}
                />
              </nav>
            </>
          )}
          
          {/* Student Navigation */}
          {isStudent && (
            <>
              <div className="px-4 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Learning</div>
              <nav>
                <NavLink 
                  to="/student"
                  icon={<LayoutDashboard className="w-5 h-5 mr-3" />}
                  label="Dashboard"
                  active={location === "/student"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/student/profile"
                  icon={<User className="w-5 h-5 mr-3" />}
                  label="My Profile"
                  active={location === "/student/profile"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/student/courses"
                  icon={<BookOpen className="w-5 h-5 mr-3" />}
                  label="Courses"
                  active={location === "/student/courses"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/student/assignments"
                  icon={<FileText className="w-5 h-5 mr-3" />}
                  label="Assignments"
                  active={location === "/student/assignments"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/student/achievements"
                  icon={<Trophy className="w-5 h-5 mr-3" />}
                  label="Achievements"
                  active={location === "/student/achievements"}
                  onClick={isMobile ? onClose : undefined}
                />
                <NavLink 
                  to="/student/following"
                  icon={<UsersRound className="w-5 h-5 mr-3" />}
                  label="Following"
                  active={location === "/student/following"}
                  onClick={isMobile ? onClose : undefined}
                />
              </nav>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 mt-auto border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-700 dark:text-slate-300 hover:text-primary" 
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </aside>
  );
}

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick?: () => void;
}

function NavLink({ to, icon, label, active, onClick }: NavLinkProps) {
  return (
    <Link href={to} onClick={onClick}>
      <a 
        className={cn(
          "flex items-center px-4 py-3 text-sm font-medium",
          active 
            ? "text-primary bg-blue-50 dark:bg-slate-700 border-r-4 border-primary" 
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
        )}
      >
        {icon}
        {label}
      </a>
    </Link>
  );
}
