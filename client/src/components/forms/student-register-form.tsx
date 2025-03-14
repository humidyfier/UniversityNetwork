import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema, UserRole } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@shared/schema";

// Student specific extension to the register schema
const studentRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  studentId: z.string().min(3, "Student ID must be at least 3 characters"),
  year: z.string().min(1, "Year is required"),
  department: z.string().min(2, "Department is required"),
  classIds: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type StudentRegisterFormValues = z.infer<typeof studentRegisterSchema>;

interface StudentRegisterFormProps {
  registerMutation: UseMutationResult<User, Error, any>;
}

export function StudentRegisterForm({ registerMutation }: StudentRegisterFormProps) {
  const form = useForm<StudentRegisterFormValues>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: UserRole.STUDENT,
      firstName: "",
      lastName: "",
      studentId: "",
      year: "",
      department: "",
      classIds: "",
    },
  });

  const onSubmit = (data: StudentRegisterFormValues) => {
    // Remove confirmPassword and extra fields as they're not part of the user schema
    const { confirmPassword, studentId, year, department, classIds, ...userData } = data;

    // In a real app, you would store studentId, year, department, classIds in a student profile
    // For now, we'll just use the base user registration
    registerMutation.mutate(userData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smith" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Username</FormLabel>
                <FormControl>
                  <Input placeholder="jsmith2024" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Student ID</FormLabel>
                <FormControl>
                  <Input placeholder="STD-123456" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-navy dark:text-teal">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jsmith@university.edu" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Department</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-[#263549] dark:border-teal/70">
                    <SelectItem value="computer_science">Computer Science</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="humanities">Humanities</SelectItem>
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
                <FormLabel className="text-navy dark:text-teal">Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="dark:bg-[#263549] dark:border-teal/70">
                    <SelectItem value="1">First Year</SelectItem>
                    <SelectItem value="2">Second Year</SelectItem>
                    <SelectItem value="3">Third Year</SelectItem>
                    <SelectItem value="4">Fourth Year</SelectItem>
                    <SelectItem value="5">Fifth Year</SelectItem>
                    <SelectItem value="graduate">Graduate</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="classIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-navy dark:text-teal">Class ID(s)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter class ID(s) to enroll (comma separated)" 
                  {...field} 
                  className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Hidden role field */}
        <input type="hidden" {...form.register("role")} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-teal">Confirm Password</FormLabel>
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
          className="w-full bg-navy hover:bg-teal dark:bg-teal dark:text-navy dark:hover:bg-white dark:hover:text-teal font-semibold"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register as Student"}
        </Button>
      </form>
    </Form>
  );
}