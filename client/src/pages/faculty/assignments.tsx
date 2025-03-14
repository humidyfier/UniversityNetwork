import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Search, FileText, PlusCircle, Eye, FileUp, Clock, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "wouter";

// Create schema for assignment creation
const assignmentFormSchema = z.object({
  classroomId: z.string().min(1, "Classroom is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  totalMarks: z.string().min(1, "Total marks is required"),
  weightage: z.string().min(1, "Weightage is required"),
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export default function FacultyAssignments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Fetch classrooms
  const { data: classrooms, isLoading: loadingClassrooms } = useQuery<any[]>({
    queryKey: ["/api/classrooms"],
  });

  // Combined query to fetch all assignments from all classrooms
  const { data: assignments, isLoading: loadingAssignments } = useQuery<any[]>({
    queryKey: ["/api/faculty/assignments"],
    enabled: !!classrooms && classrooms.length > 0,
    queryFn: async () => {
      if (!classrooms || classrooms.length === 0) return [];
      
      // For each classroom, fetch its assignments
      const assignmentPromises = classrooms.map(classroom => 
        fetch(`/api/classrooms/${classroom.id}/assignments`)
          .then(res => res.ok ? res.json() : [])
          .then(assignments => assignments.map((a: any) => ({
            ...a,
            classroomName: classroom.name,
            classroomId: classroom.id
          })))
      );
      
      const assignmentsArrays = await Promise.all(assignmentPromises);
      return assignmentsArrays.flat();
    }
  });

  // Form for adding new assignment
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      classroomId: "",
      title: "",
      description: "",
      totalMarks: "100",
      weightage: "10",
    },
  });

  // Filter assignments based on search query
  const filteredAssignments = searchQuery && assignments 
    ? assignments.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.classroomName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : assignments;

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: async (data: AssignmentFormValues) => {
      const assignmentData = {
        ...data,
        classroomId: parseInt(data.classroomId),
        totalMarks: parseInt(data.totalMarks),
        weightage: parseInt(data.weightage),
      };

      const res = await apiRequest("POST", `/api/classrooms/${data.classroomId}/assignments`, assignmentData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faculty/assignments"] });
      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Assignment has been created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create assignment",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: AssignmentFormValues) => {
    createAssignmentMutation.mutate(data);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Assignments</h1>
        <p className="text-slate-500 dark:text-slate-400">Create and manage assignments for your classes</p>
      </div>
      
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search assignments..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="classroomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classroom</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select classroom" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingClassrooms ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : classrooms && classrooms.length > 0 ? (
                            classrooms.map((classroom) => (
                              <SelectItem key={classroom.id} value={classroom.id.toString()}>
                                {classroom.name} ({classroom.classId})
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>No classrooms available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Midterm Project" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the assignment requirements"
                          className="resize-none min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={`pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="totalMarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weightage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weightage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createAssignmentMutation.isPending}>
                    {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAssignments || loadingClassrooms ? (
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
          ) : filteredAssignments && filteredAssignments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Weightage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => {
                  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;
                  
                  // Check if assignment is overdue
                  const isOverdue = dueDate && dueDate < new Date();
                  
                  // Check if assignment is due soon (within 7 days)
                  const isDueSoon = dueDate && !isOverdue && 
                    dueDate.getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
                  
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>{assignment.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{assignment.classroomName}</TableCell>
                      <TableCell>
                        {dueDate ? (
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={isOverdue ? "destructive" : isDueSoon ? "outline" : "secondary"}
                              className={isDueSoon && !isOverdue ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" : ""}
                            >
                              {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Upcoming"}
                            </Badge>
                            <span className="text-xs ml-1">{format(dueDate, "MMM d, yyyy")}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>{assignment.totalMarks || 0}</TableCell>
                      <TableCell>{assignment.weightage || 0}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/faculty/assignments/${assignment.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="icon" variant="ghost" asChild>
                            <Link href={`/faculty/assignments/${assignment.id}/submissions`}>
                              <FileUp className="h-4 w-4" />
                            </Link>
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
                No assignments found
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                {searchQuery 
                  ? `No assignments match "${searchQuery}"`
                  : classrooms && classrooms.length > 0 
                    ? "You haven't created any assignments yet."
                    : "You need to be assigned to classes before creating assignments."}
              </p>
              {classrooms && classrooms.length > 0 && (
                <Button onClick={() => setAddDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
