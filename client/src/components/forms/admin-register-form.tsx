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
import { UseMutationResult } from "@tanstack/react-query";
import { User } from "@shared/schema";

// Admin specific extension to the register schema
const adminRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  adminCode: z.string().min(6, "Admin code must be at least 6 characters"),
  adminType: z.string().min(2, "Admin type is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;

interface AdminRegisterFormProps {
  registerMutation: UseMutationResult<User, Error, any>;
}

export function AdminRegisterForm({ registerMutation }: AdminRegisterFormProps) {
  const form = useForm<AdminRegisterFormValues>({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: UserRole.ADMIN,
      firstName: "",
      lastName: "",
      adminCode: "",
      adminType: "",
    },
  });

  const onSubmit = (data: AdminRegisterFormValues) => {
    // Remove confirmPassword and extra fields as they're not part of the user schema
    const { confirmPassword, adminCode, adminType, ...userData } = data;

    // In a real app, you could verify the admin code before registration
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
                <FormLabel className="text-navy dark:text-beige">First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Admin" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-beige">Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="User" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-beige">Username</FormLabel>
                <FormControl>
                  <Input placeholder="admin_user" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-beige">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="admin@university.edu" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="adminCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-beige">Admin Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter admin registration code" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adminType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-navy dark:text-beige">Admin Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. System, Department, IT" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-beige">Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
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
                <FormLabel className="text-navy dark:text-beige">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} className="border-navy dark:border-beige/70 dark:bg-[#1e2c3d] dark:text-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button
          type="submit"
          className="w-full bg-navy hover:bg-beige hover:text-navy dark:bg-beige dark:text-navy dark:hover:bg-white font-semibold"
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? "Registering..." : "Register as Admin"}
        </Button>
      </form>
    </Form>
  );
}