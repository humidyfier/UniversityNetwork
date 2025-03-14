import session from "express-session";
import createMemoryStore from "memorystore";
import { 
  User, InsertUser, Department, InsertDepartment,
  FacultyProfile, InsertFacultyProfile, StudentProfile, InsertStudentProfile,
  Classroom, InsertClassroom, Enrollment, InsertEnrollment,
  Assignment, InsertAssignment, Submission, InsertSubmission,
  Material, InsertMaterial, Achievement, InsertAchievement,
  Follow, InsertFollow, Announcement, InsertAnnouncement,
  UserRoleType
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Department methods
  createDepartment(department: InsertDepartment): Promise<Department>;
  getDepartmentById(id: number): Promise<Department | undefined>;
  getAllDepartments(): Promise<Department[]>;
  
  // Faculty methods
  createFacultyProfile(profile: InsertFacultyProfile): Promise<FacultyProfile>;
  getFacultyProfileById(id: number): Promise<FacultyProfile | undefined>;
  getFacultyProfileByUserId(userId: number): Promise<FacultyProfile>;
  getAllFaculty(): Promise<(FacultyProfile & { user: User })[]>;
  
  // Student methods
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  getStudentProfileById(id: number): Promise<StudentProfile | undefined>;
  getStudentProfileByUserId(userId: number): Promise<StudentProfile>;
  getAllStudents(): Promise<(StudentProfile & { user: User })[]>;
  updateStudentPoints(id: number, points: number): Promise<StudentProfile>;
  
  // Classroom methods
  createClassroom(classroom: InsertClassroom): Promise<Classroom>;
  getClassroomById(id: number): Promise<Classroom | undefined>;
  getClassroomByClassId(classId: string): Promise<Classroom | undefined>;
  getAllClassrooms(): Promise<Classroom[]>;
  getClassroomsByFacultyId(facultyId: number): Promise<Classroom[]>;
  getClassroomsByStudentId(studentId: number): Promise<Classroom[]>;
  
  // Enrollment methods
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentById(id: number): Promise<Enrollment | undefined>;
  getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]>;
  getEnrollmentsByClassroomId(classroomId: number): Promise<Enrollment[]>;
  checkStudentEnrollment(studentId: number, classroomId: number): Promise<boolean>;
  
  // Assignment methods
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  getAssignmentsByClassroomId(classroomId: number): Promise<Assignment[]>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionById(id: number): Promise<Submission | undefined>;
  getSubmissionsByAssignmentId(assignmentId: number): Promise<Submission[]>;
  getSubmissionsByStudentId(studentId: number): Promise<Submission[]>;
  
  // Material methods
  createMaterial(material: InsertMaterial): Promise<Material>;
  getMaterialById(id: number): Promise<Material | undefined>;
  getMaterialsByClassroomId(classroomId: number): Promise<Material[]>;
  
  // Achievement methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getAchievementById(id: number): Promise<Achievement | undefined>;
  getAchievementsByStudentId(studentId: number): Promise<Achievement[]>;
  
  // Follow methods
  createFollow(follow: InsertFollow): Promise<Follow>;
  getFollowById(id: number): Promise<Follow | undefined>;
  getFollowing(studentId: number): Promise<(StudentProfile & { user: User })[]>;
  getFollowers(studentId: number): Promise<(StudentProfile & { user: User })[]>;
  checkFollow(followerId: number, followingId: number): Promise<boolean>;
  deleteFollow(followerId: number, followingId: number): Promise<void>;
  
  // Announcement methods
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncementById(id: number): Promise<Announcement | undefined>;
  getAnnouncementsByClassroomId(classroomId: number): Promise<Announcement[]>;
  
  // Analytics methods
  getAllEnrollments(): Promise<Enrollment[]>;
  getAllAssignments(): Promise<Assignment[]>;
  getAllSubmissions(): Promise<Submission[]>;
  getAllMaterials(): Promise<Material[]>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  
  private users: Map<number, User>;
  private departments: Map<number, Department>;
  private facultyProfiles: Map<number, FacultyProfile>;
  private studentProfiles: Map<number, StudentProfile>;
  private classrooms: Map<number, Classroom>;
  private enrollments: Map<number, Enrollment>;
  private assignments: Map<number, Assignment>;
  private submissions: Map<number, Submission>;
  private materials: Map<number, Material>;
  private achievements: Map<number, Achievement>;
  private follows: Map<number, Follow>;
  private announcements: Map<number, Announcement>;
  
  private userIdCounter: number = 1;
  private departmentIdCounter: number = 1;
  private facultyProfileIdCounter: number = 1;
  private studentProfileIdCounter: number = 1;
  private classroomIdCounter: number = 1;
  private enrollmentIdCounter: number = 1;
  private assignmentIdCounter: number = 1;
  private submissionIdCounter: number = 1;
  private materialIdCounter: number = 1;
  private achievementIdCounter: number = 1;
  private followIdCounter: number = 1;
  private announcementIdCounter: number = 1;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 1 day
    });
    
    this.users = new Map();
    this.departments = new Map();
    this.facultyProfiles = new Map();
    this.studentProfiles = new Map();
    this.classrooms = new Map();
    this.enrollments = new Map();
    this.assignments = new Map();
    this.submissions = new Map();
    this.materials = new Map();
    this.achievements = new Map();
    this.follows = new Map();
    this.announcements = new Map();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    // Convert string role to UserRoleType to ensure type compatibility
    const userRole = insertUser.role as UserRoleType;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: now,
      role: userRole,
      profilePicture: insertUser.profilePicture || null 
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Department methods
  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.departmentIdCounter++;
    const now = new Date();
    const newDepartment: Department = { ...department, id, createdAt: now };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }

  async getDepartmentById(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }

  async getAllDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  // Faculty methods
  async createFacultyProfile(profile: InsertFacultyProfile): Promise<FacultyProfile> {
    const id = this.facultyProfileIdCounter++;
    const now = new Date();
    const newProfile: FacultyProfile = { 
      ...profile, 
      id, 
      createdAt: now,
      departmentId: profile.departmentId || null,
      bio: profile.bio || null
    };
    this.facultyProfiles.set(id, newProfile);
    return newProfile;
  }

  async getFacultyProfileById(id: number): Promise<FacultyProfile | undefined> {
    return this.facultyProfiles.get(id);
  }

  async getFacultyProfileByUserId(userId: number): Promise<FacultyProfile> {
    const profile = Array.from(this.facultyProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
    
    if (!profile) {
      throw new Error(`Faculty profile not found for user ${userId}`);
    }
    
    return profile;
  }

  async getAllFaculty(): Promise<(FacultyProfile & { user: User })[]> {
    return Array.from(this.facultyProfiles.values()).map((profile) => {
      const user = this.users.get(profile.userId);
      if (!user) {
        throw new Error(`User not found for faculty profile ${profile.id}`);
      }
      return { ...profile, user };
    });
  }

  // Student methods
  async createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile> {
    const id = this.studentProfileIdCounter++;
    const now = new Date();
    const newProfile: StudentProfile = { 
      ...profile, 
      id, 
      createdAt: now,
      departmentId: profile.departmentId || null,
      achievementPoints: profile.achievementPoints || 0,
      gpa: profile.gpa || "0.0"
    };
    this.studentProfiles.set(id, newProfile);
    return newProfile;
  }

  async getStudentProfileById(id: number): Promise<StudentProfile | undefined> {
    return this.studentProfiles.get(id);
  }

  async getStudentProfileByUserId(userId: number): Promise<StudentProfile> {
    const profile = Array.from(this.studentProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
    
    if (!profile) {
      throw new Error(`Student profile not found for user ${userId}`);
    }
    
    return profile;
  }

  async getAllStudents(): Promise<(StudentProfile & { user: User })[]> {
    return Array.from(this.studentProfiles.values()).map((profile) => {
      const user = this.users.get(profile.userId);
      if (!user) {
        throw new Error(`User not found for student profile ${profile.id}`);
      }
      return { ...profile, user };
    });
  }

  async updateStudentPoints(id: number, points: number): Promise<StudentProfile> {
    const profile = this.studentProfiles.get(id);
    if (!profile) {
      throw new Error(`Student profile not found with id ${id}`);
    }
    
    const updatedProfile = { 
      ...profile, 
      achievementPoints: (profile.achievementPoints || 0) + points 
    };
    
    this.studentProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  // Classroom methods
  async createClassroom(classroom: InsertClassroom): Promise<Classroom> {
    const id = this.classroomIdCounter++;
    const now = new Date();
    const newClassroom: Classroom = { 
      ...classroom, 
      id, 
      createdAt: now,
      departmentId: classroom.departmentId || null,
      facultyId: classroom.facultyId || null,
      description: classroom.description || null,
      schedule: classroom.schedule || null
    };
    this.classrooms.set(id, newClassroom);
    return newClassroom;
  }

  async getClassroomById(id: number): Promise<Classroom | undefined> {
    return this.classrooms.get(id);
  }

  async getClassroomByClassId(classId: string): Promise<Classroom | undefined> {
    return Array.from(this.classrooms.values()).find(
      (classroom) => classroom.classId === classId,
    );
  }

  async getAllClassrooms(): Promise<Classroom[]> {
    return Array.from(this.classrooms.values());
  }

  async getClassroomsByFacultyId(facultyId: number): Promise<Classroom[]> {
    return Array.from(this.classrooms.values()).filter(
      (classroom) => classroom.facultyId === facultyId,
    );
  }

  async getClassroomsByStudentId(studentId: number): Promise<Classroom[]> {
    const enrollments = await this.getEnrollmentsByStudentId(studentId);
    const classroomIds = enrollments.map((enrollment) => enrollment.classroomId);
    
    return Array.from(this.classrooms.values()).filter(
      (classroom) => classroomIds.includes(classroom.id),
    );
  }

  // Enrollment methods
  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.enrollmentIdCounter++;
    const now = new Date();
    const newEnrollment: Enrollment = { 
      ...enrollment, 
      id, 
      enrollmentDate: now,
      grade: enrollment.grade || null,
      progress: enrollment.progress || 0
    };
    this.enrollments.set(id, newEnrollment);
    return newEnrollment;
  }

  async getEnrollmentById(id: number): Promise<Enrollment | undefined> {
    return this.enrollments.get(id);
  }

  async getEnrollmentsByStudentId(studentId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.studentId === studentId,
    );
  }

  async getEnrollmentsByClassroomId(classroomId: number): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(
      (enrollment) => enrollment.classroomId === classroomId,
    );
  }

  async checkStudentEnrollment(studentId: number, classroomId: number): Promise<boolean> {
    return Array.from(this.enrollments.values()).some(
      (enrollment) => enrollment.studentId === studentId && enrollment.classroomId === classroomId,
    );
  }

  // Assignment methods
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentIdCounter++;
    const now = new Date();
    const newAssignment: Assignment = { ...assignment, id, createdAt: now };
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAssignmentsByClassroomId(classroomId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(
      (assignment) => assignment.classroomId === classroomId,
    );
  }

  // Submission methods
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const id = this.submissionIdCounter++;
    const now = new Date();
    const newSubmission: Submission = { 
      ...submission, 
      id, 
      submissionDate: now
    };
    this.submissions.set(id, newSubmission);
    return newSubmission;
  }

  async getSubmissionById(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionsByAssignmentId(assignmentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.assignmentId === assignmentId,
    );
  }

  async getSubmissionsByStudentId(studentId: number): Promise<Submission[]> {
    return Array.from(this.submissions.values()).filter(
      (submission) => submission.studentId === studentId,
    );
  }

  // Material methods
  async createMaterial(material: InsertMaterial): Promise<Material> {
    const id = this.materialIdCounter++;
    const now = new Date();
    const newMaterial: Material = { ...material, id, createdAt: now };
    this.materials.set(id, newMaterial);
    return newMaterial;
  }

  async getMaterialById(id: number): Promise<Material | undefined> {
    return this.materials.get(id);
  }

  async getMaterialsByClassroomId(classroomId: number): Promise<Material[]> {
    return Array.from(this.materials.values()).filter(
      (material) => material.classroomId === classroomId,
    );
  }

  // Achievement methods
  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const now = new Date();
    const newAchievement: Achievement = { ...achievement, id, date: now };
    this.achievements.set(id, newAchievement);
    return newAchievement;
  }

  async getAchievementById(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAchievementsByStudentId(studentId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.studentId === studentId,
    );
  }

  // Follow methods
  async createFollow(follow: InsertFollow): Promise<Follow> {
    const id = this.followIdCounter++;
    const now = new Date();
    const newFollow: Follow = { ...follow, id, createdAt: now };
    this.follows.set(id, newFollow);
    return newFollow;
  }

  async getFollowById(id: number): Promise<Follow | undefined> {
    return this.follows.get(id);
  }

  async getFollowing(studentId: number): Promise<(StudentProfile & { user: User })[]> {
    const followingIds = Array.from(this.follows.values())
      .filter((follow) => follow.followerId === studentId)
      .map((follow) => follow.followingId);
    
    return Array.from(this.studentProfiles.values())
      .filter((profile) => followingIds.includes(profile.id))
      .map((profile) => {
        const user = this.users.get(profile.userId);
        if (!user) {
          throw new Error(`User not found for student profile ${profile.id}`);
        }
        return { ...profile, user };
      });
  }

  async getFollowers(studentId: number): Promise<(StudentProfile & { user: User })[]> {
    const followerIds = Array.from(this.follows.values())
      .filter((follow) => follow.followingId === studentId)
      .map((follow) => follow.followerId);
    
    return Array.from(this.studentProfiles.values())
      .filter((profile) => followerIds.includes(profile.id))
      .map((profile) => {
        const user = this.users.get(profile.userId);
        if (!user) {
          throw new Error(`User not found for student profile ${profile.id}`);
        }
        return { ...profile, user };
      });
  }

  async checkFollow(followerId: number, followingId: number): Promise<boolean> {
    return Array.from(this.follows.values()).some(
      (follow) => follow.followerId === followerId && follow.followingId === followingId,
    );
  }

  async deleteFollow(followerId: number, followingId: number): Promise<void> {
    const follow = Array.from(this.follows.values()).find(
      (follow) => follow.followerId === followerId && follow.followingId === followingId,
    );
    
    if (follow) {
      this.follows.delete(follow.id);
    }
  }

  // Announcement methods
  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const id = this.announcementIdCounter++;
    const now = new Date();
    const newAnnouncement: Announcement = { ...announcement, id, createdAt: now };
    this.announcements.set(id, newAnnouncement);
    return newAnnouncement;
  }

  async getAnnouncementById(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async getAnnouncementsByClassroomId(classroomId: number): Promise<Announcement[]> {
    return Array.from(this.announcements.values()).filter(
      (announcement) => announcement.classroomId === classroomId,
    );
  }

  // Analytics methods
  async getAllEnrollments(): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values());
  }

  async getAllAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values());
  }

  async getAllMaterials(): Promise<Material[]> {
    return Array.from(this.materials.values());
  }
}

export const storage = new MemStorage();
