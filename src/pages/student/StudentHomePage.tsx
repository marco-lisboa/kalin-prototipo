import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Info,
  Clock,
  Star,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService, progressService, categoryService, lessonService } from '../../services';
import { Course, Category, ContinueWatchingItem, Lesson, StudentProgress } from '../../types';
import { Button } from '../../components/common/Button';
import { VideoCard } from '../../components/streaming/VideoCard';
import { CourseCard } from '../../components/streaming/CourseCard';
import { CategoryCard } from '../../components/streaming/CategoryCard';

export const StudentHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [heroCourse, setHeroCourse] = useState<Course | null>(null);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [myCourses, setMyCourses] = useState<{ course: Course; progress: StudentProgress | null }[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = user?.id || 'student-1';

        // 1. Featured / Hero Course
        const featured = await courseService.getFeaturedCourse();
        setHeroCourse(featured);

        // 2. Continuar assistindo
        const cont = await progressService.getContinueWatching(userId);
        setContinueWatching(cont);

        // 3. Meus Cursos do Aluno
        const allCourses = await courseService.getCourses({ status: 'published' });
        const allProgress = await progressService.getAllStudentProgress(userId);

        const enrolledItems = allCourses.map(course => {
          const prog = allProgress.find(p => p.courseId === course.id) || null;
          return { course, progress: prog };
        });
        setMyCourses(enrolledItems);

        // 4. Categorias / Especialidades (8 itens)
        const cats = await categoryService.getCategories();
        setCategories(cats);

        // 5. Recomendados
        const recommended = allCourses.filter(c => c.id !== featured?.id).slice(0, 4);
        setRecommendedCourses(recommended);

        // 6. Novos conteúdos (aulas recentes)
        const recLessons = await lessonService.getRecentLessons(4);
        setRecentLessons(recLessons);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user]);

  const scrollContinue = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-kalin-muted">Carregando catálogo Kalin Educ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in text-left">
      {/* ========================================================
          HERO GRANDE E VISUALMENTE IMPACTANTE (ESTILO STREAMING)
         ======================================================== */}
      {heroCourse && (
        <section className="relative w-full overflow-hidden bg-kalin-darksurface text-white">
          {/* Background Banner Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroCourse.bannerUrl || heroCourse.thumbnailUrl}
              alt={heroCourse.title}
              className="w-full h-full object-cover object-center opacity-40 scale-105 transform duration-1000 ease-out"
            />
            {/* Multi-layer Gradient overlays for readability & high-end cinematic feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-kalin-darksurface via-kalin-darksurface/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-kalin-darksurface via-kalin-darksurface/85 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 flex flex-col justify-end min-h-[520px] lg:min-h-[580px]">
            <div className="max-w-2xl">
              {/* Overline Badge */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="px-3 py-1 rounded-full bg-kalin-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-kalin-glow/40 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  FORMAÇÃO EM FISIOTERAPIA
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-kalin-light font-semibold text-xs border border-white/10">
                  {heroCourse.level}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4 drop-shadow-md">
                Neurofuncional
              </h1>

              {/* Subtitle / Description */}
              <p className="text-sm sm:text-base lg:text-lg text-gray-200 line-clamp-3 leading-relaxed mb-6 font-normal drop-shadow">
                {heroCourse.description}
              </p>

              {/* Meta Tags */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 mb-8 font-medium">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-white">{heroCourse.rating.toFixed(1)}</span>
                  <span>({heroCourse.ratingsCount} avaliações)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-kalin-primary" />
                  <span>{heroCourse.durationHours} horas de conteúdo</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4 text-kalin-primary" />
                  <span>{heroCourse.lessonsCount} aulas completas</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <img
                    src={heroCourse.teacherAvatar}
                    alt={heroCourse.teacherName}
                    className="w-5 h-5 rounded-full object-cover border border-kalin-primary"
                  />
                  <span className="text-white font-semibold">{heroCourse.teacherName}</span>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Play className="w-5 h-5 fill-white ml-0.5" />}
                  onClick={() => {
                    // Se houver aula para continuar, vai direto nela, senão primeira aula do curso
                    const targetLesson = continueWatching[0]?.lesson.id || 'les-neuro-101';
                    navigate(`/app/aula/${targetLesson}`);
                  }}
                  className="shadow-kalin-glow"
                >
                  Continuar assistindo
                </Button>

                <Button
                  variant="dark"
                  size="lg"
                  leftIcon={<Info className="w-5 h-5 text-gray-300" />}
                  onClick={() => navigate(`/app/cursos/${heroCourse.id}`)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white"
                >
                  Ver curso
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container for Catalog Rows */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* ========================================================
            CONTINUAR ASSISTINDO (HORIZONTAL SCROLL)
           ======================================================== */}
        {continueWatching.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-kalin-primary rounded-full" />
                  Continuar assistindo
                </h2>
                <p className="text-xs text-kalin-muted mt-0.5 ml-4.5">
                  Retome de onde você parou suas aulas em andamento
                </p>
              </div>

              {/* Navigation arrows for carousel */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => scrollContinue('left')}
                  className="p-2 rounded-xl bg-white border border-kalin-border text-kalin-text hover:bg-kalin-light hover:text-kalin-green transition-colors shadow-xs"
                  aria-label="Rolar para esquerda"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollContinue('right')}
                  className="p-2 rounded-xl bg-white border border-kalin-border text-kalin-text hover:bg-kalin-light hover:text-kalin-green transition-colors shadow-xs"
                  aria-label="Rolar para direita"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Cards Reel */}
            <div
              ref={scrollRef}
              className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {continueWatching.map(item => (
                <div key={item.lesson.id} className="snap-start flex-shrink-0">
                  <VideoCard item={item} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ========================================================
            MEUS CURSOS
           ======================================================== */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-6 bg-kalin-green rounded-full" />
                Meus cursos
              </h2>
              <p className="text-xs text-kalin-muted mt-0.5 ml-4.5">
                Formações em que você está matriculado com progresso em tempo real
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/cursos')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ver todos os cursos
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myCourses.slice(0, 4).map(({ course, progress }) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress}
                showProgress={true}
              />
            ))}
          </div>
        </section>

        {/* ========================================================
            EXPLORE POR ESPECIALIDADE (8 CATEGORIAS)
           ======================================================== */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-6 bg-kalin-primary rounded-full" />
                Explore por especialidade
              </h2>
              <p className="text-xs text-kalin-muted mt-0.5 ml-4.5">
                Navegue pelas grandes áreas da fisioterapia clínica e desportiva
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/app/especialidades')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Ver todas
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        {/* ========================================================
            CONTEÚDOS RECOMENDADOS PARA VOCÊ
           ======================================================== */}
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight flex items-center gap-2">
                <span className="w-2.5 h-6 bg-emerald-600 rounded-full" />
                Recomendados para você
              </h2>
              <p className="text-xs text-kalin-muted mt-0.5 ml-4.5">
                Cursos selecionados com base no seu perfil de especialização
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map(course => (
              <CourseCard key={course.id} course={course} showProgress={false} />
            ))}
          </div>
        </section>

        {/* ========================================================
            NOVOS CONTEÚDOS (RECENTES)
           ======================================================== */}
        <section className="space-y-5 pt-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-kalin-dark tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-6 bg-kalin-dark rounded-full" />
              Novos conteúdos
            </h2>
            <p className="text-xs text-kalin-muted mt-0.5 ml-4.5">
              Aulas recentemente adicionadas ao acervo da plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentLessons.map(lesson => (
              <div
                key={lesson.id}
                onClick={() => navigate(`/app/aula/${lesson.id}`)}
                className="group bg-white rounded-2xl border border-kalin-border overflow-hidden shadow-kalin-sm hover:shadow-kalin-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-kalin-dark">
                  <img
                    src={lesson.thumbnailUrl}
                    alt={lesson.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-kalin-primary" />
                    <span>{lesson.durationFormatted}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-kalin-primary text-white flex items-center justify-center shadow-kalin-glow">
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    </div>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-kalin-primary uppercase tracking-wider">
                      Recém publicada
                    </span>
                    <h4 className="font-bold text-kalin-dark text-sm line-clamp-2 mt-1 group-hover:text-kalin-primary transition-colors leading-snug">
                      {lesson.title}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs text-kalin-muted">
                    <span className="truncate max-w-[150px]">{lesson.teacherName}</span>
                    <span className="font-semibold text-kalin-green">Assistir</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
