import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./components/ui/theme-toggle";

// Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminAnalytics from "@/pages/admin/analytics";
import FacultyDashboard from "@/pages/faculty/dashboard";
import StudentDashboard from "@/pages/student/dashboard";
import FacultyManagement from "@/pages/admin/faculty-management";
import StudentManagement from "@/pages/admin/student-management";
import ClassroomManagement from "@/pages/admin/classroom-management";
import FacultyClasses from "@/pages/faculty/classes";
import FacultyAssignments from "@/pages/faculty/assignments";
import StudentProfile from "@/pages/student/profile";
import StudentCourses from "@/pages/student/courses";
import StudentAchievements from "@/pages/student/achievements";
import AuthPage from "@/pages/auth-page";

function Router() {
  return (
    <Switch>
      {/* Auth Page */}
      <Route path="/auth" component={AuthPage} />

      {/* Admin Routes */}
      <ProtectedRoute path="/" role="admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/analytics" role="admin" component={AdminAnalytics} />
      <ProtectedRoute path="/admin/faculty" role="admin" component={FacultyManagement} />
      <ProtectedRoute path="/admin/students" role="admin" component={StudentManagement} />
      <ProtectedRoute path="/admin/classrooms" role="admin" component={ClassroomManagement} />
      
      {/* Faculty Routes */}
      <ProtectedRoute path="/faculty" role="faculty" component={FacultyDashboard} />
      <ProtectedRoute path="/faculty/classes" role="faculty" component={FacultyClasses} />
      <ProtectedRoute path="/faculty/assignments" role="faculty" component={FacultyAssignments} />
      
      {/* Student Routes */}
      <ProtectedRoute path="/student" role="student" component={StudentDashboard} />
      <ProtectedRoute path="/student/profile" role="student" component={StudentProfile} />
      <ProtectedRoute path="/student/courses" role="student" component={StudentCourses} />
      <ProtectedRoute path="/student/achievements" role="student" component={StudentAchievements} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
