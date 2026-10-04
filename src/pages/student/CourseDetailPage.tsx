import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Clock,
  BookOpen,
  Award,
  Star,
  CheckCircle2,
  Share2,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { courseService, progressService } from '../../services';
import { Course, Module, StudentProgress } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';
import { ModuleAccordion } from '../../components/streaming/ModuleAccordion';

export const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const found = await courseService.getCourseById(id);
        if (found) {
          setCourse(found);
          const mods = await courseService.getCourseModules(found.id);
          setModules(mods);

          if (user) {
            const prog = await progressService.getCourseProgress(user.id, found.id);
            setProgress(prog);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [id, user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-kalin-dark">Curso não encontrado</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/app/cursos')}>
          Voltar para Cursos
        </Button>
      </div>
    );
  }

  // Descobrir a próxima aula a assistir
  const allLessons = modules.flatMap(m => m.lessons || []);
  const completedIds = progress?.completedLessonIds || [];
  const nextLesson = allLessons.find(l => !completedIds.includes(l.id)) || allLessons[0];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Course Banner Header */}
      <div className="relative bg-kalin-darksurface text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={course.bannerUrl || course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-kalin-darksurface via-kalin-darksurface/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <Link
            to="/app/cursos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-kalin-light hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar para todos os cursos</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Info Col */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-kalin-primary text-white text-xs font-bold uppercase tracking-wider">
                  {course.categoryName}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium">
                  Nível {course.level}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-gray-200 leading-relaxed max-w-2xl">
                {course.subtitle || course.description}
              </p>

              {/* Meta stats */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{course.rating.toFixed(1)}</span>
                  <span>({course.ratingsCount} avaliações)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-kalin-primary" />
                  <span>{course.durationHours}h de carga horária</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-kalin-primary" />
                  <span>{course.lessonsCount} aulas divididas em {course.modulesCount} módulos</span>
                </div>
              </div>

              {/* Instructor Pill */}
              <div className="pt-2 flex items-center gap-3">
                <img
                  src={course.teacherAvatar}
                  alt={course.teacherName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-kalin-primary"
                />
                <div>
                  <p className="text-xs text-gray-400">Ministrado por</p>
                  <p className="text-sm font-bold text-white">{course.teacherName}</p>
                </div>
              </div>
            </div>

            {/* CTA Card Col */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white space-y-4 shadow-2xl">
              {progress ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-kalin-light">Seu progresso atual</span>
                    <span className="text-kalin-primary font-bold">{progress.percentCompleted}%</span>
                  </div>
                  <ProgressBar progress={progress.percentCompleted} size="md" colorVariant="primary" />
                  <p className="text-[11px] text-gray-300">
                    {progress.completedLessonIds.length} de {course.lessonsCount} aulas concluídas
                  </p>
                </div>
              ) : (
                <div className="text-xs text-gray-300">
                  Acesso completo e irrestrito incluso no seu plano Kalin Educ.
                </div>
              )}

              {nextLesson && (
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full shadow-kalin-glow"
                  leftIcon={<Play className="w-5 h-5 fill-white" />}
                  onClick={() => navigate(`/app/aula/${nextLesson.id}`)}
                >
                  {progress && progress.percentCompleted > 0 ? 'Continuar Assistindo' : 'Iniciar Curso'}
                </Button>
              )}

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
                  <span>Certificado emitido ao atingir 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
                  <span>Materiais em PDF para download</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details and Syllabus */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Syllabus (Modules & Lessons Accordion) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight">
                Conteúdo do Curso (Currículo)
              </h2>
              <p className="text-xs text-kalin-muted mt-0.5">
                Clique nos módulos abaixo para expandir e ver as aulas.
              </p>
            </div>

            <ModuleAccordion
              modules={modules}
              completedLessonIds={progress?.completedLessonIds || []}
            />

            {/* Descrição Completa */}
            <div className="bg-white rounded-2xl p-6 border border-kalin-border shadow-kalin-sm space-y-3">
              <h3 className="text-base font-bold text-kalin-dark">Sobre esta formação</h3>
              <p className="text-sm text-kalin-muted leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>
          </div>

          {/* Right Column: Instructor Profile & Certification info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-kalin-border shadow-kalin-sm text-left">
              <h3 className="text-sm font-bold text-kalin-dark uppercase tracking-wider mb-4">
                Sobre o Instrutor
              </h3>
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={course.teacherAvatar}
                  alt={course.teacherName}
                  className="w-14 h-14 rounded-2xl object-cover border border-kalin-border"
                />
                <div>
                  <h4 className="font-bold text-kalin-dark text-base">{course.teacherName}</h4>
                  <p className="text-xs text-kalin-green font-semibold">{course.teacherRole}</p>
                </div>
              </div>
              <p className="text-xs text-kalin-muted leading-relaxed">
                Profissional com vasta atuação clínica e acadêmica, dedicado ao treinamento contínuo de fisioterapeutas com as melhores práticas mundiais.
              </p>
            </div>

            <div className="bg-kalin-light/60 rounded-2xl p-6 border border-kalin-primary/20 text-left">
              <div className="w-10 h-10 rounded-xl bg-kalin-primary text-white flex items-center justify-center mb-3 shadow-kalin-glow/40">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-kalin-dark">Certificado de Conclusão</h4>
              <p className="text-xs text-kalin-muted mt-1 leading-relaxed">
                Ao finalizar todas as aulas deste curso, um certificado oficial de {course.durationHours} horas emitido pelo Grupo Kalin estará disponível automaticamente no seu perfil.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
