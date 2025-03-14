import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { insertAchievementSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Trophy, 
  PlusCircle, 
  Medal, 
  Award, 
  Star, 
  Calendar, 
  Trash,
  CalendarDays,
  BarChart3,
  BadgeCheck
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Create achievement schema
const achievementFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  points: z.string().min(1, "Points value is required"),
  type: z.string().min(1, "Achievement type is required"),
});

type AchievementFormValues = z.infer<typeof achievementFormSchema>;

export default function StudentAchievements() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Fetch student profile
  const { data: profile, isLoading: loadingProfile } = useQuery<any>({
    queryKey: ["/api/user/profile"],
  });
  
  // Fetch achievements
  const { data: achievements, isLoading: loadingAchievements } = useQuery<any[]>({
    queryKey: ["/api/student/achievements"],
  });

  // Form for adding achievement
  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      points: "10",
      type: "academic",
    },
  });

  // Add achievement mutation
  const addAchievementMutation = useMutation({
    mutationFn: async (data: AchievementFormValues) => {
      const achievementData = {
        title: data.title,
        description: data.description,
        points: parseInt(data.points),
      };

      const res = await apiRequest("POST", "/api/student/achievements", achievementData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/achievements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setAddDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Your achievement has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add achievement",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: AchievementFormValues) => {
    addAchievementMutation.mutate(data);
  };

  // Calculate achievement stats
  const totalAchievements = achievements?.length || 0;
  const totalPoints = achievements?.reduce((sum, a) => sum + a.points, 0) || 0;
  const recentAchievements = achievements
    ? [...achievements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
    : [];

  // Achievement type icons
  const achievementIcons: Record<string, React.ReactNode> = {
    academic: <Award className="h-5 w-5 text-blue-500" />,
    sports: <Trophy className="h-5 w-5 text-amber-500" />,
    leadership: <Star className="h-5 w-5 text-purple-500" />,
    community: <BadgeCheck className="h-5 w-5 text-green-500" />,
    other: <Medal className="h-5 w-5 text-slate-500" />,
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Achievements</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and showcase your academic and extracurricular accomplishments</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 md:mt-0 gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Achievement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achievement Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Dean's List" {...field} />
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
                          placeholder="Describe your achievement" 
                          className="resize-none min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about what you accomplished and why it's significant.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="points"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Points Value</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Suggested: 10-25 for minor, 25-50 for major achievements.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achievement Type</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="academic">Academic</SelectItem>
                            <SelectItem value="sports">Sports</SelectItem>
                            <SelectItem value="leadership">Leadership</SelectItem>
                            <SelectItem value="community">Community Service</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addAchievementMutation.isPending}>
                    {addAchievementMutation.isPending ? "Adding..." : "Add Achievement"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Achievement Progress */}
      <Card className="mb-8">
        <CardContent className="p-6">
          {loadingProfile ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-6 w-32 mb-2" />
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-3">Achievement Progress</h2>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Points Earned: {profile?.achievementPoints || 0}/1000</span>
                  <span className="text-sm font-medium">{Math.floor((profile?.achievementPoints || 0) / 10)}%</span>
                </div>
                <Progress 
                  value={(profile?.achievementPoints || 0) / 10} 
                  className="h-2" 
                />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <StatCard 
                  icon={<Trophy className="h-5 w-5 text-amber-500" />} 
                  title="Achievements" 
                  value={totalAchievements.toString()} 
                />
                
                <StatCard 
                  icon={<Medal className="h-5 w-5 text-blue-500" />} 
                  title="Total Points" 
                  value={totalPoints.toString()} 
                />
                
                <StatCard 
                  icon={<Star className="h-5 w-5 text-purple-500" />} 
                  title="Current Level" 
                  value={getLevel(profile?.achievementPoints || 0)} 
                />
                
                <StatCard 
                  icon={<Award className="h-5 w-5 text-green-500" />} 
                  title="Next Level" 
                  value={`${getNextLevelPoints(profile?.achievementPoints || 0)} more points`} 
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Achievement Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Achievements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Achievements</CardTitle>
              <CardDescription>
                A record of all your accomplishments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAchievements ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <AchievementSkeleton key={i} />
                  ))}
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-start p-4 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
                      <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-full mr-4">
                        {achievementIcons[achievement.type] || <Trophy className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <Badge className="bg-primary/10 text-primary">
                            +{achievement.points} points
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 mb-2">
                          {achievement.description}
                        </p>
                        <div className="flex items-center text-xs text-slate-500">
                          <CalendarDays className="mr-1 h-3 w-3" />
                          <span>
                            {new Date(achievement.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    Start adding your academic and extracurricular achievements to build your profile.
                  </p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Your First Achievement
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Achievement Leaderboard */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Achievement Types</CardTitle>
              <CardDescription>
                Categorization of your achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAchievements ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="space-y-4">
                  <AchievementTypeCard 
                    type="academic" 
                    label="Academic" 
                    achievements={achievements} 
                    icon={<Award className="h-5 w-5 text-blue-500" />} 
                  />
                  
                  <AchievementTypeCard 
                    type="sports" 
                    label="Sports" 
                    achievements={achievements} 
                    icon={<Trophy className="h-5 w-5 text-amber-500" />} 
                  />
                  
                  <AchievementTypeCard 
                    type="leadership" 
                    label="Leadership" 
                    achievements={achievements} 
                    icon={<Star className="h-5 w-5 text-purple-500" />} 
                  />
                  
                  <AchievementTypeCard 
                    type="community" 
                    label="Community Service" 
                    achievements={achievements} 
                    icon={<BadgeCheck className="h-5 w-5 text-green-500" />} 
                  />
                  
                  <AchievementTypeCard 
                    type="other" 
                    label="Other" 
                    achievements={achievements} 
                    icon={<Medal className="h-5 w-5 text-slate-500" />} 
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No achievement data to display yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper functions for achievement levels
function getLevel(points: number): string {
  if (points >= 800) return "Gold";
  if (points >= 500) return "Silver";
  if (points >= 200) return "Bronze";
  return "Beginner";
}

function getNextLevelPoints(points: number): number {
  if (points >= 800) return 1000 - points;
  if (points >= 500) return 800 - points;
  if (points >= 200) return 500 - points;
  return 200 - points;
}

// Helper components
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center mb-2">
        {icon}
        <span className="text-xs font-medium ml-1 text-slate-500 dark:text-slate-400">{title}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

interface AchievementTypeCardProps {
  type: string;
  label: string;
  achievements: any[];
  icon: React.ReactNode;
}

function AchievementTypeCard({ type, label, achievements, icon }: AchievementTypeCardProps) {
  const typeAchievements = achievements.filter(a => a.type === type);
  const count = typeAchievements.length;
  const points = typeAchievements.reduce((sum, a) => sum + a.points, 0);
  
  return (
    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="flex items-center">
        <div className="mr-3">
          {icon}
        </div>
        <div>
          <div className="font-medium">{label}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{count} achievements</div>
        </div>
      </div>
      <Badge variant="outline" className="font-semibold">
        {points} pts
      </Badge>
    </div>
  );
}

function AchievementSkeleton() {
  return (
    <div className="flex items-start p-4 border-b border-slate-200 dark:border-slate-700">
      <Skeleton className="h-10 w-10 rounded-full mr-4" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
