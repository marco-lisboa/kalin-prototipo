export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  phone?: string;
  title?: string; // e.g. "Prof. Dr. Especialista" for teachers
  bio?: string;
  specialtyId?: string;
}

export interface Student extends User {
  role: 'student';
  enrolledCourseIds: string[];
}

export interface Teacher extends User {
  role: 'teacher';
  specialty: string;
  specialtyId: string;
  taughtCourseIds: string[];
  totalStudents?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  color: string;
  coursesCount: number;
  isActive: boolean;
  order: number;
}

export interface LessonMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'link' | 'zip';
  size?: string;
  url: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
  durationMinutes: number;
  durationFormatted: string;
  videoUrl: string;
  thumbnailUrl: string;
  order: number;
  status: 'published' | 'draft';
  materials: LessonMaterial[];
  viewsCount: number;
  teacherId: string;
  teacherName: string;
  createdAt: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  categoryId: string;
  categoryName: string;
  teacherId: string;
  teacherName: string;
  teacherRole: string;
  teacherAvatar: string;
  thumbnailUrl: string;
  bannerUrl: string;
  durationHours: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialização';
  featured: boolean;
  isNew: boolean;
  rating: number;
  ratingsCount: number;
  studentsCount: number;
  modulesCount: number;
  lessonsCount: number;
  status: 'published' | 'draft';
  tags: string[];
  createdAt: string;
  certificateProvided: boolean;
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessonIds: string[];
  lastLessonId?: string;
  lastAccessedAt: string;
  percentCompleted: number;
  totalMinutesWatched: number;
}

export interface ContinueWatchingItem {
  course: Course;
  lesson: Lesson;
  progressPercent: number;
  durationWatchedMinutes: number;
  lastAccessedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetTitle: string;
  timestamp: string;
  type: 'lesson_completed' | 'course_enrolled' | 'lesson_created' | 'user_registered' | 'course_created';
}

export interface Session {
  user: User;
  token: string;
  loginAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalLessons: number;
  activeEnrollments: number;
  totalHoursWatched: number;
}
