import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  BookOpen, 
  FileText, 
  Users, 
  Calendar, 
  FileUp, 
  Megaphone, 
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList
} from "lucide-react";
import { Link } from "wouter";

export default function FacultyClasses() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSemester, setFilterSemester] = useState<string>("");
  
  // Fetch faculty profile
  const { data: profile, isLoading: loadingProfile } = useQuery<any>({
    queryKey: ["/api/user/profile"],
  });
  
  // Fetch classrooms
  const { data: classrooms, isLoading: loadingClassrooms } = useQuery<any[]>({
    queryKey: ["/api/classrooms"],
  });

  // Filter classrooms based on search and semester filter
  const filteredClassrooms = classrooms?.filter(classroom => {
    const matchesSearch = !searchQuery || 
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.classId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      classroom.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSemester = !filterSemester || 
      (classroom.semester === filterSemester.split(' ')[0] && 
       classroom.year === filterSemester.split(' ')[1]);
    
    return matchesSearch && matchesSemester;
  });
  
  // Generate semester options for filter
  const semesterOptions = classrooms 
    ? [...new Set(classrooms.map(c => `${c.semester} ${c.year}`))]
    : [];

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Classes</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage all your assigned classes</p>
      </div>
      
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search classes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterSemester} onValueChange={setFilterSemester}>
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
      </div>
      
      {/* Classes Grid */}
      {loadingClassrooms ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ClassSkeleton key={i} />
          ))}
        </div>
      ) : filteredClassrooms && filteredClassrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom, index) => (
            <ClassCard key={classroom.id} classroom={classroom} index={index} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-slate-100 dark:bg-slate-700 p-3 mb-4">
              <BookOpen className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-center">No Classes Found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
              {searchQuery || filterSemester
                ? "No classes match your search criteria. Try adjusting your filters."
                : "You don't have any classes assigned to you yet."}
            </p>
            {(searchQuery || filterSemester) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("");
                  setFilterSemester("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Class Card Component
function ClassCard({ classroom, index }: { classroom: any, index: number }) {
  // Use different colors for different classrooms
  const colorSchemes = [
    { bg: "bg-primary", text: "text-primary", light: "bg-blue-50 dark:bg-blue-900/20" },
    { bg: "bg-secondary", text: "text-secondary", light: "bg-green-50 dark:bg-green-900/20" },
    { bg: "bg-accent", text: "text-accent", light: "bg-amber-50 dark:bg-amber-900/20" },
    { bg: "bg-purple-500", text: "text-purple-500", light: "bg-purple-50 dark:bg-purple-900/20" },
  ];
  
  const colorScheme = colorSchemes[index % colorSchemes.length];
  
  return (
    <Card className="overflow-hidden">
      <div className={`${colorScheme.bg} p-5 text-white`}>
        <h3 className="text-xl font-bold mb-1">{classroom.name}</h3>
        <div className="flex items-center text-sm opacity-90">
          <span>{classroom.classId}</span>
          <span className="mx-2">•</span>
          <span>{classroom.semester} {classroom.year}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Schedule</h4>
              <p className="font-medium">{classroom.schedule || "No schedule set"}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Description</h4>
              <p>{classroom.description || "No description available"}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`${colorScheme.light} ${colorScheme.text} text-xs font-medium py-1 px-2 rounded-md`}>
                <Badge className={`${colorScheme.bg} mr-2`}>0</Badge>
                Students
              </div>
              
              <div className={`${colorScheme.light} ${colorScheme.text} text-xs font-medium py-1 px-2 rounded-md`}>
                <Badge className={`${colorScheme.bg} mr-2`}>0</Badge>
                Assignments
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="actions" className="grid grid-cols-2 gap-2">
            <ActionButton 
              icon={<FileText className="h-4 w-4" />} 
              label="Assignments"
              href={`/faculty/classes/${classroom.id}/assignments`}
              colorClass={colorScheme.text}
            />
            
            <ActionButton 
              icon={<Users className="h-4 w-4" />} 
              label="Students"
              href={`/faculty/classes/${classroom.id}/students`}
              colorClass={colorScheme.text}
            />
            
            <ActionButton 
              icon={<FileUp className="h-4 w-4" />} 
              label="Materials"
              href={`/faculty/classes/${classroom.id}/materials`}
              colorClass={colorScheme.text}
            />
            
            <ActionButton 
              icon={<Megaphone className="h-4 w-4" />} 
              label="Announcements"
              href={`/faculty/classes/${classroom.id}/announcements`}
              colorClass={colorScheme.text}
            />
            
            <ActionButton 
              icon={<ClipboardList className="h-4 w-4" />} 
              label="Grades"
              href={`/faculty/classes/${classroom.id}/grades`}
              colorClass={colorScheme.text}
            />
            
            <ActionButton 
              icon={<Calendar className="h-4 w-4" />} 
              label="Schedule"
              href={`/faculty/classes/${classroom.id}/schedule`}
              colorClass={colorScheme.text}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4">
        <Button className={`w-full ${colorScheme.bg}`} asChild>
          <Link href={`/faculty/classes/${classroom.id}`}>
            Manage Class <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

// Action Button Component
function ActionButton({ icon, label, href, colorClass }: { icon: React.ReactNode; label: string; href: string; colorClass: string }) {
  return (
    <Button variant="outline" size="sm" className="h-auto py-2 justify-start" asChild>
      <Link href={href}>
        <span className={`mr-1.5 ${colorClass}`}>{icon}</span>
        <span className="text-xs">{label}</span>
      </Link>
    </Button>
  );
}

// Skeleton for loading state
function ClassSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="p-5 bg-slate-200 dark:bg-slate-700">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <CardContent className="p-6">
        <Skeleton className="h-8 w-full mb-4" />
        <div className="space-y-4">
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
