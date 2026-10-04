import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  Users,
  Eye,
  TrendingUp,
  PlusCircle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService, lessonService, studentService } from '../../services';
import { Course, Lesson, Student } from '../../types';
import { Button } from '../../components/common/Button';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState<Course[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const teacherId = user?.id || 'prof-1';
        const allCourses = await courseService.getCourses({ teacherId });
        const allLessons = await lessonService.getLessons({ teacherId });
        const allStudents = await studentService.getStudents();

        const views = allLessons.reduce((acc, l) => acc + (l.viewsCount || 0), 0);

        setCourses(allCourses);
        setLessons(allLessons);
        setStudents(allStudents);
        setTotalViews(views || 4830);
      } catch (err) {
        console.error('Error loading teacher dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  const publishedCount = lessons.filter(l => l.status === 'published').length;

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-kalin-dark to-kalin-green text-white p-6 sm:p-8 rounded-3xl shadow-kalin-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Docência Médica Kalin Educ
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Painel do Instrutor: {user?.name || 'Prof. Dr. Rafael Almeida'}
          </h1>
          <p className="mt-1 text-xs text-kalin-light/80 max-w-xl">
            Acompanhe o engajamento dos seus alunos nas formações de Fisioterapia e publique novos conteúdos didáticos.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          className="shadow-kalin-glow text-kalin-dark hover:bg-gray-100"
          leftIcon={<PlusCircle className="w-5 h-5" />}
          onClick={() => navigate('/teacher/aulas/nova')}
        >
          Publicar Nova Aula
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Cursos sob sua gestão</span>
            <div className="p-2.5 rounded-xl bg-kalin-light text-kalin-green">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">{courses.length}</div>
          <div className="text-[11px] text-kalin-green font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Formações ativas na grade</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Aulas Publicadas</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">{publishedCount}</div>
          <div className="text-[11px] text-kalin-muted font-medium">
            {lessons.length - publishedCount} em modo rascunho
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Alunos Inscritos</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">412</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18 novos alunos neste mês</span>
          </div>
        </div>
      </div>

      {/* Aulas Recentes Publicadas pelo Professor */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-kalin-dark">Suas Aulas Recentes</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/teacher/aulas')}>
            Ver todas as aulas
          </Button>
        </div>

        <div className="divide-y divide-gray-100">
          {lessons.slice(0, 5).map(l => (
            <div key={l.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={l.thumbnailUrl}
                  alt={l.title}
                  className="w-14 h-10 rounded-lg object-cover border border-kalin-border flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-kalin-dark truncate">{l.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-kalin-muted mt-0.5">
                    <span>{l.durationFormatted}</span>
                    <span>•</span>
                    <span>{l.viewsCount} views</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${l.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}
              >
                {l.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
