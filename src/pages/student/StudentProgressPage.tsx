import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Clock,
  CheckCircle2,
  BookOpen,
  Calendar,
  Award,
  TrendingUp,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { progressService } from '../../services';
import { Course, StudentProgress } from '../../types';
import { ProgressBar } from '../../components/common/ProgressBar';
import { useNavigate } from 'react-router-dom';

export const StudentProgressPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<{
    overallPercent: number;
    completedLessonsCount: number;
    remainingLessonsCount: number;
    totalHoursWatched: number;
    inProgressCoursesCount: number;
    completedCoursesCount: number;
    weeklyCompletedCount: number;
    courseProgressList: { course: Course; progress: StudentProgress }[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userId = user?.id || 'student-1';
        const st = await progressService.getStudentStats(userId);
        setStats(st);
      } catch (err) {
        console.error('Error loading student stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
          Meu Progresso e Rendimento Acadêmico
        </h1>
        <p className="mt-1 text-sm text-kalin-muted">
          Acompanhe suas métricas de estudo, horas dedicadas e evolução em cada curso.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* % Geral */}
        <div className="bg-white p-5 rounded-2xl border border-kalin-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-kalin-light text-kalin-primary flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-kalin-dark">{stats?.overallPercent}%</div>
          <div className="text-xs text-kalin-muted mt-0.5">Progresso Geral</div>
        </div>

        {/* Aulas Concluídas */}
        <div className="bg-white p-5 rounded-2xl border border-kalin-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-kalin-dark">{stats?.completedLessonsCount}</div>
          <div className="text-xs text-kalin-muted mt-0.5">Aulas Concluídas</div>
        </div>

        {/* Aulas Restantes */}
        <div className="bg-white p-5 rounded-2xl border border-kalin-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-kalin-dark">{stats?.remainingLessonsCount}</div>
          <div className="text-xs text-kalin-muted mt-0.5">Aulas Restantes</div>
        </div>

        {/* Em Andamento */}
        <div className="bg-white p-5 rounded-2xl border border-kalin-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-kalin-dark">{stats?.inProgressCoursesCount}</div>
          <div className="text-xs text-kalin-muted mt-0.5">Cursos em Andamento</div>
        </div>

        {/* Concluídos */}
        <div className="bg-white p-5 rounded-2xl border border-kalin-border shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-kalin-light text-kalin-green flex items-center justify-center mb-3">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-kalin-dark">{stats?.completedCoursesCount}</div>
          <div className="text-xs text-kalin-muted mt-0.5">Cursos Concluídos</div>
        </div>
      </div>

      {/* Progresso Detalhado por Curso */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-kalin-dark">Progresso por Curso</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats?.courseProgressList.map(({ course, progress }) => (
            <div
              key={course.id}
              className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-4 hover:border-kalin-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-16 h-12 rounded-xl object-cover border border-kalin-border flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-kalin-green uppercase tracking-wider">
                      {course.categoryName}
                    </span>
                    <h4 className="font-bold text-kalin-dark text-sm line-clamp-1">{course.title}</h4>
                    <p className="text-xs text-kalin-muted">{course.teacherName}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-black text-kalin-green">{progress.percentCompleted}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <ProgressBar progress={progress.percentCompleted} size="md" colorVariant="primary" />

              <div className="flex items-center justify-between text-xs text-kalin-muted pt-2 border-t border-gray-100">
                <span>
                  {progress.completedLessonIds.length} de {course.lessonsCount} aulas finalizadas
                </span>
                <button
                  onClick={() => navigate(`/app/cursos/${course.id}`)}
                  className="font-bold text-kalin-primary hover:text-kalin-green flex items-center gap-1 transition-colors"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
