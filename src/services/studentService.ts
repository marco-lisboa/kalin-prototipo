import { Student, User } from '../types';
import { StorageService, StorageKeys } from './storage';

export const studentService = {
  // Obter todos os alunos
  async getStudents(filters?: { search?: string; status?: 'active' | 'inactive' }): Promise<Student[]> {
    let students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);

    if (filters) {
      if (filters.status) {
        students = students.filter(s => s.status === filters.status);
      }
      if (filters.search && filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        students = students.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.cpf.includes(query)
        );
      }
    }

    return students;
  },

  // Obter aluno por ID
  async getStudentById(id: string): Promise<Student | null> {
    const students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);
    return students.find(s => s.id === id) || null;
  },

  // Criar novo aluno pelo Admin
  async createStudent(data: {
    name: string;
    cpf: string;
    email: string;
    status: 'active' | 'inactive';
    enrolledCourseIds?: string[];
  }): Promise<Student> {
    const students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: data.name.trim(),
      cpf: data.cpf.trim(),
      email: data.email.trim(),
      role: 'student',
      status: data.status,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      enrolledCourseIds: data.enrolledCourseIds || ['course-neuro-1'],
      createdAt: new Date().toISOString().split('T')[0]
    };

    students.unshift(newStudent);
    users.unshift(newStudent);

    StorageService.set(StorageKeys.STUDENTS, students);
    StorageService.set(StorageKeys.USERS, users);

    // Salvar credencial padrão '123456'
    const credsMap = StorageService.get<Record<string, { password: string; role: string; userId: string }>>(
      `${StorageKeys.USERS}_creds`,
      {}
    );
    credsMap[newStudent.cpf] = {
      password: '123456',
      role: 'student',
      userId: newStudent.id
    };
    StorageService.set(`${StorageKeys.USERS}_creds`, credsMap);

    return newStudent;
  },

  // Atualizar aluno
  async updateStudent(id: string, data: Partial<Student>): Promise<Student | null> {
    const students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const sIndex = students.findIndex(s => s.id === id);
    if (sIndex === -1) return null;

    const updated = { ...students[sIndex], ...data };
    students[sIndex] = updated;
    StorageService.set(StorageKeys.STUDENTS, students);

    const uIndex = users.findIndex(u => u.id === id);
    if (uIndex !== -1) {
      users[uIndex] = { ...users[uIndex], ...data };
      StorageService.set(StorageKeys.USERS, users);
    }

    return updated;
  },

  // Excluir aluno
  async deleteStudent(id: string): Promise<boolean> {
    let students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);
    let users = StorageService.get<User[]>(StorageKeys.USERS, []);

    const initialLen = students.length;
    students = students.filter(s => s.id !== id);
    users = users.filter(u => u.id !== id);

    if (students.length !== initialLen) {
      StorageService.set(StorageKeys.STUDENTS, students);
      StorageService.set(StorageKeys.USERS, users);
      return true;
    }
    return false;
  }
};
