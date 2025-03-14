import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertUserSchema, UserRole } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, BookOpen, UserCog, GraduationCap, Building, Users, ChevronRight, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AdminRegisterForm } from "@/components/forms/admin-register-form";
import { FacultyRegisterForm } from "@/components/forms/faculty-register-form";
import { StudentRegisterForm } from "@/components/forms/student-register-form";

// Create extended schemas for login and registration
const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type RoleType = "admin" | "faculty" | "student" | null;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.ADMIN) {
        setLocation("/");
      } else if (user.role === UserRole.FACULTY) {
        setLocation("/faculty");
      } else if (user.role === UserRole.STUDENT) {
        setLocation("/student");
      }
    }
  }, [user, setLocation]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: selectedRole === "admin" 
        ? UserRole.ADMIN 
        : selectedRole === "faculty" 
          ? UserRole.FACULTY 
          : UserRole.STUDENT,
      firstName: "",
      lastName: "",
    },
  });
  
  // Update register form when role changes
  useEffect(() => {
    if (selectedRole) {
      const roleValue = selectedRole === "admin" 
        ? UserRole.ADMIN 
        : selectedRole === "faculty" 
          ? UserRole.FACULTY 
          : UserRole.STUDENT;
          
      registerForm.setValue("role", roleValue);
    }
  }, [selectedRole, registerForm]);
  
  // Handle login submission
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };
  
  // Handle registration submission
  const onRegisterSubmit = (data: RegisterFormValues) => {
    // Remove confirmPassword as it's not part of the user schema
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData);
  };
  
  // Reset to role selection
  const backToRoleSelection = () => {
    setSelectedRole(null);
  };
  
  // If already authenticated, don't render the auth page
  if (user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-beige dark:bg-[#1a2536] flex flex-col">
      {/* Navbar with logo and theme toggle - fixed position */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#263549] border-b border-sky-blue dark:border-teal/50 shadow-md py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-navy to-teal dark:from-sky-blue dark:to-teal flex items-center justify-center text-white font-bold">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div className="ml-3">
              <h1 className="font-bold text-xl text-navy dark:text-sky-blue">UniManage</h1>
              <p className="text-xs text-navy/70 dark:text-white/70">Comprehensive University Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {selectedRole && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={backToRoleSelection}
                className="text-navy dark:text-sky-blue hover:text-teal dark:hover:text-white"
              >
                Change Role
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 bg-beige dark:bg-[#1a2536] relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-sky-blue/10 to-transparent dark:from-navy/30 dark:to-transparent -z-10"></div>
        <div className="absolute bottom-0 right-0 w-full h-64 bg-gradient-to-t from-teal/5 to-transparent dark:from-teal/10 dark:to-transparent -z-10"></div>
        
        <div className="container mx-auto px-4 py-8">
          {!selectedRole ? (
            // Role Selection Screen
            <div className="max-w-4xl mx-auto mt-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-navy dark:text-sky-blue mb-4">Welcome to UniManage</h1>
                <p className="text-lg text-navy/80 dark:text-white/90 max-w-2xl mx-auto">
                  Select your role to access the appropriate portal for your university management needs
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RoleCard
                  icon={<UserCog className="w-10 h-10" />}
                  title="Administrator"
                  description="Manage the entire university system, including faculty, students, and departments"
                  onClick={() => setSelectedRole("admin")}
                />
                
                <RoleCard
                  icon={<BookOpen className="w-10 h-10" />}
                  title="Faculty"
                  description="Manage your classes, assignments, and track student progress"
                  onClick={() => setSelectedRole("faculty")}
                />
                
                <RoleCard
                  icon={<School className="w-10 h-10" />}
                  title="Student"
                  description="Access courses, submit assignments, and track your achievements"
                  onClick={() => setSelectedRole("student")}
                />
              </div>
              
              <div className="mt-16 flex flex-col md:flex-row gap-8 items-center justify-center bg-white dark:bg-[#263549] p-8 rounded-lg border border-sky-blue/30 dark:border-teal/30 shadow-lg">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-navy dark:text-sky-blue mb-3">Transforming Education Management</h2>
                  <p className="text-navy/80 dark:text-white/80 mb-4">
                    Our platform streamlines administrative tasks, enhances teaching efficiency, and improves the student learning experience.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <FeaturePoint icon={<Building size={18} />} text="Centralized Management" />
                    <FeaturePoint icon={<Users size={18} />} text="Simple Collaboration" />
                    <FeaturePoint icon={<GraduationCap size={18} />} text="Enhanced Learning" />
                    <FeaturePoint icon={<School size={18} />} text="Streamlined Processes" />
                  </div>
                </div>
                <div className="w-full md:w-auto">
                  <img 
                    src="https://img.freepik.com/free-vector/tiny-students-sitting-near-books_74855-5538.jpg" 
                    alt="Education illustration" 
                    className="w-full max-w-xs h-auto rounded-lg shadow-md"
                  />
                </div>
              </div>
            </div>
          ) : (
            // Login/Registration Screen for selected role
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
              {/* Authentication Forms */}
              <div className="w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-navy dark:text-sky-blue capitalize mb-2">
                    {selectedRole} Portal
                  </h2>
                  <p className="text-navy/70 dark:text-white/70">
                    {selectedRole === "admin" && "Access the administrative controls for university management"}
                    {selectedRole === "faculty" && "Access your teaching dashboard and management tools"}
                    {selectedRole === "student" && "Access your courses, assignments and track your progress"}
                  </p>
                </div>
                
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-sky-blue dark:bg-[#2a3d56]">
                    <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/90 data-[state=active]:text-navy dark:data-[state=active]:text-white">Login</TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/90 data-[state=active]:text-navy dark:data-[state=active]:text-white">Register</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Form */}
                  <TabsContent value="login">
                    <Card className="border-sky-blue dark:border-teal/70 dark:bg-[#263549]">
                      <CardHeader className="bg-sky-blue/20 dark:bg-teal/30">
                        <CardTitle className="text-navy dark:text-white">Login to Your Account</CardTitle>
                        <CardDescription className="text-navy/70 dark:text-white/90">
                          Enter your credentials to access the {selectedRole} portal
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Form {...loginForm}>
                          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                              control={loginForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your username" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={loginForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your password" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="submit"
                              className="w-full bg-navy hover:bg-teal dark:bg-sky-blue dark:text-navy font-semibold dark:hover:bg-white"
                              disabled={loginMutation.isPending}
                            >
                              {loginMutation.isPending ? "Logging in..." : "Login"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Register Form */}
                  <TabsContent value="register">
                    <Card className="border-sky-blue dark:border-teal/70 dark:bg-[#263549]">
                      <CardHeader className="bg-sky-blue/20 dark:bg-teal/30">
                        <CardTitle className="text-navy dark:text-white">Create a New Account</CardTitle>
                        <CardDescription className="text-navy/70 dark:text-white/90">
                          Register as a new {selectedRole}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-sky-blue dark:scrollbar-thumb-teal/70 scrollbar-track-transparent">
                        {selectedRole === "admin" && (
                          <div className="animate-fadeIn">
                            <AdminFeatures />
                            <AdminRegisterForm registerMutation={registerMutation} />
                          </div>
                        )}
                        
                        {selectedRole === "faculty" && (
                          <div className="animate-fadeIn">
                            <FacultyFeatures />
                            <FacultyRegisterForm registerMutation={registerMutation} />
                          </div>
                        )}
                        
                        {selectedRole === "student" && (
                          <div className="animate-fadeIn">
                            <StudentFeatures />
                            <StudentRegisterForm registerMutation={registerMutation} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Hero Section for specific role */}
              <div className="flex flex-col h-full justify-center">
                <h1 className="text-3xl font-bold text-navy dark:text-sky-blue mb-6 capitalize">
                  {selectedRole} Portal
                </h1>
                <p className="text-lg text-navy/80 dark:text-white/90 mb-8">
                  {selectedRole === "admin" && "A powerful dashboard for administrators to manage university operations, faculty, students, and resources all in one place."}
                  {selectedRole === "faculty" && "A comprehensive toolset for faculty members to manage classes, create and grade assignments, and track student performance."}
                  {selectedRole === "student" && "An intuitive platform for students to access course materials, submit assignments, and track their academic progress."}
                </p>
                
                <Card className="border-sky-blue dark:border-teal/70 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-navy/10 to-teal/10 dark:from-[#263549] dark:to-teal/20 p-6">
                      {selectedRole === "admin" && <AdminFeatures />}
                      {selectedRole === "faculty" && <FacultyFeatures />}
                      {selectedRole === "student" && <StudentFeatures />}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Role selection card
interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function RoleCard({ icon, title, description, onClick }: RoleCardProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center bg-white dark:bg-[#263549] border border-sky-blue/30 dark:border-teal/30 rounded-xl p-8 text-center transition-all hover:shadow-lg hover:scale-105 hover:border-teal dark:hover:border-sky-blue group"
    >
      <div className="w-20 h-20 rounded-full bg-sky-blue/20 dark:bg-teal/20 flex items-center justify-center mb-6 group-hover:bg-teal/30 dark:group-hover:bg-sky-blue/30 transition-colors">
        <div className="text-navy dark:text-sky-blue group-hover:text-teal dark:group-hover:text-white transition-colors">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-3">{title}</h3>
      <p className="text-navy/70 dark:text-white/70 mb-6">{description}</p>
      <div className="flex items-center text-teal dark:text-sky-blue gap-2 font-medium">
        <span>Continue</span>
        <ChevronRight size={18} />
      </div>
    </button>
  );
}

// Feature point component
function FeaturePoint({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-teal dark:text-sky-blue">{icon}</div>
      <span className="text-navy/80 dark:text-white/80 text-sm">{text}</span>
    </div>
  );
}

// Role specific features
function AdminFeatures() {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Administrator Features</h3>
      <ul className="space-y-3">
        <FeatureItem text="Comprehensive user management for faculty and students" />
        <FeatureItem text="Department and classroom allocation tools" />
        <FeatureItem text="System-wide analytics and reports" />
        <FeatureItem text="Resource allocation and scheduling interfaces" />
      </ul>
    </div>
  );
}

function FacultyFeatures() {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Faculty Features</h3>
      <ul className="space-y-3">
        <FeatureItem text="Create and manage course materials and assignments" />
        <FeatureItem text="Grade submissions and provide feedback" />
        <FeatureItem text="Track student attendance and performance" />
        <FeatureItem text="Communicate with students and administrators" />
      </ul>
    </div>
  );
}

function StudentFeatures() {
  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Student Features</h3>
      <ul className="space-y-3">
        <FeatureItem text="Access course materials and assignments" />
        <FeatureItem text="Submit assignments and view grades" />
        <FeatureItem text="Track academic achievements and milestones" />
        <FeatureItem text="Connect with peers and faculty members" />
      </ul>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <div className="min-w-5 h-5 rounded-full bg-navy/10 dark:bg-sky-blue/20 flex items-center justify-center mt-0.5">
        <div className="w-2 h-2 rounded-full bg-navy dark:bg-sky-blue"></div>
      </div>
      <span className="text-navy/80 dark:text-white/90">{text}</span>
    </li>
  );
}