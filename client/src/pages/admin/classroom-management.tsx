import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { insertClassroomSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, PlusCircle, DoorOpen, Eye, Pencil, Trash, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

// Create schema for adding a classroom
const classroomFormSchema = z.object({
  classId: z.string().min(3, "Class ID must be at least 3 characters"),
  name: z.string().min(3, "Class name must be at least 3 characters"),
  departmentId: z.string(),
  facultyId: z.string().optional(),
  semester: z.string().min(1, "Semester is required"),
  year: z.string().min(1, "Year is required"),
  description: z.string().optional(),
  schedule: z.string().optional(),
});

type ClassroomFormValues = z.infer<typeof classroomFormSchema>;

export default function ClassroomManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Fetch classrooms
  const { data: classrooms, isLoading: loadingClassrooms } = useQuery<any[]>({
    queryKey: ["/api/classrooms"],
  });

  // Fetch departments for dropdown
  const { data: departments, isLoading: loadingDepartments } = useQuery<any[]>({
    queryKey: ["/api/departments"],
  });

  // Fetch faculty for dropdown
  const { data: faculty, isLoading: loadingFaculty } = useQuery<any[]>({
    queryKey: ["/api/faculty"],
  });

  // Form for adding new classroom
  const form = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomFormSchema),
    defaultValues: {
      classId: "",
      name: "",
      departmentId: "",
      facultyId: "",
      semester: "",
      year: new Date().getFullYear().toString(),
      description: "",
      schedule: "",
    },
  });

  // Filter classrooms based on search query
  const filteredClassrooms = searchQuery && classrooms 
    ? classrooms.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classrooms;

  // Create classroom mutation
  const createClassroomMutation = useMutation({
    mutationFn: async (data: ClassroomFormValues) => {
      const classroomData = {
        ...data,
        departmentId: parseInt(data.departmentId),
        facultyId: data.facultyId ? parseInt(data.facultyId) : undefined,
      };

      const res = await apiRequest("POST", "/api/classrooms", classroomData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/classrooms"] });
      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Classroom has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create classroom",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: ClassroomFormValues) => {
    createClassroomMutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Classroom Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Create and manage classroom groups</p>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search classrooms..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Classroom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Classroom</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class ID</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. CS-101-F23" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Introduction to Programming" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingDepartments ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : departments && departments.length > 0 ? (
                            departments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id.toString()}>
                                {dept.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No departments available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="facultyId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Faculty</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select faculty member" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None (Assign Later)</SelectItem>
                          {loadingFaculty ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : faculty && faculty.length > 0 ? (
                            faculty.map((f) => (
                              <SelectItem key={f.id} value={f.id.toString()}>
                                {f.user.firstName} {f.user.lastName} - {f.title}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No faculty members available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="semester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Semester</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Fall">Fall</SelectItem>
                            <SelectItem value="Spring">Spring</SelectItem>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the class" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. MWF 10:00-11:30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createClassroomMutation.isPending}>
                    {createClassroomMutation.isPending ? "Creating..." : "Create Classroom"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classrooms List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Classrooms</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingClassrooms ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center p-4 border-b">
                  <Skeleton className="h-10 w-10 rounded-md mr-4" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          ) : filteredClassrooms && filteredClassrooms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassrooms.map((classroom) => {
                  const department = departments?.find(d => d.id === classroom.departmentId);
                  const assignedFaculty = faculty?.find(f => f.id === classroom.facultyId);
                  
                  return (
                    <TableRow key={classroom.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-5 w-5 text-primary" />
                          <span>{classroom.classId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{classroom.name}</TableCell>
                      <TableCell>{department ? department.name : 'Unassigned'}</TableCell>
                      <TableCell>
                        {assignedFaculty 
                          ? `${assignedFaculty.user.firstName} ${assignedFaculty.user.lastName}` 
                          : <Badge variant="outline" className="text-amber-600 bg-amber-50 dark:bg-amber-900/20">Unassigned</Badge>
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-slate-700 text-primary">
                          {classroom.semester} {classroom.year}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/admin/classrooms/${classroom.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="text-destructive">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <div className="flex justify-center mb-4">
                <XCircle className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
                No classrooms found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchQuery 
                  ? `No classrooms match "${searchQuery}"`
                  : "There are no classrooms in the system yet."}
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Classroom
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
