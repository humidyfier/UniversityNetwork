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
import { School, BookOpen, UserCog } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

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

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [location, setLocation] = useLocation();
  
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
      role: UserRole.STUDENT,
      firstName: "",
      lastName: "",
    },
  });
  
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
  
  // If already authenticated, don't render the auth page
  if (user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-beige dark:bg-[#1a2536] flex flex-col">
      {/* Navbar with logo and theme toggle */}
      <header className="w-full bg-white dark:bg-[#263549] border-b border-sky-blue dark:border-teal/50 shadow-sm py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-navy dark:bg-sky-blue flex items-center justify-center text-white dark:text-navy font-bold text-xl">U</div>
            <span className="ml-3 font-bold text-xl text-navy dark:text-sky-blue">UniManage</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex flex-1 bg-beige dark:bg-[#1a2536]">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-center min-h-[80vh]">
            {/* Authentication Forms */}
            <div className="w-full">
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
                        Enter your credentials to access your account
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
                            className="w-full bg-navy hover:bg-teal dark:bg-sky-blue dark:text-navy dark:hover:bg-teal dark:hover:text-white"
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
                      <CardTitle className="text-navy dark:text-white">Create an Account</CardTitle>
                      <CardDescription className="text-navy/70 dark:text-white/90">
                        Fill in your details to create a new account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={registerForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-navy dark:text-sky-blue">Username</FormLabel>
                                <FormControl>
                                  <Input placeholder="johndoe" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-navy dark:text-sky-blue">Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="john@example.edu" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={registerForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-navy dark:text-sky-blue">Role</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white">
                                      <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="dark:bg-[#263549] dark:border-teal/70">
                                    <SelectItem value={UserRole.STUDENT}>Student</SelectItem>
                                    <SelectItem value={UserRole.FACULTY}>Faculty</SelectItem>
                                    <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={registerForm.control}
                              name="password"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={registerForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-navy dark:text-sky-blue">Confirm Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="******" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Button
                            type="submit"
                            className="w-full bg-navy hover:bg-teal dark:bg-sky-blue dark:text-navy dark:hover:bg-teal dark:hover:text-white"
                            disabled={registerMutation.isPending}
                          >
                            {registerMutation.isPending ? "Registering..." : "Register"}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Hero Section */}
            <div className="flex flex-col h-full justify-center order-first md:order-last">
              <h1 className="text-4xl font-bold text-navy dark:text-sky-blue mb-6">University Management System</h1>
              <p className="text-lg text-navy/80 dark:text-white/90 mb-8">
                A comprehensive platform for administrators, faculty members, and students to manage university activities efficiently.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard 
                  icon={<UserCog className="w-8 h-8 text-navy dark:text-sky-blue" />} 
                  title="Admin Portal"
                  description="Manage faculty, students, departments, and classrooms all in one place."
                />
                
                <FeatureCard 
                  icon={<BookOpen className="w-8 h-8 text-teal dark:text-teal" />} 
                  title="Faculty Dashboard"
                  description="Manage classes, assignments, and student progress efficiently."
                />
                
                <FeatureCard 
                  icon={<School className="w-8 h-8 text-sky-blue dark:text-white" />} 
                  title="Student Experience"
                  description="Access courses, track achievements, and connect with peers."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-[#263549] border border-sky-blue dark:border-teal/70 p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2 text-navy dark:text-sky-blue">{title}</h3>
      <p className="text-sm text-navy/70 dark:text-white/80">{description}</p>
    </div>
  );
}
