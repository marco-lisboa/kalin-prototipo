import { Course, Module, Lesson } from '../types';
import { StorageService, StorageKeys } from './storage';

export const courseService = {
  // Obter lista de cursos com filtros opcionais
  async getCourses(filters?: {
    categoryId?: string;
    teacherId?: string;
    status?: 'published' | 'draft';
    search?: string;
    level?: string;
  }): Promise<Course[]> {
    let courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);

    if (filters) {
      if (filters.categoryId) {
        courses = courses.filter(c => c.categoryId === filters.categoryId);
      }
      if (filters.teacherId) {
        courses = courses.filter(c => c.teacherId === filters.teacherId);
      }
      if (filters.status) {
        courses = courses.filter(c => c.status === filters.status);
      }
      if (filters.level) {
        courses = courses.filter(c => c.level === filters.level);
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        courses = courses.filter(c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.categoryName.toLowerCase().includes(query) ||
          c.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
    }

    return courses;
  },

  // Obter curso por ID
  async getCourseById(id: string): Promise<Course | null> {
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    return courses.find(c => c.id === id) || null;
  },

  // Obter curso por Slug
  async getCourseBySlug(slug: string): Promise<Course | null> {
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    return courses.find(c => c.slug === slug) || null;
  },

  // Obter curso em destaque (Hero)
  async getFeaturedCourse(): Promise<Course | null> {
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const featured = courses.find(c => c.featured && c.status === 'published');
    return featured || courses[0] || null;
  },

  // Criar novo curso
  async createCourse(data: Omit<Course, 'id' | 'createdAt' | 'modulesCount' | 'lessonsCount' | 'studentsCount' | 'rating' | 'ratingsCount'>): Promise<Course> {
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const newCourse: Course = {
      ...data,
      id: `course-${Date.now()}`,
      modulesCount: 0,
      lessonsCount: 0,
      studentsCount: 0,
      rating: 5.0,
      ratingsCount: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    courses.unshift(newCourse);
    StorageService.set(StorageKeys.COURSES, courses);
    return newCourse;
  },

  // Atualizar curso
  async updateCourse(id: string, data: Partial<Course>): Promise<Course | null> {
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const index = courses.findIndex(c => c.id === id);

    if (index === -1) return null;

    const updated = { ...courses[index], ...data };
    courses[index] = updated;
    StorageService.set(StorageKeys.COURSES, courses);
    return updated;
  },

  // Excluir curso
  async deleteCourse(id: string): Promise<boolean> {
    let courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const initialLen = courses.length;
    courses = courses.filter(c => c.id !== id);

    if (courses.length !== initialLen) {
      StorageService.set(StorageKeys.COURSES, courses);

      // Excluir também módulos e aulas relacionados
      let modules = StorageService.get<Module[]>(StorageKeys.MODULES, []);
      modules = modules.filter(m => m.courseId !== id);
      StorageService.set(StorageKeys.MODULES, modules);

      let lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
      lessons = lessons.filter(l => l.courseId !== id);
      StorageService.set(StorageKeys.LESSONS, lessons);

      return true;
    }
    return false;
  },

  // Obter módulos e suas aulas de um curso
  async getCourseModules(courseId: string): Promise<Module[]> {
    const modules = StorageService.get<Module[]>(StorageKeys.MODULES, []);
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);

    const courseModules = modules
      .filter(m => m.courseId === courseId)
      .sort((a, b) => a.order - b.order)
      .map(m => ({
        ...m,
        lessons: lessons
          .filter(l => l.moduleId === m.id)
          .sort((a, b) => a.order - b.order)
      }));

    return courseModules;
  },

  // Criar módulo
  async createModule(data: Omit<Module, 'id' | 'lessons'>): Promise<Module> {
    const modules = StorageService.get<Module[]>(StorageKeys.MODULES, []);
    const newModule: Module = {
      ...data,
      id: `mod-${Date.now()}`,
      lessons: []
    };
    modules.push(newModule);
    StorageService.set(StorageKeys.MODULES, modules);

    // Atualizar contagem de módulos no curso
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const courseIndex = courses.findIndex(c => c.id === data.courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].modulesCount += 1;
      StorageService.set(StorageKeys.COURSES, courses);
    }

    return newModule;
  },

  // Atualizar módulo
  async updateModule(id: string, data: Partial<Module>): Promise<Module | null> {
    const modules = StorageService.get<Module[]>(StorageKeys.MODULES, []);
    const index = modules.findIndex(m => m.id === id);
    if (index === -1) return null;

    const updated = { ...modules[index], ...data };
    modules[index] = updated;
    StorageService.set(StorageKeys.MODULES, modules);
    return updated;
  },

  // Excluir módulo
  async deleteModule(id: string): Promise<boolean> {
    let modules = StorageService.get<Module[]>(StorageKeys.MODULES, []);
    const modToDelete = modules.find(m => m.id === id);
    if (!modToDelete) return false;

    modules = modules.filter(m => m.id !== id);
    StorageService.set(StorageKeys.MODULES, modules);

    // Atualizar contador no curso
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const courseIndex = courses.findIndex(c => c.id === modToDelete.courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].modulesCount = Math.max(0, courses[courseIndex].modulesCount - 1);
      StorageService.set(StorageKeys.COURSES, courses);
    }

    return true;
  }
};
