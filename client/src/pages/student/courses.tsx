import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Search, 
  BookOpen, 
  FileText, 
  ArrowRight, 
  PlusCircle, 
  DoorOpen, 
  Calendar, 
  User, 
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Form schema for enrolling in a course
const enrollFormSchema = z.object({
  classId: z.string().min(3, "Class ID must be at least 3 characters"),
});

type EnrollFormValues = z.infer<typeof enrollFormSchema>;

export default function StudentCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  
  // Fetch courses
  const { data: courses, isLoading: loadingCourses } = useQuery<any[]>({
    queryKey: ["/api/classrooms"],
  });

  // Form for enrolling in a course
  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollFormSchema),
    defaultValues: {
      classId: "",
    },
  });

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (data: EnrollFormValues) => {
      const res = await apiRequest("POST", "/api/student/enroll", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
      setEnrollDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "You have successfully enrolled in the course",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in the course",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: EnrollFormValues) => {
    enrollMutation.mutate(data);
  };

  // Filter courses based on search query and semester filter
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = !searchQuery || 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.classId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSemester = !semesterFilter || 
      (course.semester === semesterFilter.split(' ')[0] && 
       course.year === semesterFilter.split(' ')[1]);
    
    return matchesSearch && matchesSemester;
  });
  
  // Generate semester options for filter
  const semesterOptions = courses 
    ? [...new Set(courses.map(c => `${c.semester} ${c.year}`))]
    : [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>
        <p className="text-slate-500 dark:text-slate-400">View all your enrolled courses and manage them</p>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search courses..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={semesterFilter} onValueChange={setSemesterFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Semesters" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Semesters</SelectItem>
              {semesterOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Enroll in Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enroll in a Course</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter the class ID (e.g. CS-101-F23)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEnrollDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={enrollMutation.isPending}>
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll Now"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Courses */}
      {loadingCourses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <CourseSkeleton key={i} />
          ))}
        </div>
      ) : filteredCourses && filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 mb-4">
              <XCircle className="h-8 w-8 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-center">No Courses Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-4 max-w-md">
              {searchQuery || semesterFilter
                ? "No courses match your search criteria. Try adjusting your filters."
                : "You haven't enrolled in any courses yet. Use the 'Enroll in Course' button to get started."}
            </p>
            {(searchQuery || semesterFilter) ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setSemesterFilter("");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button onClick={() => setEnrollDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Enroll in Course
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Course Card Component
function CourseCard({ course }: { course: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-l-4 border-primary">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">{course.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {course.facultyName || 'No instructor assigned'} • {course.schedule || 'No schedule set'}
            </p>
          </div>
          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-700 px-2 py-1 text-xs font-medium">
            Class ID: {course.classId}
          </Badge>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Course Progress</span>
            <span className="text-xs font-medium">65%</span>
          </div>
          <Progress value={65} className="h-2" />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            <span>{course.semester} {course.year}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>Faculty: ID {course.facultyId || 'None'}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{course.schedule || 'No schedule'}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
            <DoorOpen className="h-3.5 w-3.5 mr-1" />
            <span>Dept: {course.departmentId || 'None'}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 flex justify-between">
        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments" className="text-xs">Assignments</TabsTrigger>
            <TabsTrigger value="materials" className="text-xs">Materials</TabsTrigger>
          </TabsList>
          
          <div className="mt-3">
            <TabsContent value="assignments">
              <Link href={`/student/courses/${course.id}/assignments`}>
                <Button variant="outline" size="sm" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  View Assignments
                </Button>
              </Link>
            </TabsContent>
            
            <TabsContent value="materials">
              <Link href={`/student/courses/${course.id}/materials`}>
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Access Materials
                </Button>
              </Link>
            </TabsContent>
          </div>
        </Tabs>
        
        <div className="flex items-center ml-3">
          <Link href={`/student/courses/${course.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

// Skeleton for loading state
function CourseSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-l-4 border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-36" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}
