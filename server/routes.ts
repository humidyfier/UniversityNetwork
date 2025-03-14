import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth, isAuthenticated, hasRole } from "./auth";
import { storage } from "./storage";
import { UserRole } from "@shared/schema";
import { z } from "zod";
import { insertDepartmentSchema, insertClassroomSchema, insertAssignmentSchema, insertMaterialSchema, insertAchievementSchema, insertAnnouncementSchema, insertFollowSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // API routes for users
  app.get("/api/user/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      
      if (req.user.role === UserRole.FACULTY) {
        const profile = await storage.getFacultyProfileByUserId(userId);
        return res.json(profile);
      } else if (req.user.role === UserRole.STUDENT) {
        const profile = await storage.getStudentProfileByUserId(userId);
        return res.json(profile);
      }
      
      res.json(null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Routes for admin
  // =================
  
  // Department management
  app.get("/api/departments", isAuthenticated, async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  // User management
  app.get("/api/users", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/faculty", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const faculty = await storage.getAllFaculty();
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty" });
    }
  });

  app.get("/api/students", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Classroom management
  app.get("/api/classrooms", isAuthenticated, async (req, res) => {
    try {
      let classrooms;
      
      if (req.user.role === UserRole.ADMIN) {
        classrooms = await storage.getAllClassrooms();
      } else if (req.user.role === UserRole.FACULTY) {
        const facultyProfile = await storage.getFacultyProfileByUserId(req.user.id);
        classrooms = await storage.getClassroomsByFacultyId(facultyProfile.id);
      } else if (req.user.role === UserRole.STUDENT) {
        const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
        classrooms = await storage.getClassroomsByStudentId(studentProfile.id);
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(classrooms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classrooms" });
    }
  });

  app.post("/api/classrooms", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const validatedData = insertClassroomSchema.parse(req.body);
      const classroom = await storage.createClassroom(validatedData);
      res.status(201).json(classroom);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create classroom" });
    }
  });

  app.get("/api/classrooms/:id", isAuthenticated, async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const classroom = await storage.getClassroomById(classroomId);
      
      if (!classroom) {
        return res.status(404).json({ message: "Classroom not found" });
      }
      
      // Check if the user has access to this classroom
      if (req.user.role === UserRole.STUDENT) {
        const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
        const hasAccess = await storage.checkStudentEnrollment(studentProfile.id, classroomId);
        
        if (!hasAccess) {
          return res.status(403).json({ message: "You don't have access to this classroom" });
        }
      } else if (req.user.role === UserRole.FACULTY) {
        const facultyProfile = await storage.getFacultyProfileByUserId(req.user.id);
        
        if (classroom.facultyId !== facultyProfile.id) {
          return res.status(403).json({ message: "You don't have access to this classroom" });
        }
      }
      
      res.json(classroom);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classroom" });
    }
  });

  // Assignment management
  app.get("/api/classrooms/:id/assignments", isAuthenticated, async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const assignments = await storage.getAssignmentsByClassroomId(classroomId);
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.post("/api/classrooms/:id/assignments", isAuthenticated, hasRole(UserRole.FACULTY), async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const validatedData = insertAssignmentSchema.parse({
        ...req.body,
        classroomId
      });
      
      // Verify this faculty manages this classroom
      const facultyProfile = await storage.getFacultyProfileByUserId(req.user.id);
      const classroom = await storage.getClassroomById(classroomId);
      
      if (!classroom || classroom.facultyId !== facultyProfile.id) {
        return res.status(403).json({ message: "You don't have permission to add assignments to this classroom" });
      }
      
      const assignment = await storage.createAssignment(validatedData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  // Materials management
  app.get("/api/classrooms/:id/materials", isAuthenticated, async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const materials = await storage.getMaterialsByClassroomId(classroomId);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch materials" });
    }
  });

  app.post("/api/classrooms/:id/materials", isAuthenticated, hasRole(UserRole.FACULTY), async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const validatedData = insertMaterialSchema.parse({
        ...req.body,
        classroomId
      });
      
      // Verify this faculty manages this classroom
      const facultyProfile = await storage.getFacultyProfileByUserId(req.user.id);
      const classroom = await storage.getClassroomById(classroomId);
      
      if (!classroom || classroom.facultyId !== facultyProfile.id) {
        return res.status(403).json({ message: "You don't have permission to add materials to this classroom" });
      }
      
      const material = await storage.createMaterial(validatedData);
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create material" });
    }
  });

  // Announcements
  app.get("/api/classrooms/:id/announcements", isAuthenticated, async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const announcements = await storage.getAnnouncementsByClassroomId(classroomId);
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch announcements" });
    }
  });

  app.post("/api/classrooms/:id/announcements", isAuthenticated, hasRole(UserRole.FACULTY), async (req, res) => {
    try {
      const classroomId = parseInt(req.params.id);
      const validatedData = insertAnnouncementSchema.parse({
        ...req.body,
        classroomId
      });
      
      // Verify this faculty manages this classroom
      const facultyProfile = await storage.getFacultyProfileByUserId(req.user.id);
      const classroom = await storage.getClassroomById(classroomId);
      
      if (!classroom || classroom.facultyId !== facultyProfile.id) {
        return res.status(403).json({ message: "You don't have permission to add announcements to this classroom" });
      }
      
      const announcement = await storage.createAnnouncement(validatedData);
      res.status(201).json(announcement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create announcement" });
    }
  });

  // Analytics endpoints for the admin dashboard
  // =========================================
  
  app.get("/api/analytics/students", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      
      // Calculate basic analytics
      const totalStudents = students.length;
      const byDepartment = new Map<number, number>();
      const byYear = new Map<number, number>();
      const averageGpa = students.reduce((acc, s) => acc + parseFloat(s.gpa || "0"), 0) / totalStudents;
      
      students.forEach(student => {
        // Count by department
        const deptId = student.departmentId || 0;
        byDepartment.set(deptId, (byDepartment.get(deptId) || 0) + 1);
        
        // Count by year
        byYear.set(student.year, (byYear.get(student.year) || 0) + 1);
      });
      
      // Format response
      const response = {
        totalStudents,
        averageGpa: averageGpa.toFixed(2),
        byDepartment: Array.from(byDepartment.entries()).map(([deptId, count]) => ({ departmentId: deptId, count })),
        byYear: Array.from(byYear.entries()).map(([year, count]) => ({ year, count })),
        // Include more detailed student data
        students: students.map(student => ({
          id: student.id,
          name: `${student.user.firstName} ${student.user.lastName}`,
          year: student.year,
          gpa: student.gpa,
          achievementPoints: student.achievementPoints,
          departmentId: student.departmentId
        }))
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student analytics" });
    }
  });
  
  app.get("/api/analytics/faculty", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const faculty = await storage.getAllFaculty();
      const classrooms = await storage.getAllClassrooms();
      
      // Calculate basic analytics
      const totalFaculty = faculty.length;
      const byDepartment = new Map<number, number>();
      
      // Count classrooms per faculty
      const classroomsByFaculty = new Map<number, number>();
      classrooms.forEach(classroom => {
        if (classroom.facultyId) {
          classroomsByFaculty.set(
            classroom.facultyId, 
            (classroomsByFaculty.get(classroom.facultyId) || 0) + 1
          );
        }
      });
      
      faculty.forEach(prof => {
        // Count by department
        const deptId = prof.departmentId || 0;
        byDepartment.set(deptId, (byDepartment.get(deptId) || 0) + 1);
      });
      
      // Format response
      const response = {
        totalFaculty,
        byDepartment: Array.from(byDepartment.entries()).map(([deptId, count]) => ({ departmentId: deptId, count })),
        // Include detailed faculty data with classroom counts
        faculty: faculty.map(prof => ({
          id: prof.id,
          name: `${prof.user.firstName} ${prof.user.lastName}`,
          title: prof.title,
          departmentId: prof.departmentId,
          classroomCount: classroomsByFaculty.get(prof.id) || 0
        }))
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch faculty analytics" });
    }
  });
  
  app.get("/api/analytics/enrollments", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const enrollments = await storage.getAllEnrollments();
      const classrooms = await storage.getAllClassrooms();
      
      // Calculate basic analytics - create a histogram by month
      const byMonth = new Map<string, number>();
      const now = new Date();
      
      // Create initial data for the last 12 months
      for (let i = 0; i < 12; i++) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        byMonth.set(key, 0);
      }
      
      // Count enrollments by month
      enrollments.forEach(enrollment => {
        const date = new Date(enrollment.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (byMonth.has(key)) {
          byMonth.set(key, (byMonth.get(key) || 0) + 1);
        }
      });
      
      // Count enrollments by classroom
      const byClassroom = new Map<number, number>();
      enrollments.forEach(enrollment => {
        byClassroom.set(
          enrollment.classroomId, 
          (byClassroom.get(enrollment.classroomId) || 0) + 1
        );
      });
      
      // Format response
      const response = {
        totalEnrollments: enrollments.length,
        byMonth: Array.from(byMonth.entries())
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month)),
        byClassroom: Array.from(byClassroom.entries()).map(([classroomId, count]) => {
          const classroom = classrooms.find(c => c.id === classroomId);
          return {
            classroomId,
            name: classroom ? classroom.name : 'Unknown',
            count
          };
        }).sort((a, b) => b.count - a.count)
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollment analytics" });
    }
  });
  
  app.get("/api/analytics/performance", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      const assignments = await storage.getAllAssignments();
      const submissions = await storage.getAllSubmissions();
      const departments = await storage.getAllDepartments();
      
      // GPA by department
      const gpaByDepartment = new Map<number, { total: number, count: number }>();
      students.forEach(student => {
        if (student.departmentId && student.gpa) {
          const current = gpaByDepartment.get(student.departmentId) || { total: 0, count: 0 };
          gpaByDepartment.set(student.departmentId, {
            total: current.total + parseFloat(student.gpa),
            count: current.count + 1
          });
        }
      });
      
      // Calculate submission rates
      const submissionRates = new Map<number, { submitted: number, total: number }>();
      submissions.forEach(submission => {
        const assignmentId = submission.assignmentId;
        const current = submissionRates.get(assignmentId) || { submitted: 0, total: 0 };
        submissionRates.set(assignmentId, {
          ...current,
          submitted: current.submitted + 1
        });
      });
      
      // Add all assignments to the map
      assignments.forEach(assignment => {
        const current = submissionRates.get(assignment.id) || { submitted: 0, total: 0 };
        submissionRates.set(assignment.id, {
          ...current,
          total: current.total + students.length // simplified - assuming all students should submit
        });
      });
      
      // Calculate average submission rates
      const avgSubmissionRate = Array.from(submissionRates.values()).reduce(
        (acc, { submitted, total }) => acc + (total > 0 ? submitted / total : 0), 
        0
      ) / submissionRates.size;
      
      // Format response
      const response = {
        averageGpa: (students.reduce((acc, s) => acc + parseFloat(s.gpa || "0"), 0) / students.length).toFixed(2),
        gpaByDepartment: Array.from(gpaByDepartment.entries()).map(([deptId, data]) => {
          const dept = departments.find(d => d.id === deptId);
          return {
            departmentId: deptId,
            departmentName: dept ? dept.name : 'Unknown',
            averageGpa: (data.total / data.count).toFixed(2)
          };
        }),
        submissionRate: (avgSubmissionRate * 100).toFixed(1) + '%',
        assignmentCompletionRates: Array.from(submissionRates.entries())
          .map(([assignmentId, data]) => {
            const assignment = assignments.find(a => a.id === assignmentId);
            return {
              assignmentId,
              title: assignment ? assignment.title : 'Unknown',
              completionRate: ((data.submitted / data.total) * 100).toFixed(1) + '%',
              submitted: data.submitted,
              total: data.total
            };
          })
          .sort((a, b) => a.assignmentId - b.assignmentId)
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch performance analytics" });
    }
  });
  
  app.get("/api/analytics/resources", isAuthenticated, hasRole(UserRole.ADMIN), async (req, res) => {
    try {
      const materials = await storage.getAllMaterials();
      const classrooms = await storage.getAllClassrooms();
      
      // Calculate materials by type
      const byType = new Map<string, number>();
      materials.forEach(material => {
        byType.set(material.type, (byType.get(material.type) || 0) + 1);
      });
      
      // Calculate materials by classroom
      const byClassroom = new Map<number, number>();
      materials.forEach(material => {
        byClassroom.set(
          material.classroomId, 
          (byClassroom.get(material.classroomId) || 0) + 1
        );
      });
      
      // Format response
      const response = {
        totalMaterials: materials.length,
        byType: Array.from(byType.entries())
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count),
        byClassroom: Array.from(byClassroom.entries())
          .map(([classroomId, count]) => {
            const classroom = classrooms.find(c => c.id === classroomId);
            return {
              classroomId,
              name: classroom ? classroom.name : 'Unknown',
              count
            };
          })
          .sort((a, b) => b.count - a.count),
        recentMaterials: materials
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
          .map(material => {
            const classroom = classrooms.find(c => c.id === material.classroomId);
            return {
              id: material.id,
              title: material.title,
              type: material.type,
              classroomName: classroom ? classroom.name : 'Unknown',
              createdAt: material.createdAt
            };
          })
      };
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource analytics" });
    }
  });
  
  // Student specific routes
  // ======================

  // Achievements
  app.get("/api/student/achievements", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const achievements = await storage.getAchievementsByStudentId(studentProfile.id);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.post("/api/student/achievements", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const validatedData = insertAchievementSchema.parse({
        ...req.body,
        studentId: studentProfile.id
      });
      
      const achievement = await storage.createAchievement(validatedData);
      
      // Update student points
      await storage.updateStudentPoints(studentProfile.id, validatedData.points);
      
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  // Follow system
  app.get("/api/student/following", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const following = await storage.getFollowing(studentProfile.id);
      res.json(following);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch following" });
    }
  });

  app.get("/api/student/followers", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const followers = await storage.getFollowers(studentProfile.id);
      res.json(followers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch followers" });
    }
  });

  app.post("/api/student/follow", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const validatedData = insertFollowSchema.parse({
        followerId: studentProfile.id,
        followingId: req.body.followingId
      });
      
      // Check if already following
      const existingFollow = await storage.checkFollow(validatedData.followerId, validatedData.followingId);
      if (existingFollow) {
        return res.status(400).json({ message: "Already following this student" });
      }
      
      const follow = await storage.createFollow(validatedData);
      res.status(201).json(follow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to follow student" });
    }
  });

  app.delete("/api/student/follow/:id", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const followingId = parseInt(req.params.id);
      
      await storage.deleteFollow(studentProfile.id, followingId);
      res.status(200).json({ message: "Successfully unfollowed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to unfollow student" });
    }
  });

  // Enrollment
  app.post("/api/student/enroll", isAuthenticated, hasRole(UserRole.STUDENT), async (req, res) => {
    try {
      const classId = req.body.classId;
      if (!classId) {
        return res.status(400).json({ message: "Class ID is required" });
      }
      
      const studentProfile = await storage.getStudentProfileByUserId(req.user.id);
      const classroom = await storage.getClassroomByClassId(classId);
      
      if (!classroom) {
        return res.status(404).json({ message: "Classroom not found" });
      }
      
      // Check if already enrolled
      const existingEnrollment = await storage.checkStudentEnrollment(studentProfile.id, classroom.id);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this class" });
      }
      
      const enrollment = await storage.createEnrollment({
        studentId: studentProfile.id,
        classroomId: classroom.id
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to enroll in classroom" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
