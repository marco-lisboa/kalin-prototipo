import {
  User,
  Student,
  Teacher,
  Category,
  Course,
  Module,
  Lesson,
  StudentProgress,
  ActivityLog
} from '../types';
import { StorageService, StorageKeys } from './storage';

// 8 Especialidades Oficiais Kalin Educ
export const initialCategories: Category[] = [
  {
    id: 'cat-neuro',
    name: 'Fisioterapia Neurofuncional',
    slug: 'neurofuncional',
    description: 'Reabilitação do sistema nervoso central e periférico em adultos e neuropediatria.',
    iconName: 'Brain',
    color: '#16A63A',
    coursesCount: 3,
    isActive: true,
    order: 1
  },
  {
    id: 'cat-esportiva',
    name: 'Fisioterapia Esportiva',
    slug: 'esportiva',
    description: 'Prevenção de lesões, reabilitação acelerada e otimização da performance de atletas.',
    iconName: 'Activity',
    color: '#0B6B18',
    coursesCount: 2,
    isActive: true,
    order: 2
  },
  {
    id: 'cat-pediatrica',
    name: 'Fisioterapia Pediátrica',
    slug: 'pediatrica',
    description: 'Estímulo ao neurodesenvolvimento motor, intervenção precoce e postura na infância.',
    iconName: 'Baby',
    color: '#20B26C',
    coursesCount: 2,
    isActive: true,
    order: 3
  },
  {
    id: 'cat-traumato',
    name: 'Fisioterapia Traumato-Ortopédica',
    slug: 'traumato-ortopedica',
    description: 'Diagnóstico cinesiológico, terapia manual e reeducação biomecânica osteomioarticular.',
    iconName: 'Bone',
    color: '#193027',
    coursesCount: 3,
    isActive: true,
    order: 4
  },
  {
    id: 'cat-gerontologica',
    name: 'Fisioterapia Gerontológica',
    slug: 'gerontologica',
    description: 'Manutenção da funcionalidade, autonomia e prevenção de quedas na terceira idade.',
    iconName: 'HeartPulse',
    color: '#2E7D32',
    coursesCount: 1,
    isActive: true,
    order: 5
  },
  {
    id: 'cat-respiratoria',
    name: 'Fisioterapia Respiratória',
    slug: 'respiratoria',
    description: 'Higiene brônquica, reexpansão pulmonar e suporte ventilatório não invasivo.',
    iconName: 'Wind',
    color: '#00897B',
    coursesCount: 2,
    isActive: true,
    order: 6
  },
  {
    id: 'cat-cardio',
    name: 'Fisioterapia Cardiorrespiratória',
    slug: 'cardiorrespiratoria',
    description: 'Condicionamento cardiovascular, pós-infarto e reabilitação de cardiopatas graves.',
    iconName: 'Heart',
    color: '#C62828',
    coursesCount: 1,
    isActive: true,
    order: 7
  },
  {
    id: 'cat-hospitalar',
    name: 'Fisioterapia Hospitalar',
    slug: 'hospitalar',
    description: 'Mobilização precoce em enfermaria e terapia intensiva (UTI) com segurança.',
    iconName: 'Building2',
    color: '#0288D1',
    coursesCount: 2,
    isActive: true,
    order: 8
  }
];

// 5 Professores Especialistas
export const initialTeachers: Teacher[] = [
  {
    id: 'prof-1',
    name: 'Prof. Dr. Rafael Almeida',
    cpf: '111.111.111-11',
    email: 'rafael.almeida@kalineduc.com.br',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    title: 'Doutor em Neurociências e Reabilitação Motora',
    bio: 'Mais de 15 anos de experiência clínica no tratamento de sequelas do AVC e doenças neurodegenerativas.',
    specialty: 'Fisioterapia Neurofuncional',
    specialtyId: 'cat-neuro',
    taughtCourseIds: ['course-neuro-1', 'course-hospitalar-1'],
    totalStudents: 412,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'prof-2',
    name: 'Profa. Dra. Carolina Vasconcelos',
    cpf: '222.222.222-22',
    email: 'carolina.vasconcelos@kalineduc.com.br',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1594824813583-0975fa985834?w=300&auto=format&fit=crop&q=80',
    title: 'Fisioterapeuta Olímpica e Doutora em Biomecânica',
    bio: 'Especialista em recuperação funcional de atletas de alto rendimento e prevenção de lesões miotendíneas.',
    specialty: 'Fisioterapia Esportiva',
    specialtyId: 'cat-esportiva',
    taughtCourseIds: ['course-esportiva-1'],
    totalStudents: 380,
    status: 'active',
    createdAt: '2024-02-10'
  },
  {
    id: 'prof-3',
    name: 'Prof. Me. Bruno Castilho',
    cpf: '333.333.333-33',
    email: 'bruno.castilho@kalineduc.com.br',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    title: 'Mestre em Ortopedia e Especialista em Terapia Manual',
    bio: 'Docente de pós-graduação e clínico especialista em reabilitação de joelho, quadril e coluna vertebral.',
    specialty: 'Fisioterapia Traumato-Ortopédica',
    specialtyId: 'cat-traumato',
    taughtCourseIds: ['course-traumato-1'],
    totalStudents: 295,
    status: 'active',
    createdAt: '2024-02-28'
  },
  {
    id: 'prof-4',
    name: 'Profa. Esp. Fernanda Duarte',
    cpf: '444.444.444-44',
    email: 'fernanda.duarte@kalineduc.com.br',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    title: 'Especialista em Fisioterapia Pediátrica e Método Bobath',
    bio: 'Referência nacional em intervenção precoce em bebês de risco e paralisia cerebral infantil.',
    specialty: 'Fisioterapia Pediátrica',
    specialtyId: 'cat-pediatrica',
    taughtCourseIds: ['course-pediatrica-1'],
    totalStudents: 184,
    status: 'active',
    createdAt: '2024-03-05'
  },
  {
    id: 'prof-5',
    name: 'Prof. Dr. Marcos Vinicius Silveira',
    cpf: '555.555.555-55',
    email: 'marcos.silveira@kalineduc.com.br',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
    title: 'Doutor em Ciências Pneumológicas e Fisioterapeuta Intensivista',
    bio: 'Coordenador de UTI Adulto e pesquisador em desmame ventilatório complexo e PEEP ideal.',
    specialty: 'Fisioterapia Respiratória',
    specialtyId: 'cat-respiratoria',
    taughtCourseIds: ['course-respiratoria-1', 'course-gerontologica-1'],
    totalStudents: 310,
    status: 'active',
    createdAt: '2024-03-12'
  }
];

// Super Admin
export const initialAdmin: User = {
  id: 'admin-1',
  name: 'Dr. Kalin',
  cpf: '000.000.000-00',
  email: 'kalin@grupokalin.com.br',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1712215544003-af10130f8eb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRvdXRvcnxlbnwwfHwwfHx8MA%3D%3D0',
  title: 'Diretor Geral de Educação - Grupo Kalin',
  status: 'active',
  createdAt: '2024-01-01'
};

// 10 Alunos Mockados
export const initialStudents: Student[] = [
  {
    id: 'student-1',
    name: 'Lucas Ferreira',
    cpf: '123.456.789-00',
    email: 'lucas.aluno@kalineduc.com.br',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-neuro-1', 'course-esportiva-1', 'course-traumato-1'],
    createdAt: '2024-04-10'
  },
  {
    id: 'student-2',
    name: 'Mariana Costa Mendes',
    cpf: '234.567.890-11',
    email: 'mariana.costa@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-neuro-1', 'course-pediatrica-1'],
    createdAt: '2024-04-12'
  },
  {
    id: 'student-3',
    name: 'Rodrigo Mendes Siqueira',
    cpf: '345.678.901-22',
    email: 'rodrigo.siqueira@hotmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-esportiva-1', 'course-traumato-1'],
    createdAt: '2024-04-15'
  },
  {
    id: 'student-4',
    name: 'Beatriz Albuquerque Lima',
    cpf: '456.789.012-33',
    email: 'beatriz.lima@yahoo.com.br',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-respiratoria-1', 'course-gerontologica-1'],
    createdAt: '2024-04-18'
  },
  {
    id: 'student-5',
    name: 'Thiago Martins Carvalho',
    cpf: '567.890.123-44',
    email: 'thiago.martins@outlook.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-traumato-1'],
    createdAt: '2024-04-20'
  },
  {
    id: 'student-6',
    name: 'Camila Rodrigues Paes',
    cpf: '678.901.234-55',
    email: 'camila.paes@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-pediatrica-1', 'course-neuro-1'],
    createdAt: '2024-04-22'
  },
  {
    id: 'student-7',
    name: 'Gabriel Soares Nogueira',
    cpf: '789.012.345-66',
    email: 'gabriel.soares@uol.com.br',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-esportiva-1'],
    createdAt: '2024-04-25'
  },
  {
    id: 'student-8',
    name: 'Juliana Nogueira Ramos',
    cpf: '890.123.456-77',
    email: 'juliana.ramos@terra.com.br',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-gerontologica-1', 'course-traumato-1'],
    createdAt: '2024-04-28'
  },
  {
    id: 'student-9',
    name: 'Felipe Antunes Barreto',
    cpf: '901.234.567-88',
    email: 'felipe.antunes@icloud.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    status: 'active',
    enrolledCourseIds: ['course-respiratoria-1', 'course-neuro-1'],
    createdAt: '2024-05-02'
  },
  {
    id: 'student-10',
    name: 'Larissa Peixoto Faria',
    cpf: '012.345.678-99',
    email: 'larissa.peixoto@gmail.com',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
    status: 'inactive',
    enrolledCourseIds: ['course-esportiva-1'],
    createdAt: '2024-05-05'
  }
];

// 6 Cursos Completos
export const initialCourses: Course[] = [
  {
    id: 'course-neuro-1',
    title: 'Formação em Fisioterapia Neurofuncional',
    slug: 'fisioterapia-neurofuncional',
    subtitle: 'Da Avaliação Clínica ao Tratamento Baseado em Evidências',
    description: 'Aprenda com especialistas e desenvolva sua prática profissional através de conteúdos completos e atualizados sobre AVC, Doença de Parkinson, Traumatismo Cranioencefálico e Lesão Medular.',
    categoryId: 'cat-neuro',
    categoryName: 'Fisioterapia Neurofuncional',
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    teacherRole: 'Doutor em Neurociências (USP)',
    teacherAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&auto=format&fit=crop&q=80',
    durationHours: 32,
    level: 'Especialização',
    featured: true, // HERO COURSE!
    isNew: false,
    rating: 4.9,
    ratingsCount: 238,
    studentsCount: 412,
    modulesCount: 4,
    lessonsCount: 8,
    status: 'published',
    tags: ['Neurofuncional', 'AVC', 'Parkinson', 'Neuroplasticidade'],
    createdAt: '2024-01-20',
    certificateProvided: true
  },
  {
    id: 'course-esportiva-1',
    title: 'Fisioterapia Esportiva na Prática',
    slug: 'fisioterapia-esportiva-pratica',
    subtitle: 'Prevenção de Lesões, Biomecânica e Return to Play',
    description: 'Domine protocolos modernos de reabilitação de ligamento cruzado anterior (LCA), lesões musculares isquiotibiais e critérios objetivos para alta esportiva.',
    categoryId: 'cat-esportiva',
    categoryName: 'Fisioterapia Esportiva',
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    teacherRole: 'Fisioterapeuta Olímpica',
    teacherAvatar: 'https://images.unsplash.com/photo-1594824813583-0975fa985834?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1600&auto=format&fit=crop&q=80',
    durationHours: 24,
    level: 'Avançado',
    featured: false,
    isNew: true,
    rating: 4.8,
    ratingsCount: 194,
    studentsCount: 380,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    tags: ['Esporte', 'LCA', 'Biomecânica', 'Reabilitação'],
    createdAt: '2024-02-15',
    certificateProvided: true
  },
  {
    id: 'course-traumato-1',
    title: 'Avaliação e Tratamento Traumato-Ortopédico',
    slug: 'avaliacao-traumato-ortopedica',
    subtitle: 'Raciocínio Clínico e Terapia Manual Aplicada',
    description: 'Capacite-se para diagnosticar disfunções biomecânicas da coluna e extremidades, dominando testes ortopédicos e técnicas manipulativas de alta eficácia.',
    categoryId: 'cat-traumato',
    categoryName: 'Fisioterapia Traumato-Ortopédica',
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    teacherRole: 'Mestre em Traumato-Ortopedia',
    teacherAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1600&auto=format&fit=crop&q=80',
    durationHours: 28,
    level: 'Intermediário',
    featured: false,
    isNew: false,
    rating: 4.9,
    ratingsCount: 167,
    studentsCount: 295,
    modulesCount: 3,
    lessonsCount: 6,
    status: 'published',
    tags: ['Ortopedia', 'Coluna', 'Terapia Manual', 'Testes Clínicos'],
    createdAt: '2024-03-01',
    certificateProvided: true
  },
  {
    id: 'course-pediatrica-1',
    title: 'Fundamentos da Fisioterapia Pediátrica',
    slug: 'fundamentos-fisioterapia-pediatrica',
    subtitle: 'Desenvolvimento Motor e Intervenção Precoce',
    description: 'Abordagem neuroevolutiva, estimulação precoce em prematuros, triagem com Alberta Infant Motor Scale (AIMS) e tratamento lúdico funcional.',
    categoryId: 'cat-pediatrica',
    categoryName: 'Fisioterapia Pediátrica',
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    teacherRole: 'Especialista em Pediatria Bobath',
    teacherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1600&auto=format&fit=crop&q=80',
    durationHours: 20,
    level: 'Intermediário',
    featured: false,
    isNew: true,
    rating: 4.7,
    ratingsCount: 112,
    studentsCount: 184,
    modulesCount: 3,
    lessonsCount: 5,
    status: 'published',
    tags: ['Pediatria', 'Bobath', 'Bebês', 'Desenvolvimento'],
    createdAt: '2024-03-10',
    certificateProvided: true
  },
  {
    id: 'course-respiratoria-1',
    title: 'Fisioterapia Respiratória e Ventilação Mecânica na UTI',
    slug: 'respiratoria-ventilacao-mecanica',
    subtitle: 'Gestão da Insuficiência Respiratória e Desmame',
    description: 'Conceitos avançados de mecânica ventilatória, curvas de fluxo/pressão, manobras de recrutamento alveolar e fisioterapia na COVID-19/SARA.',
    categoryId: 'cat-respiratoria',
    categoryName: 'Fisioterapia Respiratória',
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    teacherRole: 'Intensivista Titular',
    teacherAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1600&auto=format&fit=crop&q=80',
    durationHours: 26,
    level: 'Avançado',
    featured: false,
    isNew: false,
    rating: 4.9,
    ratingsCount: 205,
    studentsCount: 310,
    modulesCount: 3,
    lessonsCount: 5,
    status: 'published',
    tags: ['Respiratória', 'UTI', 'Ventilação', 'Gasometria'],
    createdAt: '2024-03-20',
    certificateProvided: true
  },
  {
    id: 'course-gerontologica-1',
    title: 'Reabilitação Gerontológica e Prevenção de Quedas',
    slug: 'reabilitacao-gerontologica-quedas',
    subtitle: 'Autonomia, Equilíbrio e Preservação Cognitiva',
    description: 'Estratégias científicas para avaliação do risco de quedas (Timed Up and Go, Berg), sarcopenia e treino de dupla-tarefa em idosos longevos.',
    categoryId: 'cat-gerontologica',
    categoryName: 'Fisioterapia Gerontológica',
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    teacherRole: 'Intensivista e Gerontologista',
    teacherAvatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=1600&auto=format&fit=crop&q=80',
    durationHours: 18,
    level: 'Iniciante',
    featured: false,
    isNew: true,
    rating: 4.8,
    ratingsCount: 98,
    studentsCount: 156,
    modulesCount: 2,
    lessonsCount: 4,
    status: 'published',
    tags: ['Idosos', 'Equilíbrio', 'Sarcopenia', 'Prevenção'],
    createdAt: '2024-04-01',
    certificateProvided: true
  }
];

// Módulos
export const initialModules: Module[] = [
  // Módulos Curso Neurofuncional (course-neuro-1)
  {
    id: 'mod-neuro-1',
    courseId: 'course-neuro-1',
    title: 'Módulo 01: Fundamentos da Neuroplasticidade e Avaliação',
    description: 'Bases biológicas da recuperação motora e protocolos de anamnese neurológica.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-neuro-2',
    courseId: 'course-neuro-1',
    title: 'Módulo 02: Acidente Vascular Cerebral (AVC) e Reabilitação Motora',
    description: 'Controle de tônus, espasticidade, facilitação neuromuscular e treino de marcha.',
    order: 2,
    lessons: []
  },
  {
    id: 'mod-neuro-3',
    courseId: 'course-neuro-1',
    title: 'Módulo 03: Doença de Parkinson e Distúrbios do Movimento',
    description: 'Estratégias de pistas visuais/auditivas e treino de equilíbrio dinâmico.',
    order: 3,
    lessons: []
  },
  {
    id: 'mod-neuro-4',
    courseId: 'course-neuro-1',
    title: 'Módulo 04: Lesão Medular e Tecnologias Assistivas',
    description: 'Níveis neurológicos ASIA, transferências e readaptação funcional.',
    order: 4,
    lessons: []
  },

  // Módulos Curso Esportiva (course-esportiva-1)
  {
    id: 'mod-esp-1',
    courseId: 'course-esportiva-1',
    title: 'Módulo 01: Biomecânica do Gesto Esportivo e Prevenção',
    description: 'Análise de movimento 2D/3D e fatores de risco para lesões sem contato.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-esp-2',
    courseId: 'course-esportiva-1',
    title: 'Módulo 02: Reabilitação do Ligamento Cruzado Anterior (LCA)',
    description: 'Fases da reabilitação pós-cirúrgica, ganho de ADM e fortalecimento excêntrico.',
    order: 2,
    lessons: []
  },
  {
    id: 'mod-esp-3',
    courseId: 'course-esportiva-1',
    title: 'Módulo 03: Testes de Saltos e Critérios de Return to Sport',
    description: 'Bateria de Hop Tests, índice de simetria do membro (LSI) e liberação segura.',
    order: 3,
    lessons: []
  },

  // Módulos Curso Traumato (course-traumato-1)
  {
    id: 'mod-trauma-1',
    courseId: 'course-traumato-1',
    title: 'Módulo 01: Raciocínio Clínico na Coluna Vertebral',
    description: 'Maitland, McKenzie e diferenciação entre dor discogênica e facetária.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-trauma-2',
    courseId: 'course-traumato-1',
    title: 'Módulo 02: Complexo do Ombro e Manguito Rotador',
    description: 'Discinesia escapular, tendinopatias e exercícios de controle motor.',
    order: 2,
    lessons: []
  },
  {
    id: 'mod-trauma-3',
    courseId: 'course-traumato-1',
    title: 'Módulo 03: Joelho e Tornozelo: Avaliação Articular',
    description: 'Entorses recorrentes de tornozelo, dor femoropatelar e bandagens elásticas.',
    order: 3,
    lessons: []
  },

  // Módulos Pediatria (course-pediatrica-1)
  {
    id: 'mod-ped-1',
    courseId: 'course-pediatrica-1',
    title: 'Módulo 01: Marcos do Desenvolvimento Motor Típico',
    description: 'Controle cefálico, rolar, sentar, engatinhar e marcha inicial.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-ped-2',
    courseId: 'course-pediatrica-1',
    title: 'Módulo 02: Escalas de Avaliação Pediátrica (AIMS e GMFM)',
    description: 'Aplicação prática e interpretação percentilar para detecção de atrasos.',
    order: 2,
    lessons: []
  },
  {
    id: 'mod-ped-3',
    courseId: 'course-pediatrica-1',
    title: 'Módulo 03: Intervenção Precoce e Método Bobath Pediátrico',
    description: 'Manuseios facilitadores, dissociação de cinturas e integração sensorial.',
    order: 3,
    lessons: []
  },

  // Módulos Respiratória (course-respiratoria-1)
  {
    id: 'mod-resp-1',
    courseId: 'course-respiratoria-1',
    title: 'Módulo 01: Fisiologia Pulmonar e Gasometria Arterial',
    description: 'Troca gasosa, ventilação/perfusão e interpretação rápida à beira leito.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-resp-2',
    courseId: 'course-respiratoria-1',
    title: 'Módulo 02: Modos Ventilatórios Básicos e Avançados',
    description: 'VCV, PCV, PSV e titulação de PEEP decremental.',
    order: 2,
    lessons: []
  },
  {
    id: 'mod-resp-3',
    courseId: 'course-respiratoria-1',
    title: 'Módulo 03: Manobras de Higiene Brônquica e Desmame',
    description: 'Aspiração em circuito fechado, índice de Tobin e extubação segura.',
    order: 3,
    lessons: []
  },

  // Módulos Gerontologia (course-gerontologica-1)
  {
    id: 'mod-gero-1',
    courseId: 'course-gerontologica-1',
    title: 'Módulo 01: Senescência vs Senilidade e Risco de Queda',
    description: 'Alterações fisiológicas no idoso e aplicação de testes preditivos.',
    order: 1,
    lessons: []
  },
  {
    id: 'mod-gero-2',
    courseId: 'course-gerontologica-1',
    title: 'Módulo 02: Prescrição de Exercícios para Força e Equilíbrio',
    description: 'Treino resistido progressivo, dupla-tarefa cognitiva e ambiente seguro.',
    order: 2,
    lessons: []
  }
];

// 34 Aulas Detalhadas (Com Materiais, Vídeo Demo, Duração e Tópicos)
// Video de demonstração estável em MP4 para HTML5 Player
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const initialLessons: Lesson[] = [
  // Aulas Curso Neurofuncional - Módulo 1
  {
    id: 'les-neuro-101',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-1',
    title: 'Introdução à Fisioterapia Neurofuncional',
    description: 'Visão geral da neuroplasticidade dependente do uso, princípios modernos de aprendizagem motora e apresentação da metodologia clínica do Grupo Kalin.',
    durationMinutes: 28,
    durationFormatted: '28 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 1420,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-01-22',
    materials: [
      { id: 'mat-1', title: 'Apostila Completa - Fundamentos de Neurofuncional.pdf', type: 'pdf', size: '4.2 MB', url: '#' },
      { id: 'mat-2', title: 'Artigo de Referência - Plasticidade Cerebral e Recuperação.pdf', type: 'pdf', size: '1.8 MB', url: '#' },
      { id: 'mat-3', title: 'Ficha Clínica de Anamnese Neurológica.pdf', type: 'pdf', size: '890 KB', url: '#' }
    ]
  },
  {
    id: 'les-neuro-102',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-1',
    title: 'Avaliação Neurológica e Raciocínio Clínico',
    description: 'Exame de reflexos tendinosos profundos, coordenação motora (index-nariz, diadococinesia), sensibilidade superficial/profunda e avaliação funcional da marcha.',
    durationMinutes: 34,
    durationFormatted: '34 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 1105,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-01-25',
    materials: [
      { id: 'mat-4', title: 'Guia de Exame Neurológico Prático.pdf', type: 'pdf', size: '2.5 MB', url: '#' },
      { id: 'mat-5', title: 'Escala de Ashworth Modificada e Tardieu.pdf', type: 'pdf', size: '640 KB', url: '#' }
    ]
  },

  // Aulas Curso Neurofuncional - Módulo 2 (AVC)
  {
    id: 'les-neuro-201',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-2',
    title: 'Acidente Vascular Cerebral: Fisiopatologia e Fase Aguda',
    description: 'Diferenças entre AVC Isquêmico e Hemorrágico, zonas de penumbra isquêmica, cuidados hemodinâmicos e intervenção precoce no leito hospitalar.',
    durationMinutes: 42,
    durationFormatted: '42 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 950,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-01-28',
    materials: [
      { id: 'mat-6', title: 'Protocolo de Mobilização Precoce no AVC.pdf', type: 'pdf', size: '3.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-neuro-202',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-2',
    title: 'Manejo da Espasticidade e Facilitação Neuromuscular',
    description: 'Técnicas de inibição de padrões sinérgicos patológicos, uso de órteses dinâmicas, posicionamento terapêutico e treino específico de tarefa.',
    durationMinutes: 39,
    durationFormatted: '39 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 880,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-02-02',
    materials: [
      { id: 'mat-7', title: 'Manual de Facilitação Neuromuscular Proprioceptiva (FNP).pdf', type: 'pdf', size: '5.2 MB', url: '#' }
    ]
  },

  // Aulas Curso Neurofuncional - Módulo 3 (Parkinson)
  {
    id: 'les-neuro-301',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-3',
    title: 'Fisiopatologia da Doença de Parkinson e Estadiamento',
    description: 'Degeneração da substância negra, vias dopaminérgicas diretas e indiretas, bradicinesia, rigidez plástica e aplicação da escala UPDRS.',
    durationMinutes: 35,
    durationFormatted: '35 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 740,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-02-08',
    materials: [
      { id: 'mat-8', title: 'Escala Hoehn and Yahr e UPDRS Prática.pdf', type: 'pdf', size: '1.4 MB', url: '#' }
    ]
  },
  {
    id: 'les-neuro-302',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-3',
    title: 'Estratégias de Cueing e Superação do Freezing na Marcha',
    description: 'Como utilizar metrônomo auditivo, faixas no piso e biofeedback visual para desbloquear congelamento motor em pacientes com Parkinson.',
    durationMinutes: 31,
    durationFormatted: '31 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 690,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-02-14',
    materials: [
      { id: 'mat-9', title: 'Guia de Exercícios de Pistas Sensoriais.pdf', type: 'pdf', size: '2.9 MB', url: '#' }
    ]
  },

  // Aulas Curso Neurofuncional - Módulo 4 (Lesão Medular)
  {
    id: 'les-neuro-401',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-4',
    title: 'Lesão Medular: Avaliação ASIA e Nível Motor',
    description: 'Classificação internacional dos déficits neurológicos causados por lesão medular, pontos-chave sensitivos e grupos musculares chave.',
    durationMinutes: 45,
    durationFormatted: '45 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 610,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-02-20',
    materials: [
      { id: 'mat-10', title: 'Formulário Oficial ASIA em Português.pdf', type: 'pdf', size: '1.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-neuro-402',
    courseId: 'course-neuro-1',
    moduleId: 'mod-neuro-4',
    title: 'Treino de Transferências e Independência Funcional',
    description: 'Biomecânica das transferências leito-cadeira, uso de prancha deslizante, propulsão de cadeira de rodas e prevenção de lesões por pressão.',
    durationMinutes: 38,
    durationFormatted: '38 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 560,
    teacherId: 'prof-1',
    teacherName: 'Prof. Dr. Rafael Almeida',
    createdAt: '2024-02-25',
    materials: [
      { id: 'mat-11', title: 'Manual de Cuidados Posturais e Transferências.pdf', type: 'pdf', size: '3.6 MB', url: '#' }
    ]
  },

  // Aulas Curso Esportiva (course-esportiva-1)
  {
    id: 'les-esp-101',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-1',
    title: 'Biomecânica do Gesto Esportivo e Cinemática',
    description: 'Identificação de valgo dinâmico em aterrizagens, momento adutor do joelho e assimetrias de carga no ciclo corrida-salto.',
    durationMinutes: 33,
    durationFormatted: '33 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 890,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-02-18',
    materials: [
      { id: 'mat-esp-1', title: 'Checklist de Avaliação Cinemática 2D.pdf', type: 'pdf', size: '2.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-esp-102',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-1',
    title: 'Treinamento Neuromuscular Preventivo (FIFA 11+)',
    description: 'Implementação de aquecimento neuromuscular estruturado para redução de até 50% de lesões de joelho e tornozelo no futebol e basquete.',
    durationMinutes: 29,
    durationFormatted: '29 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 780,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-02-22',
    materials: [
      { id: 'mat-esp-2', title: 'Manual FIFA 11+ Ilustrado.pdf', type: 'pdf', size: '4.8 MB', url: '#' }
    ]
  },
  {
    id: 'les-esp-201',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-2',
    title: 'Reabilitação do LCA: Da Cirurgia ao 3º Mês',
    description: 'Controle de derrame articular, ativação de quadríceps em cadeia cinética aberta com segurança e restabelecimento da extensão completa.',
    durationMinutes: 46,
    durationFormatted: '46 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 920,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-03-01',
    materials: [
      { id: 'mat-esp-3', title: 'Protocolo Pós-Op LCA Baseado em Evidências.pdf', type: 'pdf', size: '3.3 MB', url: '#' }
    ]
  },
  {
    id: 'les-esp-202',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-2',
    title: 'Fortalecimento Excêntrico e Pliometria Gradual',
    description: 'Exercícios nórdicos de isquiotibiais, agachamento búlgaro com carga, saltos unilaterais e progressão de aterrissagem suave.',
    durationMinutes: 37,
    durationFormatted: '37 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 710,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-03-08',
    materials: [
      { id: 'mat-esp-4', title: 'Tabela de Progressão de Cargas Pliométricas.pdf', type: 'pdf', size: '1.7 MB', url: '#' }
    ]
  },
  {
    id: 'les-esp-301',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-3',
    title: 'Bateria de Hop Tests e Simetria Muscular (LSI)',
    description: 'Single Hop, Triple Hop, Crossover Hop e 6-Meter Timed Hop: mensuração, cálculo do LSI (>90%) e análise qualitativa do movimento.',
    durationMinutes: 35,
    durationFormatted: '35 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 640,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-03-15',
    materials: [
      { id: 'mat-esp-5', title: 'Planilha de Cálculo do Limiar LSI.pdf', type: 'pdf', size: '820 KB', url: '#' }
    ]
  },
  {
    id: 'les-esp-302',
    courseId: 'course-esportiva-1',
    moduleId: 'mod-esp-3',
    title: 'Critérios Psicológicos e Clínicos para o Return to Play',
    description: 'Aplicação da escala ACL-RSI (prontidão psicológica), avaliação de medo de relesão (kinesiofobia) e liberação multidisciplinar.',
    durationMinutes: 32,
    durationFormatted: '32 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 590,
    teacherId: 'prof-2',
    teacherName: 'Profa. Dra. Carolina Vasconcelos',
    createdAt: '2024-03-22',
    materials: [
      { id: 'mat-esp-6', title: 'Questionário ACL-RSI Validado em Português.pdf', type: 'pdf', size: '940 KB', url: '#' }
    ]
  },

  // Aulas Curso Traumato-Ortopédica (course-traumato-1)
  {
    id: 'les-trauma-101',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-1',
    title: 'Diagnóstico Cinesiológico da Coluna Lombar',
    description: 'Testes de compressão/distração, teste de elevação da perna retificada (Lasègue), Slump Test e identificação de bandeiras vermelhas.',
    durationMinutes: 36,
    durationFormatted: '36 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 710,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-03-05',
    materials: [
      { id: 'mat-trauma-1', title: 'Guia de Red Flags na Dor Lombar.pdf', type: 'pdf', size: '1.5 MB', url: '#' }
    ]
  },
  {
    id: 'les-trauma-102',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-1',
    title: 'Terapia Manual e Mobilização Articular Maitland',
    description: 'Graus I a IV de mobilização posterior-anterior lombar, alívio de dor e ganho de amplitude segmentar.',
    durationMinutes: 40,
    durationFormatted: '40 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 680,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-03-12',
    materials: [
      { id: 'mat-trauma-2', title: 'Fundamentos Práticos do Conceito Maitland.pdf', type: 'pdf', size: '3.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-trauma-201',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-2',
    title: 'Avaliação da Discinesia Escapular e Conflito Subacromial',
    description: 'Testes de Neer, Hawkins-Kennedy, Jobe e avaliação dinâmica do ritmo escapuloumeral.',
    durationMinutes: 38,
    durationFormatted: '38 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 630,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-03-18',
    materials: [
      { id: 'mat-trauma-3', title: 'Atlas de Testes Ortopédicos do Ombro.pdf', type: 'pdf', size: '4.5 MB', url: '#' }
    ]
  },
  {
    id: 'les-trauma-202',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-2',
    title: 'Exercícios de Controle Motor para o Manguito Rotador',
    description: 'Serrátil anterior, trapézio inferior, rotação externa em decúbito lateral e progressão funcional com elásticos.',
    durationMinutes: 30,
    durationFormatted: '30 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 590,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-03-24',
    materials: [
      { id: 'mat-trauma-4', title: 'Prescrição Cinesioterapêutica do Ombro.pdf', type: 'pdf', size: '2.2 MB', url: '#' }
    ]
  },
  {
    id: 'les-trauma-301',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-3',
    title: 'Dor Femoropatelar: Biomecânica do Membro Inferior',
    description: 'Relação entre fraqueza de abdutores/rotadores de quadril e sobrecarga na articulação femoropatelar.',
    durationMinutes: 34,
    durationFormatted: '34 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 540,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-03-29',
    materials: [
      { id: 'mat-trauma-5', title: 'Protocolo Clínico Dor Femoropatelar.pdf', type: 'pdf', size: '2.7 MB', url: '#' }
    ]
  },
  {
    id: 'les-trauma-302',
    courseId: 'course-traumato-1',
    moduleId: 'mod-trauma-3',
    title: 'Instabilidade Crônica do Tornozelo e Terapia Manual',
    description: 'Mobilização com movimento (MWM Mulligan) para dorsiflexão e treino proprioceptivo em superfícies instáveis.',
    durationMinutes: 31,
    durationFormatted: '31 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 480,
    teacherId: 'prof-3',
    teacherName: 'Prof. Me. Bruno Castilho',
    createdAt: '2024-04-03',
    materials: [
      { id: 'mat-trauma-6', title: 'Manual de Técnicas Mulligan no Tornozelo.pdf', type: 'pdf', size: '3.0 MB', url: '#' }
    ]
  },

  // Aulas Pediatria (course-pediatrica-1)
  {
    id: 'les-ped-101',
    courseId: 'course-pediatrica-1',
    moduleId: 'mod-ped-1',
    title: 'Marcos do Desenvolvimento Motor no Primeiro Ano de Vida',
    description: 'Linha do tempo neuroevolutiva típica do recém-nascido ao caminhar autônomo.',
    durationMinutes: 30,
    durationFormatted: '30 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 520,
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    createdAt: '2024-03-12',
    materials: [
      { id: 'mat-ped-1', title: 'Tabela Ilustrada do Desenvolvimento Motor Típico.pdf', type: 'pdf', size: '3.4 MB', url: '#' }
    ]
  },
  {
    id: 'les-ped-102',
    courseId: 'course-pediatrica-1',
    moduleId: 'mod-ped-1',
    title: 'Reflexos Primitivos e Reações Posturais',
    description: 'Moro, preensão palmar, RTCA, RTCS e desenvolvimento das reações de endireitamento e proteção.',
    durationMinutes: 28,
    durationFormatted: '28 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 460,
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    createdAt: '2024-03-18',
    materials: [
      { id: 'mat-ped-2', title: 'Guia de Avaliação dos Reflexos Primitivos.pdf', type: 'pdf', size: '2.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-ped-201',
    courseId: 'course-pediatrica-1',
    moduleId: 'mod-ped-2',
    title: 'Aplicação Prática da Escala AIMS (Alberta)',
    description: 'Pontuação em prono, supino, sentado e em pé; cálculo de percentil e rastreio precoce.',
    durationMinutes: 42,
    durationFormatted: '42 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 490,
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    createdAt: '2024-03-24',
    materials: [
      { id: 'mat-ped-3', title: 'Ficha de Pontuação AIMS Traduzida.pdf', type: 'pdf', size: '1.6 MB', url: '#' }
    ]
  },
  {
    id: 'les-ped-301',
    courseId: 'course-pediatrica-1',
    moduleId: 'mod-ped-3',
    title: 'Manuseios Bobath para Controle de Cabeça e Tronco',
    description: 'Pontos-chave proximais de controle e estimulação ativa através do brincar funcional.',
    durationMinutes: 35,
    durationFormatted: '35 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 410,
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    createdAt: '2024-03-28',
    materials: [
      { id: 'mat-ped-4', title: 'Cartilha de Orientação aos Pais e Cuidadores.pdf', type: 'pdf', size: '2.8 MB', url: '#' }
    ]
  },
  {
    id: 'les-ped-302',
    courseId: 'course-pediatrica-1',
    moduleId: 'mod-ped-3',
    title: 'Paralisia Cerebral: Classificação GMFCS e Metas Funcionais',
    description: 'Níveis de I a V, prognóstico motor e planejamento de fisioterapia focado na participação.',
    durationMinutes: 37,
    durationFormatted: '37 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 390,
    teacherId: 'prof-4',
    teacherName: 'Profa. Esp. Fernanda Duarte',
    createdAt: '2024-04-02',
    materials: [
      { id: 'mat-ped-5', title: 'Quadro Ilustrativo GMFCS-E&R.pdf', type: 'pdf', size: '1.3 MB', url: '#' }
    ]
  },

  // Aulas Respiratória (course-respiratoria-1)
  {
    id: 'les-resp-101',
    courseId: 'course-respiratoria-1',
    moduleId: 'mod-resp-1',
    title: 'Interpretação Descomplicada da Gasometria Arterial',
    description: 'pH, PaCO2, HCO3, BE e compensações ácidobásicas em pacientes agudos.',
    durationMinutes: 33,
    durationFormatted: '33 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 680,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-03-22',
    materials: [
      { id: 'mat-resp-1', title: 'Guia Rápido de Gasometria à Beira do Leito.pdf', type: 'pdf', size: '920 KB', url: '#' }
    ]
  },
  {
    id: 'les-resp-102',
    courseId: 'course-respiratoria-1',
    moduleId: 'mod-resp-1',
    title: 'Mecânica Respiratória: Complacência e Resistência',
    description: 'Medidas de Pressão de Platô, Driving Pressure e cálculos no ventilador mecânico.',
    durationMinutes: 36,
    durationFormatted: '36 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 610,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-03-26',
    materials: [
      { id: 'mat-resp-2', title: 'Fórmulas e Cálculos de Mecânica Pulmonar.pdf', type: 'pdf', size: '750 KB', url: '#' }
    ]
  },
  {
    id: 'les-resp-201',
    courseId: 'course-respiratoria-1',
    moduleId: 'mod-resp-2',
    title: 'Programação Inicial do Respirador: VCV vs PCV',
    description: 'Volume corrente protetor (6 ml/kg peso predito), sensibilidade e ciclagem.',
    durationMinutes: 44,
    durationFormatted: '44 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 570,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-03-30',
    materials: [
      { id: 'mat-resp-3', title: 'Tabela de Peso Predito e Volume Corrente Protetor.pdf', type: 'pdf', size: '610 KB', url: '#' }
    ]
  },
  {
    id: 'les-resp-202',
    courseId: 'course-respiratoria-1',
    moduleId: 'mod-resp-2',
    title: 'Assincronias Paciente-Ventilador: Reconhecimento Gráfico',
    description: 'Disparo ineficaz, duplo disparo, autociclagem e fluxo insuficiente.',
    durationMinutes: 39,
    durationFormatted: '39 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 520,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-03',
    materials: [
      { id: 'mat-resp-4', title: 'Atlas de Curvas de Assincronias Ventilatórias.pdf', type: 'pdf', size: '4.1 MB', url: '#' }
    ]
  },
  {
    id: 'les-resp-301',
    courseId: 'course-respiratoria-1',
    moduleId: 'mod-resp-3',
    title: 'Protocolo de Desmame Ventilatório e Teste de Respiração Espontânea (TRE)',
    description: 'Critérios de prontidão, índice de respiração rápida e superficial (Tobin) e cuff leak test.',
    durationMinutes: 35,
    durationFormatted: '35 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 480,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-06',
    materials: [
      { id: 'mat-resp-5', title: 'Algoritmo de Desmame e Extubação em UTI.pdf', type: 'pdf', size: '1.2 MB', url: '#' }
    ]
  },

  // Aulas Gerontologia (course-gerontologica-1)
  {
    id: 'les-gero-101',
    courseId: 'course-gerontologica-1',
    moduleId: 'mod-gero-1',
    title: 'Avaliação Multidimensional do Idoso e Teste Timed Up and Go (TUG)',
    description: 'Parâmetros preditivos de queda, velocidade de marcha e rastreio de fragilidade.',
    durationMinutes: 27,
    durationFormatted: '27 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 390,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-02',
    materials: [
      { id: 'mat-gero-1', title: 'Protocolo de Teste TUG e Escala de Berg.pdf', type: 'pdf', size: '1.9 MB', url: '#' }
    ]
  },
  {
    id: 'les-gero-102',
    courseId: 'course-gerontologica-1',
    moduleId: 'mod-gero-1',
    title: 'Sarcopenia e Dinamometria de Preensão Palmar',
    description: 'Diagnóstico EWGSOP2, perda de massa muscular x força x desempenho físico.',
    durationMinutes: 29,
    durationFormatted: '29 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 340,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-05',
    materials: [
      { id: 'mat-gero-2', title: 'Consenso Europeu de Sarcopenia Resumido.pdf', type: 'pdf', size: '2.4 MB', url: '#' }
    ]
  },
  {
    id: 'les-gero-201',
    courseId: 'course-gerontologica-1',
    moduleId: 'mod-gero-2',
    title: 'Treinamento de Equilíbrio e Dupla Tarefa Cognitivo-Motora',
    description: 'Exercícios práticos combinando marcha com cálculos mentais e fluência verbal.',
    durationMinutes: 32,
    durationFormatted: '32 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'published',
    viewsCount: 310,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-08',
    materials: [
      { id: 'mat-gero-3', title: 'Banco de Exercícios de Dupla Tarefa.pdf', type: 'pdf', size: '2.8 MB', url: '#' }
    ]
  },
  {
    id: 'les-gero-202',
    courseId: 'course-gerontologica-1',
    moduleId: 'mod-gero-2',
    title: 'Adaptação Ambiental Domiciliar para Prevenção de Quedas',
    description: 'Checklist para banheiros, iluminação noturna, retirada de tapetes e barras de apoio.',
    durationMinutes: 24,
    durationFormatted: '24 min',
    videoUrl: DEMO_VIDEO_URL,
    thumbnailUrl: 'https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'published',
    viewsCount: 280,
    teacherId: 'prof-5',
    teacherName: 'Prof. Dr. Marcos Vinicius Silveira',
    createdAt: '2024-04-10',
    materials: [
      { id: 'mat-gero-4', title: 'Manual de Segurança Domiciliar do Idoso.pdf', type: 'pdf', size: '1.7 MB', url: '#' }
    ]
  }
];

// Progresso Inicial do Aluno 'student-1' (Lucas Ferreira)
// Conforme os requisitos do prompt:
// Neurofuncional com ~72% concluído
// Esportiva com ~35% concluído
export const initialProgress: StudentProgress[] = [
  {
    userId: 'student-1',
    courseId: 'course-neuro-1',
    // 6 de 8 aulas concluídas = 75% (~72%)
    completedLessonIds: [
      'les-neuro-101',
      'les-neuro-102',
      'les-neuro-201',
      'les-neuro-202',
      'les-neuro-301',
      'les-neuro-302'
    ],
    lastLessonId: 'les-neuro-401', // Próxima aula a continuar!
    lastAccessedAt: '2026-10-02T19:30:00Z',
    percentCompleted: 75,
    totalMinutesWatched: 209
  },
  {
    userId: 'student-1',
    courseId: 'course-esportiva-1',
    // 2 de 6 aulas concluídas = 33% (~35%)
    completedLessonIds: [
      'les-esp-101',
      'les-esp-102'
    ],
    lastLessonId: 'les-esp-201',
    lastAccessedAt: '2026-10-01T15:20:00Z',
    percentCompleted: 33,
    totalMinutesWatched: 62
  },
  {
    userId: 'student-1',
    courseId: 'course-traumato-1',
    completedLessonIds: [
      'les-trauma-101'
    ],
    lastLessonId: 'les-trauma-102',
    lastAccessedAt: '2026-09-28T10:15:00Z',
    percentCompleted: 17,
    totalMinutesWatched: 36
  }
];

// Atividades Recentes Iniciais
export const initialActivities: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'student-1',
    userName: 'Lucas Ferreira',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    action: 'concluiu a aula',
    targetTitle: 'Estratégias de Cueing e Superação do Freezing na Marcha',
    timestamp: 'Há 2 horas',
    type: 'lesson_completed'
  },
  {
    id: 'act-2',
    userId: 'prof-1',
    userName: 'Prof. Dr. Rafael Almeida',
    userAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    action: 'publicou uma nova aula em',
    targetTitle: 'Formação em Fisioterapia Neurofuncional',
    timestamp: 'Há 5 horas',
    type: 'lesson_created'
  },
  {
    id: 'act-3',
    userId: 'student-2',
    userName: 'Mariana Costa',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    action: 'inscreveu-se no curso',
    targetTitle: 'Fundamentos da Fisioterapia Pediátrica',
    timestamp: 'Ontem',
    type: 'course_enrolled'
  },
  {
    id: 'act-4',
    userId: 'student-3',
    userName: 'Rodrigo Mendes',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    action: 'concluiu a aula',
    targetTitle: 'Biomecânica do Gesto Esportivo e Cinemática',
    timestamp: 'Ontem',
    type: 'lesson_completed'
  },
  {
    id: 'act-5',
    userId: 'student-10',
    userName: 'Larissa Peixoto',
    action: 'cadastrou-se na plataforma Kalin Educ',
    targetTitle: 'Novo Aluno',
    timestamp: 'Há 2 dias',
    type: 'user_registered'
  }
];

// Todos os usuários para autenticação mockada (inclui senhas em hash/plain mock)
export const initialAuthCredentials: Record<string, { password: string; role: 'student' | 'teacher' | 'admin'; userId: string }> = {
  // Super Admin
  '000.000.000-00': {
    password: 'admin123',
    role: 'admin',
    userId: 'admin-1'
  },
  // Professor Default
  '111.111.111-11': {
    password: '123456',
    role: 'teacher',
    userId: 'prof-1'
  },
  // Aluno Default
  '123.456.789-00': {
    password: '123456',
    role: 'student',
    userId: 'student-1'
  },
  // Demais Professores
  '222.222.222-22': { password: '123456', role: 'teacher', userId: 'prof-2' },
  '333.333.333-33': { password: '123456', role: 'teacher', userId: 'prof-3' },
  '444.444.444-44': { password: '123456', role: 'teacher', userId: 'prof-4' },
  '555.555.555-55': { password: '123456', role: 'teacher', userId: 'prof-5' },
  // Demais Alunos
  '234.567.890-11': { password: '123456', role: 'student', userId: 'student-2' },
  '345.678.901-22': { password: '123456', role: 'student', userId: 'student-3' },
  '456.789.012-33': { password: '123456', role: 'student', userId: 'student-4' },
  '567.890.123-44': { password: '123456', role: 'student', userId: 'student-5' },
  '678.901.234-55': { password: '123456', role: 'student', userId: 'student-6' },
  '789.012.345-66': { password: '123456', role: 'student', userId: 'student-7' },
  '890.123.456-77': { password: '123456', role: 'student', userId: 'student-8' },
  '901.234.567-88': { password: '123456', role: 'student', userId: 'student-9' },
  '012.345.678-99': { password: '123456', role: 'student', userId: 'student-10' }
};

// Função de inicialização e restauração do Mock Data
export function initializeMockData(force: boolean = false): void {
  const isInitialized = StorageService.get<boolean>(StorageKeys.INITIALIZED, false);

  if (!isInitialized || force) {
    console.log('⚡ Inicializando dados mockados Kalin Educ...');

    // Salvar Categorias
    StorageService.set(StorageKeys.CATEGORIES, initialCategories);

    // Salvar Professores
    StorageService.set(StorageKeys.TEACHERS, initialTeachers);

    // Salvar Alunos
    StorageService.set(StorageKeys.STUDENTS, initialStudents);

    // Salvar Todos os Usuários
    const allUsers: User[] = [
      initialAdmin,
      ...initialTeachers,
      ...initialStudents
    ];
    StorageService.set(StorageKeys.USERS, allUsers);

    // Salvar Credenciais
    StorageService.set(`${StorageKeys.USERS}_creds`, initialAuthCredentials);

    // Salvar Cursos
    StorageService.set(StorageKeys.COURSES, initialCourses);

    // Associar aulas aos módulos
    const populatedModules = initialModules.map(mod => ({
      ...mod,
      lessons: initialLessons.filter(les => les.moduleId === mod.id)
    }));
    StorageService.set(StorageKeys.MODULES, populatedModules);

    // Salvar Aulas
    StorageService.set(StorageKeys.LESSONS, initialLessons);

    // Salvar Progresso
    StorageService.set(StorageKeys.PROGRESS, initialProgress);

    // Salvar Atividades
    StorageService.set(StorageKeys.ACTIVITIES, initialActivities);

    // Marcar como inicializado
    StorageService.set(StorageKeys.INITIALIZED, true);

    console.log('✅ Dados mockados Kalin Educ carregados com sucesso no LocalStorage!');
  }
}
