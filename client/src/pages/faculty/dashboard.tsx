import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Classroom } from "@shared/schema";
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  FileUp,
  LayoutDashboard,
  Users,
  Eye
} from "lucide-react";
import { Link } from "wouter";

export default function FacultyDashboard() {
  const { user } = useAuth();
  
  // Fetch faculty profile
  const { data: profile, isLoading: loadingProfile } = useQuery<any>({
    queryKey: ["/api/user/profile"],
  });
  
  // Fetch classrooms
  const { data: classrooms, isLoading: loadingClassrooms } = useQuery<Classroom[]>({
    queryKey: ["/api/classrooms"],
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Faculty Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your classes and teaching resources</p>
      </div>
      
      {/* Quick Access to Classes */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">My Classes</h2>
        {loadingClassrooms ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <ClassSkeleton key={i} />
            ))}
          </div>
        ) : classrooms && classrooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {classrooms.map((classroom, index) => {
              // Use different colors for different classrooms
              const colorClasses = [
                "bg-primary text-white",
                "bg-secondary text-white",
                "bg-accent text-white"
              ];
              
              // Cycle through the colors
              const colorClass = colorClasses[index % colorClasses.length];
              
              return (
                <Card key={classroom.id} className="overflow-hidden">
                  <div className={`p-4 ${colorClass}`}>
                    <h3 className="font-bold">{classroom.name}</h3>
                    <p className="text-sm opacity-80">{classroom.semester} {classroom.year} • {classroom.schedule || 'No schedule set'}</p>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Class ID</div>
                      <div className="font-medium">{classroom.classId}</div>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400">Students</div>
                      <div className="font-medium">
                        <Badge variant="outline" className="bg-blue-50 dark:bg-slate-700 text-primary">
                          Loading...
                        </Badge>
                      </div>
                    </div>
                    <Link href={`/faculty/classes/${classroom.id}`}>
                      <Button 
                        variant="default" 
                        className="w-full"
                        style={{ 
                          backgroundColor: colorClass.includes("bg-primary") ? "var(--primary)" : 
                                          colorClass.includes("bg-secondary") ? "var(--secondary)" : 
                                          "var(--accent)" 
                        }}
                      >
                        Manage Class
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 mb-4">
                <LayoutDashboard className="h-6 w-6 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2 text-center">No Classes Assigned</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                You don't have any classes assigned to you yet.
              </p>
              <Button variant="outline" asChild>
                <Link href="/faculty/classes">View All Classes</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Teaching Tools */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Teaching Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/faculty/assignments">
            <TeachingToolCard
              icon={<BookOpen className="text-2xl text-primary" />}
              title="Create Assignment"
              description="Add new homework or projects"
            />
          </Link>
          
          <Link href="/faculty/submissions">
            <TeachingToolCard
              icon={<FileText className="text-2xl text-secondary" />}
              title="Grade Submissions"
              description="Review and score student work"
            />
          </Link>
          
          <Link href="/faculty/timetables">
            <TeachingToolCard
              icon={<Calendar className="text-2xl text-accent" />}
              title="Update Timetable"
              description="Modify class schedule"
            />
          </Link>
          
          <Link href="/faculty/materials">
            <TeachingToolCard
              icon={<FileUp className="text-2xl text-purple-500" />}
              title="Upload Materials"
              description="Share lecture notes and resources"
            />
          </Link>
        </div>
      </div>
      
      {/* Recent Submissions & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Submissions */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-base font-medium">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-4">
              {loadingClassrooms ? (
                <>
                  <SubmissionSkeleton />
                  <SubmissionSkeleton />
                  <SubmissionSkeleton />
                </>
              ) : classrooms && classrooms.length > 0 ? (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-base font-medium mb-1">No recent submissions</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Students haven't submitted any assignments recently.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <Users className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-base font-medium mb-1">No classes assigned</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    You need to be assigned to classes to view submissions.
                  </p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-5 py-2 text-sm text-primary font-medium" asChild>
              <Link href="/faculty/submissions">View All Submissions</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Class Announcements */}
        <Card>
          <CardHeader className="pb-2 border-b border-slate-200 dark:border-slate-700 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">Class Announcements</CardTitle>
            <Button variant="link" className="text-primary text-sm p-0" asChild>
              <Link href="/faculty/announcements/new">New Announcement</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-6">
              {loadingClassrooms ? (
                <>
                  <AnnouncementSkeleton />
                  <AnnouncementSkeleton />
                </>
              ) : classrooms && classrooms.length > 0 ? (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <FileText className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-base font-medium mb-1">No announcements</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    You haven't created any announcements yet.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/faculty/announcements/new">Create Announcement</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-4">
                    <Users className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-base font-medium mb-1">No classes assigned</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    You need to be assigned to classes to create announcements.
                  </p>
                </div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-5 py-2 text-sm text-primary font-medium" asChild>
              <Link href="/faculty/announcements">View All Announcements</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface TeachingToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TeachingToolCard({ icon, title, description }: TeachingToolCardProps) {
  return (
    <Button variant="outline" className="h-auto bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg shadow p-5 transition text-left flex flex-col items-start">
      <div className="flex items-center mb-3">
        {icon}
        <span className="font-medium text-slate-900 dark:text-white ml-3">{title}</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </Button>
  );
}

function ClassSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 bg-slate-200 dark:bg-slate-700">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

function SubmissionSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
      <div className="flex items-center">
        <Skeleton className="w-9 h-9 rounded-full mr-3" />
        <div>
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-3 w-48" />
        </div>
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

function AnnouncementSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
