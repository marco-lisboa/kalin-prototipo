import { User, Student, Teacher, Session, UserRole } from '../types';
import { StorageService, StorageKeys } from './storage';
import { initializeMockData } from './mockData';

export const authService = {
  // Login com CPF e Senha
  async login(cpf: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Normalizar CPF (remover pontuação para busca)
    const cleanCpf = cpf.trim();
    const formattedCpf = cleanCpf.length === 11 && !cleanCpf.includes('.')
      ? `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`
      : cleanCpf;

    const credsMap = StorageService.get<Record<string, { password: string; role: UserRole; userId: string }>>(
      `${StorageKeys.USERS}_creds`,
      {}
    );

    const userCred = credsMap[formattedCpf] || credsMap[cleanCpf];

    if (!userCred) {
      return { success: false, error: 'CPF não encontrado no sistema.' };
    }

    if (userCred.password !== password) {
      return { success: false, error: 'Senha incorreta. Verifique suas credenciais.' };
    }

    // Buscar usuário completo
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);
    const user = users.find(u => u.id === userCred.userId || u.cpf === formattedCpf || u.cpf === cleanCpf);

    if (!user) {
      return { success: false, error: 'Usuário não localizado na base de dados.' };
    }

    if (user.status === 'inactive') {
      return { success: false, error: 'Conta inativa. Entre em contato com o suporte.' };
    }

    // Criar e salvar sessão
    const session: Session = {
      user,
      token: `kalin_mock_token_${Date.now()}_${user.id}`,
      loginAt: new Date().toISOString()
    };

    StorageService.set(StorageKeys.SESSION, session);

    return { success: true, user };
  },

  // Cadastro de novo Aluno
  async registerStudent(data: {
    name: string;
    cpf: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    const cleanCpf = data.cpf.trim();
    const formattedCpf = cleanCpf.length === 11 && !cleanCpf.includes('.')
      ? `${cleanCpf.slice(0, 3)}.${cleanCpf.slice(3, 6)}.${cleanCpf.slice(6, 9)}-${cleanCpf.slice(9, 11)}`
      : cleanCpf;

    const users = StorageService.get<User[]>(StorageKeys.USERS, []);
    const students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);

    // Validar se CPF ou email já existem
    if (users.some(u => u.cpf === formattedCpf || u.cpf === cleanCpf)) {
      return { success: false, error: 'Já existe um cadastro com este CPF.' };
    }

    if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este e-mail já está cadastrado.' };
    }

    const newStudentId = `student-${Date.now()}`;
    const newStudent: Student = {
      id: newStudentId,
      name: data.name.trim(),
      cpf: formattedCpf,
      email: data.email.trim(),
      role: 'student',
      status: 'active',
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80`,
      enrolledCourseIds: ['course-neuro-1', 'course-esportiva-1'], // matricula padrão em cursos vitrine
      createdAt: new Date().toISOString().split('T')[0]
    };

    // Salvar nas listas
    students.push(newStudent);
    users.push(newStudent);
    StorageService.set(StorageKeys.STUDENTS, students);
    StorageService.set(StorageKeys.USERS, users);

    // Salvar credenciais
    const credsMap = StorageService.get<Record<string, { password: string; role: UserRole; userId: string }>>(
      `${StorageKeys.USERS}_creds`,
      {}
    );
    credsMap[formattedCpf] = {
      password: data.password,
      role: 'student',
      userId: newStudentId
    };
    StorageService.set(`${StorageKeys.USERS}_creds`, credsMap);

    // Salvar sessão automática
    const session: Session = {
      user: newStudent,
      token: `kalin_mock_token_${Date.now()}_${newStudent.id}`,
      loginAt: new Date().toISOString()
    };
    StorageService.set(StorageKeys.SESSION, session);

    return { success: true, user: newStudent };
  },

  // Obter sessão atual
  getCurrentSession(): Session | null {
    return StorageService.get<Session | null>(StorageKeys.SESSION, null);
  },

  // Obter usuário logado atual
  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  },

  // Logout
  async logout(): Promise<void> {
    StorageService.remove(StorageKeys.SESSION);
  },

  // Atualizar dados de perfil
  async updateProfile(userId: string, data: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    const users = StorageService.get<User[]>(StorageKeys.USERS, []);
    const index = users.findIndex(u => u.id === userId);

    if (index === -1) {
      return { success: false, error: 'Usuário não encontrado.' };
    }

    const updatedUser = { ...users[index], ...data };
    users[index] = updatedUser;
    StorageService.set(StorageKeys.USERS, users);

    // Atualizar no array correspondente de student ou teacher
    if (updatedUser.role === 'student') {
      const students = StorageService.get<Student[]>(StorageKeys.STUDENTS, []);
      const sIndex = students.findIndex(s => s.id === userId);
      if (sIndex !== -1) {
        students[sIndex] = { ...students[sIndex], ...data } as Student;
        StorageService.set(StorageKeys.STUDENTS, students);
      }
    } else if (updatedUser.role === 'teacher') {
      const teachers = StorageService.get<Teacher[]>(StorageKeys.TEACHERS, []);
      const tIndex = teachers.findIndex(t => t.id === userId);
      if (tIndex !== -1) {
        teachers[tIndex] = { ...teachers[tIndex], ...data } as Teacher;
        StorageService.set(StorageKeys.TEACHERS, teachers);
      }
    }

    // Atualizar sessão se for o usuário corrente
    const session = this.getCurrentSession();
    if (session && session.user.id === userId) {
      session.user = updatedUser;
      StorageService.set(StorageKeys.SESSION, session);
    }

    return { success: true, user: updatedUser };
  },

  // Reset completo de dados para testes
  resetMockData(): void {
    initializeMockData(true);
  }
};
