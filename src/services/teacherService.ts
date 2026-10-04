import { Teacher, User } from '../types';
import { StorageService, StorageKeys } from './storage';

export const teacherService = {
  // Obter todos os professores
  async getTeachers(filters?: { search?: string; specialtyId?: string }): Promise<Teacher[]> {
    let teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);

    if (filters) {
      if (filters.specialtyId) {
        teachers = teachers.filter(t => t.specialtyId === filters.specialtyId);
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        teachers = teachers.filter(t =>
          t.name.toLowerCase().includes(query) ||
          t.email.toLowerCase().includes(query) ||
          t.specialty.toLowerCase().includes(query)
        );
      }
    }

    return teachers;
  },

  // Obter professor por ID
  async getTeacherById(id: string): Promise<Teacher | null> {
    const teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);
    return teachers.find(t => t.id === id) || null;
  },

  // Criar novo professor
  async createTeacher(data: {
    name: string;
    cpf: string;
    email: string;
    specialty: string;
    specialtyId: string;
    title?: string;
    bio?: string;
    status: 'active' | 'inactive';
  }): Promise<Teacher> {
    const teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const newTeacher: Teacher = {
      id: `prof-${Date.now()}`,
      name: data.name.trim(),
      cpf: data.cpf.trim(),
      email: data.email.trim(),
      role: 'teacher',
      status: data.status,
      specialty: data.specialty,
      specialtyId: data.specialtyId,
      title: data.title || 'Docente Especialista Kalin Educ',
      bio: data.bio || '',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      taughtCourseIds: [],
      totalStudents: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    teachers.unshift(newTeacher);
    users.unshift(newTeacher);

    StorageService.set(StorageKeys.TEACHERS, teachers);
    StorageService.set(StorageKeys.USERS, users);

    // Salvar credencial padrão '123456'
    const credsMap = StorageService.get<Record<string, { password: string; role: string; userId: string }>>(
      `${StorageKeys.USERS}_creds`,
      {}
    );
    credsMap[newTeacher.cpf] = {
      password: '123456',
      role: 'teacher',
      userId: newTeacher.id
    };
    StorageService.set(`${StorageKeys.USERS}_creds`, credsMap);

    return newTeacher;
  },

  // Atualizar professor
  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher | null> {
    const teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const tIndex = teachers.findIndex(t => t.id === id);
    if (tIndex === -1) return null;

    const updated = { ...teachers[tIndex], ...data };
    teachers[tIndex] = updated;
    StorageService.set(StorageKeys.TEACHERS, teachers);

    const uIndex = users.findIndex(u => u.id === id);
    if (uIndex !== -1) {
      users[uIndex] = { ...users[uIndex], ...data };
      StorageService.set(StorageKeys.USERS, users);
    }

    return updated;
  },

  // Excluir professor
  async deleteTeacher(id: string): Promise<boolean> {
    let teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);
    let users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const initialLen = teachers.length;
    teachers = teachers.filter(t => t.id !== id);
    users = users.filter(u => u.id !== id);

    if (teachers.length !== initialLen) {
      StorageService.set(StorageKeys.TEACHERS, teachers);
      StorageService.set(StorageKeys.USERS, users);
      return true;
    }
    return false;
  }
};
