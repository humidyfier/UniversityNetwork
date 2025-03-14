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

// Faculty specific extension to the register schema
const facultyRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  teacherId: z.string().min(3, "Teacher ID must be at least 3 characters"),
  department: z.string().min(2, "Department is required"),
  specialization: z.string().min(2, "Specialization is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FacultyRegisterFormValues = z.infer<typeof facultyRegisterSchema>;

interface FacultyRegisterFormProps {
  registerMutation: UseMutationResult<User, Error, any>;
}

export function FacultyRegisterForm({ registerMutation }: FacultyRegisterFormProps) {
  const form = useForm<FacultyRegisterFormValues>({
    resolver: zodResolver(facultyRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: UserRole.FACULTY,
      firstName: "",
      lastName: "",
      teacherId: "",
      department: "",
      specialization: "",
    },
  });

  const onSubmit = (data: FacultyRegisterFormValues) => {
    // Remove confirmPassword and extra fields as they're not part of the user schema
    const { confirmPassword, teacherId, department, specialization, ...userData } = data;

    // In a real app, you would store teacherId, department, and specialization in a faculty profile
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
                <FormLabel className="text-navy dark:text-sky-blue">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-sky-blue">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-sky-blue">Username</FormLabel>
                <FormControl>
                  <Input placeholder="profsmith" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="teacherId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-sky-blue">Teacher ID</FormLabel>
                <FormControl>
                  <Input placeholder="TCH-123456" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
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
              <FormLabel className="text-navy dark:text-sky-blue">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="smith@university.edu" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-sky-blue">Department</FormLabel>
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
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-sky-blue">Specialization</FormLabel>
                <FormControl>
                  <Input placeholder="Machine Learning" {...field} className="border-sky-blue dark:border-teal/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Hidden role field */}
        <input type="hidden" {...form.register("role")} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
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
            control={form.control}
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
          className="w-full bg-navy hover:bg-teal dark:bg-sky-blue dark:text-navy font-semibold dark:hover:bg-white"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register as Faculty"}
        </Button>
      </form>
    </Form>
  );
}