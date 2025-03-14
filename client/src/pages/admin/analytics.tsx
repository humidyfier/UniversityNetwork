import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, LineChart, Line, AreaChart, Area, 
  PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  UsersRound,
  GraduationCap,
  BookOpen,
  FileCheck,
  Trophy,
  BarChart3,
  BookOpenCheck,
  CalendarClock,
  GraduationCap as GraduationCapIcon,
  Library,
  Search,
  UserCheck,
  UserCog,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState("year");
  const [department, setDepartment] = useState("all");
  
  // Fetch data for analytics
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["/api/analytics/students"],
  });
  
  const { data: facultyData, isLoading: facultyLoading } = useQuery({
    queryKey: ["/api/analytics/faculty"],
  });
  
  const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["/api/analytics/enrollments"],
  });
  
  const { data: performanceData, isLoading: performanceLoading } = useQuery({
    queryKey: ["/api/analytics/performance"],
  });
  
  const { data: resourceData, isLoading: resourceLoading } = useQuery({
    queryKey: ["/api/analytics/resources"],
  });
  
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy dark:text-sky-blue">Advanced Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive data insights and performance metrics
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-white dark:bg-[#263549] border-sky-blue/50 dark:border-teal/50">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="semester">Semester</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40 bg-white dark:bg-[#263549] border-sky-blue/50 dark:border-teal/50">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="computerScience">Computer Science</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="arts">Arts & Humanities</SelectItem>
              <SelectItem value="science">Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Analytics Dashboard */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 bg-sky-blue/10 dark:bg-[#2a3d56] p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <GraduationCapIcon className="h-4 w-4 mr-2" />
            Students
          </TabsTrigger>
          <TabsTrigger value="faculty" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <UserCog className="h-4 w-4 mr-2" />
            Faculty
          </TabsTrigger>
          <TabsTrigger value="academics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <BookOpenCheck className="h-4 w-4 mr-2" />
            Academics
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="resources" className="data-[state=active]:bg-white dark:data-[state=active]:bg-teal/70">
            <Library className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Students"
              value="2,543"
              change="+12.5%"
              trend="up"
              icon={<GraduationCapIcon className="text-sky-blue dark:text-teal" />}
              isLoading={false}
            />
            <MetricCard
              title="Faculty Members"
              value="187"
              change="+5.2%"
              trend="up"
              icon={<UserCog className="text-sky-blue dark:text-teal" />}
              isLoading={false}
            />
            <MetricCard
              title="Course Completion"
              value="94.3%"
              change="+2.7%"
              trend="up"
              icon={<FileCheck className="text-sky-blue dark:text-teal" />}
              isLoading={false}
            />
            <MetricCard
              title="Average GPA"
              value="3.42"
              change="+0.11"
              trend="up"
              icon={<Trophy className="text-sky-blue dark:text-teal" />}
              isLoading={false}
            />
          </div>
          
          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Trends */}
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <UsersRound className="mr-2 h-5 w-5" />
                  Enrollment Trends
                </CardTitle>
                <CardDescription>New student enrollments over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { month: 'Jan', value: 340 },
                      { month: 'Feb', value: 380 },
                      { month: 'Mar', value: 410 },
                      { month: 'Apr', value: 390 },
                      { month: 'May', value: 420 },
                      { month: 'Jun', value: 450 },
                      { month: 'Jul', value: 470 },
                      { month: 'Aug', value: 590 },
                      { month: 'Sep', value: 620 },
                      { month: 'Oct', value: 550 },
                      { month: 'Nov', value: 510 },
                      { month: 'Dec', value: 480 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2F4156" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2F4156" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2F4156"
                      fillOpacity={1}
                      fill="url(#colorEnrollment)"
                      activeDot={{ r: 8 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Departmental Distribution */}
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Departmental Distribution
                </CardTitle>
                <CardDescription>Students by academic department</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Computer Science', value: 540 },
                        { name: 'Engineering', value: 620 },
                        { name: 'Business', value: 480 },
                        { name: 'Arts', value: 350 },
                        { name: 'Science', value: 420 },
                        { name: 'Other', value: 133 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#2F4156" />
                      <Cell fill="#4A7B9D" />
                      <Cell fill="#7FB3D5" />
                      <Cell fill="#A9CCE3" />
                      <Cell fill="#D6EAF8" />
                      <Cell fill="#EBF5FB" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Academic Performance */}
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Academic Performance
                </CardTitle>
                <CardDescription>Average GPA by department</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { department: 'CS', value: 3.4 },
                      { department: 'Eng.', value: 3.2 },
                      { department: 'Bus.', value: 3.5 },
                      { department: 'Arts', value: 3.7 },
                      { department: 'Sci.', value: 3.3 },
                    ]}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis domain={[2.5, 4.0]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4A7B9D" name="Average GPA" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Faculty-Student Ratio */}
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <UserCheck className="mr-2 h-5 w-5" />
                  Faculty-Student Ratio
                </CardTitle>
                <CardDescription>Ratio by department and growth</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={[
                      { year: '2019', cs: 16, eng: 18, business: 22, arts: 14, science: 19 },
                      { year: '2020', cs: 18, eng: 20, business: 23, arts: 15, science: 21 },
                      { year: '2021', cs: 21, eng: 22, business: 25, arts: 16, science: 22 },
                      { year: '2022', cs: 24, eng: 23, business: 27, arts: 18, science: 23 },
                      { year: '2023', cs: 22, eng: 20, business: 23, arts: 15, science: 20 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cs"
                      name="Computer Science"
                      stroke="#2F4156"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="eng"
                      name="Engineering"
                      stroke="#4A7B9D"
                    />
                    <Line
                      type="monotone"
                      dataKey="business"
                      name="Business"
                      stroke="#7FB3D5"
                    />
                    <Line
                      type="monotone"
                      dataKey="arts"
                      name="Arts"
                      stroke="#A9CCE3"
                    />
                    <Line
                      type="monotone"
                      dataKey="science"
                      name="Science"
                      stroke="#D6EAF8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Semester Overview */}
          <Card className="border-sky-blue/40 dark:border-teal/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                <CalendarClock className="mr-2 h-5 w-5" />
                Current Semester Overview
              </CardTitle>
              <CardDescription>Key metrics for the current academic period</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-sky-blue/10 dark:bg-teal/10 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Active Courses</div>
                  <div className="text-2xl font-bold text-navy dark:text-sky-blue mt-1">132</div>
                  <div className="text-xs text-green-500 mt-1">+8 from last semester</div>
                </div>
                
                <div className="bg-sky-blue/10 dark:bg-teal/10 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Assignments Due</div>
                  <div className="text-2xl font-bold text-navy dark:text-sky-blue mt-1">287</div>
                  <div className="text-xs text-amber-500 mt-1">74 pending review</div>
                </div>
                
                <div className="bg-sky-blue/10 dark:bg-teal/10 p-4 rounded-lg">
                  <div className="text-sm text-slate-500 dark:text-slate-400">Average Attendance</div>
                  <div className="text-2xl font-bold text-navy dark:text-sky-blue mt-1">92.7%</div>
                  <div className="text-xs text-green-500 mt-1">+2.3% from last semester</div>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart outerRadius={90} data={[
                  { category: 'Submissions', a: 85, fullMark: 100 },
                  { category: 'Attendance', a: 92, fullMark: 100 },
                  { category: 'Course Completion', a: 94, fullMark: 100 },
                  { category: 'Achievement Points', a: 78, fullMark: 100 },
                  { category: 'Faculty Engagement', a: 88, fullMark: 100 },
                  { category: 'Resource Utilization', a: 76, fullMark: 100 },
                ]}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Semester Performance" dataKey="a" stroke="#2F4156" fill="#2F4156" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content for the Students Tab */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card className="border-sky-blue/40 dark:border-teal/40 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                    <GraduationCapIcon className="mr-2 h-5 w-5" />
                    Student Enrollment Trends
                  </CardTitle>
                  <CardDescription>Enrollment patterns over time</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={[
                        { year: '2018', undergraduate: 1820, graduate: 520, total: 2340 },
                        { year: '2019', undergraduate: 1920, graduate: 540, total: 2460 },
                        { year: '2020', undergraduate: 1980, graduate: 580, total: 2560 },
                        { year: '2021', undergraduate: 2050, graduate: 620, total: 2670 },
                        { year: '2022', undergraduate: 2180, graduate: 650, total: 2830 },
                        { year: '2023', undergraduate: 2280, graduate: 680, total: 2960 },
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="undergraduate"
                        name="Undergraduate"
                        stroke="#2F4156"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="graduate"
                        name="Graduate"
                        stroke="#7FB3D5"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        name="Total"
                        stroke="#A9CCE3"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="border-sky-blue/40 dark:border-teal/40 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                    <Search className="mr-2 h-5 w-5" />
                    Student Demographics
                  </CardTitle>
                  <CardDescription>Diversity and representation</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Gender Distribution</h4>
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Male', value: 1340 },
                              { name: 'Female', value: 1180 },
                              { name: 'Non-binary', value: 23 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={1}
                            dataKey="value"
                          >
                            <Cell fill="#4A7B9D" />
                            <Cell fill="#7FB3D5" />
                            <Cell fill="#A9CCE3" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">International Students</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">International</span>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div className="bg-navy dark:bg-sky-blue h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Age Distribution</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">18-22</span>
                          <span className="text-sm font-medium">62%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-navy dark:bg-sky-blue h-2 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">23-27</span>
                          <span className="text-sm font-medium">24%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-navy dark:bg-sky-blue h-2 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500 dark:text-slate-400">28+</span>
                          <span className="text-sm font-medium">14%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-navy dark:bg-sky-blue h-2 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Student Performance Metrics
                </CardTitle>
                <CardDescription>Average GPA and academic standing</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { year: 'First Year', male: 3.2, female: 3.4 },
                      { year: 'Second Year', male: 3.3, female: 3.5 },
                      { year: 'Third Year', male: 3.4, female: 3.6 },
                      { year: 'Fourth Year', male: 3.5, female: 3.7 },
                      { year: 'Graduate', male: 3.6, female: 3.8 },
                    ]}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis domain={[2.5, 4.0]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="male" fill="#4A7B9D" name="Male" />
                    <Bar dataKey="female" fill="#7FB3D5" name="Female" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="border-sky-blue/40 dark:border-teal/40">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Achievement Distribution
                </CardTitle>
                <CardDescription>Student achievements and awards</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={[
                      { month: 'Jan', academic: 24, extracurricular: 18, sports: 12 },
                      { month: 'Feb', academic: 28, extracurricular: 20, sports: 15 },
                      { month: 'Mar', academic: 26, extracurricular: 22, sports: 18 },
                      { month: 'Apr', academic: 32, extracurricular: 24, sports: 22 },
                      { month: 'May', academic: 45, extracurricular: 28, sports: 24 },
                      { month: 'Jun', academic: 40, extracurricular: 25, sports: 20 },
                      { month: 'Jul', academic: 35, extracurricular: 22, sports: 16 },
                      { month: 'Aug', academic: 30, extracurricular: 20, sports: 14 },
                      { month: 'Sep', academic: 38, extracurricular: 26, sports: 18 },
                      { month: 'Oct', academic: 42, extracurricular: 28, sports: 22 },
                      { month: 'Nov', academic: 48, extracurricular: 30, sports: 24 },
                      { month: 'Dec', academic: 50, extracurricular: 32, sports: 26 },
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="academic"
                      stackId="1"
                      stroke="#2F4156"
                      fill="#2F4156"
                      name="Academic"
                    />
                    <Area
                      type="monotone"
                      dataKey="extracurricular"
                      stackId="1"
                      stroke="#4A7B9D"
                      fill="#4A7B9D"
                      name="Extracurricular"
                    />
                    <Area
                      type="monotone"
                      dataKey="sports"
                      stackId="1"
                      stroke="#7FB3D5"
                      fill="#7FB3D5"
                      name="Sports"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Placeholder for other tabs - Just showing one full implementation */}
        <TabsContent value="faculty" className="space-y-6">
          <div className="bg-white dark:bg-[#263549] p-6 rounded-lg border border-sky-blue/30 dark:border-teal/30">
            <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Faculty Analytics Dashboard</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This section will provide detailed analytics on faculty performance, teaching loads, research output, and student evaluations.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/5956/5956592.png" 
                alt="Faculty Analytics" 
                className="w-32 h-32 opacity-50" 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="academics" className="space-y-6">
          <div className="bg-white dark:bg-[#263549] p-6 rounded-lg border border-sky-blue/30 dark:border-teal/30">
            <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Academic Analytics Dashboard</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This section will provide insights into course offerings, completion rates, student feedback, and curriculum effectiveness.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/2232/2232688.png" 
                alt="Academic Analytics" 
                className="w-32 h-32 opacity-50" 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="bg-white dark:bg-[#263549] p-6 rounded-lg border border-sky-blue/30 dark:border-teal/30">
            <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Performance Analytics Dashboard</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This section will analyze university-wide performance metrics, student success rates, and institutional effectiveness indicators.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/4727/4727920.png" 
                alt="Performance Analytics" 
                className="w-32 h-32 opacity-50" 
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-6">
          <div className="bg-white dark:bg-[#263549] p-6 rounded-lg border border-sky-blue/30 dark:border-teal/30">
            <h3 className="text-xl font-bold text-navy dark:text-sky-blue mb-4">Resource Analytics Dashboard</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This section will provide insights into resource utilization, facility usage, budget allocation, and operational efficiency.
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/3176/3176351.png" 
                alt="Resource Analytics" 
                className="w-32 h-32 opacity-50" 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Advanced Filters Section */}
      <div className="mt-8">
        <Card className="border-sky-blue/40 dark:border-teal/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-navy dark:text-sky-blue flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Advanced Analytics Search
            </CardTitle>
            <CardDescription>Filter and search across all university data</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input 
                  placeholder="Search keywords..." 
                  className="border-sky-blue/50 dark:border-teal/50 bg-white dark:bg-[#263549]" 
                />
              </div>
              <div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full bg-white dark:bg-[#263549] border-sky-blue/50 dark:border-teal/50">
                    <SelectValue placeholder="Data Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="faculty">Faculty</SelectItem>
                    <SelectItem value="courses">Courses</SelectItem>
                    <SelectItem value="departments">Departments</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button className="w-full bg-navy hover:bg-teal dark:bg-sky-blue dark:text-navy">
                  Generate Report
                </Button>
              </div>
            </div>
            
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm p-8">
              <div className="mb-2">Advanced analytics reporting system</div>
              <div>Generate custom reports with filtered data for deeper insights</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  isLoading: boolean;
}

function MetricCard({ title, value, change, trend, icon, isLoading }: MetricCardProps) {
  return (
    <Card className="border-sky-blue/40 dark:border-teal/40">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-navy/60 dark:text-white/60 text-sm font-medium">{title}</div>
          <div className="bg-sky-blue/20 dark:bg-teal/20 p-2 rounded-full">
            {icon}
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-8 w-24 mb-2" />
        ) : (
          <div className="text-2xl font-bold text-navy dark:text-white mb-2">{value}</div>
        )}
        
        <div className={`flex items-center text-xs font-medium ${
          trend === 'up' ? 'text-green-500' : 
          trend === 'down' ? 'text-red-500' : 
          'text-amber-500'
        }`}>
          {trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
          {trend === 'down' && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}