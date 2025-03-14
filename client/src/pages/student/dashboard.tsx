import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BookOpen, 
  FileText, 
  Trophy, 
  Users,
  User,
  Calendar,
  ArrowRight,
  Medal,
  Clock
} from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // Fetch student profile
  const { data: profile, isLoading: loadingProfile } = useQuery<any>({
    queryKey: ["/api/user/profile"],
  });
  
  // Fetch courses (classrooms)
  const { data: courses, isLoading: loadingCourses } = useQuery<any[]>({
    queryKey: ["/api/classrooms"],
  });

  // Fetch achievements
  const { data: achievements, isLoading: loadingAchievements } = useQuery<any[]>({
    queryKey: ["/api/student/achievements"],
  });

  // Fetch people you follow
  const { data: following, isLoading: loadingFollowing } = useQuery<any[]>({
    queryKey: ["/api/student/following"],
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your courses, assignments and achievements</p>
      </div>
      
      {/* Profile Overview */}
      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700">
              {loadingProfile ? (
                <>
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-6 w-32 mb-1" />
                  <Skeleton className="h-4 w-48 mb-4" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </>
              ) : profile ? (
                <>
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src={user?.profilePicture} alt={`${user?.firstName} ${user?.lastName}`} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-1">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {profile.departmentName || 'No Department'} • Year {profile.year}
                  </p>
                  <div className="flex space-x-2">
                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900/30 text-primary">
                      ID: {profile.studentId}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-secondary">
                      GPA: {profile.gpa || '0.0'}
                    </Badge>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p>Profile not found</p>
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Achievement Points</h4>
                {loadingProfile ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </>
                ) : profile ? (
                  <>
                    <div className="flex items-center mb-2">
                      <Progress 
                        value={(profile.achievementPoints || 0) / 10} 
                        className="h-4 flex-1 mr-2" 
                      />
                      <span className="text-sm font-medium">{profile.achievementPoints || 0}/1000</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Earn {1000 - (profile.achievementPoints || 0)} more points to reach Gold Status
                    </p>
                  </>
                ) : (
                  <p>Achievement data not available</p>
                )}
              </div>
              
              <div>
                <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Latest Achievements</h4>
                {loadingAchievements ? (
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-40" />
                  </div>
                ) : achievements && achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-full px-4 py-2">
                        <Trophy className="text-accent mr-2 h-4 w-4" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {achievement.title}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      You haven't earned any achievements yet
                    </p>
                    <Button variant="link" size="sm" asChild>
                      <Link href="/student/achievements">Add Achievement</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* My Courses & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* My Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Courses</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/student/courses">View All</Link>
            </Button>
          </div>
          
          {loadingCourses ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <CourseSkeleton key={i} />
              ))}
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="space-y-4">
              {courses.slice(0, 2).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium mb-2 text-center">No Courses Found</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                  You haven't enrolled in any courses yet.
                </p>
                <Button>Enroll in a Course</Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Upcoming Assignments */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Upcoming Assignments</h2>
          </div>
          
          <Card>
            <CardContent className="p-5">
              {loadingCourses ? (
                <div className="space-y-5">
                  {[...Array(3)].map((_, i) => (
                    <AssignmentSkeleton key={i} />
                  ))}
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="text-center py-6">
                  <Clock className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-medium mb-1">No Upcoming Assignments</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    You don't have any assignments due soon.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-medium mb-1">No Courses Enrolled</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Enroll in courses to see assignments.
                  </p>
                </div>
              )}
              <Button variant="ghost" className="w-full mt-4 py-2 text-sm text-primary font-medium" asChild>
                <Link href="/student/assignments">View All Assignments</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Community & Following */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">People You Follow</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/student/following">View All</Link>
          </Button>
        </div>
        
        {loadingFollowing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <FollowingSkeleton key={i} />
            ))}
          </div>
        ) : following && following.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {following.map((person) => (
              <Card key={person.id} className="p-4 flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarImage src={person.user?.profilePicture} alt={`${person.user?.firstName} ${person.user?.lastName}`} />
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-600 text-lg">
                    {person.user?.firstName?.charAt(0)}{person.user?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">{person.user?.firstName} {person.user?.lastName}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  {person.departmentName || 'No Department'} • Year {person.year}
                </p>
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Trophy className="mr-1 h-3 w-3 text-accent" /> 
                  {person.achievementPoints || 0} Achievement Points
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-center">Not Following Anyone</h3>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                Find and follow other students from your university.
              </p>
              <div className="w-full max-w-sm">
                <div className="relative mb-4">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                  <Input placeholder="Search students..." className="pl-8" />
                </div>
                <Button className="w-full">Find Students</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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
        <div className="mt-4 flex items-center">
          <span className="text-xs font-medium mr-4">Progress:</span>
          <Progress value={65} className="h-2 flex-1 mr-2" />
          <span className="text-xs font-medium">65%</span>
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 flex justify-between">
        <div className="flex space-x-4">
          <Link href={`/student/courses/${course.id}/assignments`}>
            <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline flex items-center">
              <FileText className="mr-1 h-4 w-4" /> Assignments
            </Button>
          </Link>
          <Link href={`/student/courses/${course.id}/materials`}>
            <Button variant="link" className="p-0 h-auto text-sm text-primary hover:underline flex items-center">
              <BookOpen className="mr-1 h-4 w-4" /> Materials
            </Button>
          </Link>
        </div>
        <Link href={`/student/courses/${course.id}`}>
          <Button variant="ghost" size="icon" className="h-auto p-1">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

// Skeletons
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
        <div className="mt-4 flex items-center">
          <Skeleton className="h-4 w-16 mr-4" />
          <Skeleton className="h-2 flex-1 mr-2" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
      <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

function AssignmentSkeleton() {
  return (
    <div className="pb-4 border-b border-slate-200 dark:border-slate-700">
      <div className="flex justify-between mb-1">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>
      <Skeleton className="h-4 w-48 mb-2" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

function FollowingSkeleton() {
  return (
    <Card className="p-4 flex flex-col items-center">
      <Skeleton className="w-16 h-16 rounded-full mb-3" />
      <Skeleton className="h-5 w-32 mb-1" />
      <Skeleton className="h-4 w-40 mb-3" />
      <Skeleton className="h-4 w-24" />
    </Card>
  );
}
