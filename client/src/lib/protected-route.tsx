import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { UserRole, UserRoleType } from "@shared/schema";
import MainLayout from "@/components/layouts/main-layout";

export function ProtectedRoute({
  path,
  component: Component,
  role
}: {
  path: string;
  component: React.ComponentType;
  role?: UserRoleType | UserRoleType[];
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // If role is specified, check if user has the required role
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    if (!roles.includes(user.role as UserRoleType)) {
      // Redirect to the appropriate dashboard based on role
      let redirectPath = "/auth";
      if (user.role === UserRole.ADMIN) {
        redirectPath = "/";
      } else if (user.role === UserRole.FACULTY) {
        redirectPath = "/faculty";
      } else if (user.role === UserRole.STUDENT) {
        redirectPath = "/student";
      }
      
      return (
        <Route path={path}>
          <Redirect to={redirectPath} />
        </Route>
      );
    }
  }

  // If authenticated and role check passes, render the component
  return (
    <Route path={path}>
      <MainLayout>
        <Component />
      </MainLayout>
    </Route>
  );
}
