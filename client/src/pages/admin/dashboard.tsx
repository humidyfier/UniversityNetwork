import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Classroom, Department, StudentProfile, FacultyProfile } from "@shared/schema";
import { 
  User,
  UserCircle,
  DoorOpen,
  Building2,
  PlusCircle,
  ArrowRight
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { user } = useAuth();
  
  // Fetch stats
  const { data: students, isLoading: loadingStudents } = useQuery<(StudentProfile & { user: any })[]>({
    queryKey: ["/api/students"],
  });
  
  const { data: faculty, isLoading: loadingFaculty } = useQuery<(FacultyProfile & { user: any })[]>({
    queryKey: ["/api/faculty"],
  });
  
  const { data: classrooms, isLoading: loadingClassrooms } = useQuery<Classroom[]>({
    queryKey: ["/api/classrooms"],
  });
  
  const { data: departments, isLoading: loadingDepartments } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });
  
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage university resources and users</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={students?.length ?? 0}
          isLoading={loadingStudents}
          icon={<User className="text-primary text-xl" />}
          change={{ type: "increase", value: "12%" }}
          bgColor="bg-blue-100 dark:bg-slate-700"
        />
        
        <StatCard
          title="Faculty Members"
          value={faculty?.length ?? 0}
          isLoading={loadingFaculty}
          icon={<UserCircle className="text-secondary text-xl" />}
          change={{ type: "increase", value: "5%" }}
          bgColor="bg-green-100 dark:bg-slate-700"
        />
        
        <StatCard
          title="Active Classrooms"
          value={classrooms?.length ?? 0}
          isLoading={loadingClassrooms}
          icon={<DoorOpen className="text-accent text-xl" />}
          change={{ type: "increase", value: "3%" }}
          bgColor="bg-amber-100 dark:bg-slate-700"
        />
        
        <StatCard
          title="Departments"
          value={departments?.length ?? 0}
          isLoading={loadingDepartments}
          icon={<Building2 className="text-purple-500 text-xl" />}
          change={{ type: "neutral", value: "All operating" }}
          bgColor="bg-purple-100 dark:bg-slate-700"
        />
      </div>
      
      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={<DoorOpen className="text-primary" />}
            title="Create Classroom"
            description="Generate new class IDs"
            bgColor="bg-blue-100 dark:bg-slate-700"
            linkTo="/admin/classrooms/new"
          />
          
          <QuickActionButton
            icon={<UserCircle className="text-secondary" />}
            title="Add Faculty"
            description="Register new professors"
            bgColor="bg-green-100 dark:bg-slate-700"
            linkTo="/admin/faculty/new"
          />
          
          <QuickActionButton
            icon={<Building2 className="text-accent" />}
            title="Manage Departments"
            description="Configure departments"
            bgColor="bg-amber-100 dark:bg-slate-700"
            linkTo="/admin/departments"
          />
          
          <QuickActionButton
            icon={<BarChart3 className="text-purple-500" />}
            title="Advanced Analytics"
            description="View detailed insights"
            bgColor="bg-purple-100 dark:bg-slate-700"
            linkTo="/admin/analytics"
          />
        </div>
      </div>
      
      {/* Recent Activity & Classroom Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {loadingFaculty || loadingClassrooms ? (
              <div className="space-y-4">
                <ActivitySkeleton />
                <ActivitySkeleton />
                <ActivitySkeleton />
              </div>
            ) : (
              <div className="space-y-5">
                {faculty && faculty.length > 0 && (
                  <ActivityItem
                    icon={<UserCircle className="text-primary" />}
                    title="New Faculty Member Added"
                    description={`${faculty[0].user.firstName} ${faculty[0].user.lastName} was added to the system`}
                    timeAgo="2 hours ago"
                    iconBg="bg-blue-100 dark:bg-slate-700"
                  />
                )}
                
                {classrooms && classrooms.length > 0 && (
                  <ActivityItem
                    icon={<DoorOpen className="text-secondary" />}
                    title="New Classroom Created"
                    description={`Classroom ${classrooms[0].classId} was created`}
                    timeAgo="3 hours ago"
                    iconBg="bg-green-100 dark:bg-slate-700"
                  />
                )}
                
                {students && students.length > 0 && (
                  <ActivityItem
                    icon={<User className="text-accent" />}
                    title="New Student Registered"
                    description={`${students[0].user.firstName} ${students[0].user.lastName} registered with the system`}
                    timeAgo="Yesterday"
                    iconBg="bg-amber-100 dark:bg-slate-700"
                  />
                )}
              </div>
            )}
            <Button variant="ghost" className="w-full mt-5 py-2 text-sm text-primary font-medium">
              View All Activity
            </Button>
          </CardContent>
        </Card>
        
        {/* Classroom Management */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Classroom Management</CardTitle>
            <Button variant="link" className="text-primary text-sm p-0">
              <Link href="/admin/classrooms/new">Create New</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Faculty</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {loadingClassrooms ? (
                    <>
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                      <TableRowSkeleton />
                    </>
                  ) : (
                    classrooms?.slice(0, 3).map((classroom) => (
                      <tr key={classroom.id}>
                        <td className="py-3 text-sm font-medium text-slate-900 dark:text-white">{classroom.classId}</td>
                        <td className="py-3 text-sm text-slate-500 dark:text-slate-400">{classroom.name}</td>
                        <td className="py-3 text-sm text-slate-500 dark:text-slate-400">
                          {classroom.facultyId ? `ID: ${classroom.facultyId}` : "Unassigned"}
                        </td>
                        <td className="py-3 text-sm">
                          <Button variant="link" className="text-primary p-0">
                            <Link href={`/admin/classrooms/${classroom.id}`}>Manage</Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Button variant="ghost" className="w-full mt-5 py-2 text-sm text-primary font-medium">
              <Link href="/admin/classrooms">View All Classrooms</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  isLoading: boolean;
  icon: React.ReactNode;
  change: { type: 'increase' | 'decrease' | 'neutral'; value: string };
  bgColor: string;
}

function StatCard({ title, value, isLoading, icon, change, bgColor }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-bold mt-1">{value}</div>
            )}
          </div>
          <div className={`${bgColor} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
        <div className={`mt-3 text-xs font-medium ${
          change.type === 'increase' ? 'text-green-500' : 
          change.type === 'decrease' ? 'text-red-500' : 
          'text-slate-500 dark:text-slate-400'
        }`}>
          {change.type === 'increase' && <ArrowRight className="inline h-3 w-3 rotate-45" />}
          {change.type === 'decrease' && <ArrowRight className="inline h-3 w-3 -rotate-45" />}
          {change.value}
        </div>
      </CardContent>
    </Card>
  );
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  linkTo: string;
}

function QuickActionButton({ icon, title, description, bgColor, linkTo }: QuickActionButtonProps) {
  return (
    <Link href={linkTo}>
      <Button variant="outline" className="w-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow p-5 transition flex items-center justify-start h-auto">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center mr-3`}>
          {icon}
        </div>
        <div className="text-left">
          <div className="font-medium text-slate-900 dark:text-white">{title}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
        </div>
      </Button>
    </Link>
  );
}

interface ActivityItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  timeAgo: string;
}

function ActivityItem({ icon, iconBg, title, description, timeAgo }: ActivityItemProps) {
  return (
    <div className="flex items-start">
      <div className={`w-9 h-9 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
        {icon}
      </div>
      <div>
        <div className="font-medium text-slate-900 dark:text-white">{title}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">{description}</div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo}</div>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="flex items-start">
      <Skeleton className="w-9 h-9 rounded-full mr-3" />
      <div className="flex-1">
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-2 w-1/4" />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr>
      <td className="py-3"><Skeleton className="h-4 w-16" /></td>
      <td className="py-3"><Skeleton className="h-4 w-24" /></td>
      <td className="py-3"><Skeleton className="h-4 w-20" /></td>
      <td className="py-3"><Skeleton className="h-4 w-12" /></td>
    </tr>
  );
}
