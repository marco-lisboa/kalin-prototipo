import { Lesson, Course } from '../types';
import { StorageService, StorageKeys } from './storage';

export const lessonService = {
  // Obter todas as aulas com filtros
  async getLessons(filters?: {
    courseId?: string;
    moduleId?: string;
    teacherId?: string;
    status?: 'published' | 'draft';
    search?: string;
  }): Promise<Lesson[]> {
    let lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);

    if (filters) {
      if (filters.courseId) {
        lessons = lessons.filter(l => l.courseId === filters.courseId);
      }
      if (filters.moduleId) {
        lessons = lessons.filter(l => l.moduleId === filters.moduleId);
      }
      if (filters.teacherId) {
        lessons = lessons.filter(l => l.teacherId === filters.teacherId);
      }
      if (filters.status) {
        lessons = lessons.filter(l => l.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        lessons = lessons.filter(l =>
          l.title.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query) ||
          l.teacherName.toLowerCase().includes(query)
        );
      }
    }

    return lessons;
  },

  // Obter aula por ID
  async getLessonById(id: string): Promise<Lesson | null> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    return lessons.find(l => l.id === id) || null;
  },

  // Obter aulas de um curso
  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    return lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  },

  // Obter aulas recentes (Novos conteúdos)
  async getRecentLessons(limit: number = 6): Promise<Lesson[]> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    return [...lessons]
      .filter(l => l.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },

  // Criar nova aula
  async createLesson(data: Omit<Lesson, 'id' | 'createdAt' | 'viewsCount'>): Promise<Lesson> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    const newLesson: Lesson = {
      ...data,
      id: `les-${Date.now()}`,
      viewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    lessons.push(newLesson);
    StorageService.set(StorageKeys.LESSONS, lessons);

    // Atualizar contador de aulas no curso
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const courseIndex = courses.findIndex(c => c.id === data.courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].lessonsCount += 1;
      StorageService.set(StorageKeys.COURSES, courses);
    }

    return newLesson;
  },

  // Atualizar aula
  async updateLesson(id: string, data: Partial<Lesson>): Promise<Lesson | null> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    const index = lessons.findIndex(l => l.id === id);
    if (index === -1) return null;

    const updated = { ...lessons[index], ...data };
    lessons[index] = updated;
    StorageService.set(StorageKeys.LESSONS, lessons);
    return updated;
  },

  // Excluir aula
  async deleteLesson(id: string): Promise<boolean> {
    let lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    const lessonToDelete = lessons.find(l => l.id === id);
    if (!lessonToDelete) return false;

    lessons = lessons.filter(l => l.id !== id);
    StorageService.set(StorageKeys.LESSONS, lessons);

    // Decrementar no curso
    const courses = StorageService.get<Course[]>(StorageKeys.COURSES, []);
    const courseIndex = courses.findIndex(c => c.id === lessonToDelete.courseId);
    if (courseIndex !== -1) {
      courses[courseIndex].lessonsCount = Math.max(0, courses[courseIndex].lessonsCount - 1);
      StorageService.set(StorageKeys.COURSES, courses);
    }

    return true;
  },

  // Alternar status de publicação
  async togglePublish(id: string): Promise<Lesson | null> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return null;

    const newStatus = lesson.status === 'published' ? 'draft' : 'published';
    return this.updateLesson(id, { status: newStatus });
  },

  // Incrementar visualizações
  async incrementViews(id: string): Promise<void> {
    const lessons = StorageService.get<Lesson[]>(StorageKeys.LESSONS, []);
    const lesson = lessons.find(l => l.id === id);
    if (lesson) {
      lesson.viewsCount = (lesson.viewsCount || 0) + 1;
      StorageService.set(StorageKeys.LESSONS, lessons);
    }
  }
};
