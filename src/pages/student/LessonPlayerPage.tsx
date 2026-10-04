import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Clock,
  User,
  Share2,
  BookOpen,
  Award,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { lessonService, courseService, progressService } from '../../services';
import { Lesson, Course, Module, StudentProgress } from '../../types';
import { VideoPlayer } from '../../components/streaming/VideoPlayer';
import { Button } from '../../components/common/Button';
import { ModuleAccordion } from '../../components/streaming/ModuleAccordion';

export const LessonPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'materials' | 'notes'>('overview');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessonData = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const foundLesson = await lessonService.getLessonById(id);
        if (foundLesson) {
          setLesson(foundLesson);
          const foundCourse = await courseService.getCourseById(foundLesson.courseId);
          setCourse(foundCourse);

          if (foundCourse) {
            const courseMods = await courseService.getCourseModules(foundCourse.id);
            setModules(courseMods);
          }

          if (user) {
            const isComp = await progressService.isLessonCompleted(user.id, foundLesson.courseId, foundLesson.id);
            setIsCompleted(isComp);

            const prog = await progressService.getCourseProgress(user.id, foundLesson.courseId);
            setProgress(prog);
          }

          // Incrementar visualizações da aula
          await lessonService.incrementViews(foundLesson.id);
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [id, user]);

  const toggleComplete = async () => {
    if (!lesson || !course || !user) return;

    if (isCompleted) {
      const updated = await progressService.unmarkLessonComplete(user.id, course.id, lesson.id);
      setIsCompleted(false);
      setProgress(updated);
      toast('Aula desmarcada como concluída.', 'info');
    } else {
      const updated = await progressService.markLessonComplete(user.id, course.id, lesson.id);
      setIsCompleted(true);
      setProgress(updated);
      toast('Parabéns! Aula concluída com sucesso.', 'success');

      // Celebration confetti effect!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleSimulatedDownload = (filename: string) => {
    toast(`Download simulado iniciado: ${filename}`, 'success');
  };

  // Encontrar aula anterior e próxima
  const allLessons = modules.flatMap(m => m.lessons || []);
  const currentIndex = allLessons.findIndex(l => l.id === lesson?.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex !== -1 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-kalin-dark">Aula não encontrada</h2>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/app')}>
          Voltar para Início
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left animate-fade-in">
      {/* Top Breadcrumb & Return to Course */}
      <div className="flex items-center justify-between text-xs text-kalin-muted pb-2 border-b border-kalin-border">
        <Link
          to={`/app/cursos/${course.id}`}
          className="inline-flex items-center gap-1.5 font-semibold text-kalin-dark hover:text-kalin-primary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Voltar para {course.title}</span>
        </Link>

        <span className="hidden sm:inline-block font-medium">
          Módulo ativo: {modules.find(m => m.id === lesson.moduleId)?.title || 'Geral'}
        </span>
      </div>

      {/* Main Grid: Player + Content (Col 1) and Course Playlist (Col 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Player & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <VideoPlayer
            videoUrl={lesson.videoUrl}
            thumbnailUrl={lesson.thumbnailUrl}
            title={lesson.title}
            onEnded={() => {
              if (!isCompleted) toggleComplete();
            }}
          />

          {/* Lesson Title, Teacher and Complete Toggle */}
          <div className="bg-white rounded-2xl p-6 border border-kalin-border shadow-kalin-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-kalin-light text-kalin-green text-xs font-bold uppercase tracking-wider">
                    {course.categoryName}
                  </span>
                  <span className="text-xs text-kalin-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-kalin-primary" />
                    <span>{lesson.durationFormatted}</span>
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-kalin-dark leading-snug">
                  {lesson.title}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-xs text-kalin-muted">
                  <User className="w-4 h-4 text-kalin-primary" />
                  <span className="font-semibold text-kalin-dark">{lesson.teacherName}</span>
                  <span>•</span>
                  <span>{lesson.viewsCount} visualizações</span>
                </div>
              </div>

              {/* Botão Marcar como Concluída */}
              <div className="flex-shrink-0">
                <Button
                  variant={isCompleted ? 'secondary' : 'primary'}
                  size="md"
                  onClick={toggleComplete}
                  leftIcon={
                    <CheckCircle2
                      className={`w-4 h-4 ${isCompleted ? 'text-kalin-primary' : 'text-white'}`}
                    />
                  }
                  className={isCompleted ? 'border border-kalin-primary/40' : 'shadow-kalin-glow'}
                >
                  {isCompleted ? 'Aula Concluída ✓' : 'Marcar como concluída'}
                </Button>
              </div>
            </div>

            {/* Navigation: Previous and Next Lesson Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              {previousLesson ? (
                <button
                  onClick={() => navigate(`/app/aula/${previousLesson.id}`)}
                  className="flex items-center gap-2 text-xs font-semibold text-kalin-muted hover:text-kalin-dark p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <div className="text-left hidden sm:block">
                    <span className="block text-[10px] text-gray-400">Aula anterior</span>
                    <span className="truncate max-w-[180px] block">{previousLesson.title}</span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <button
                  onClick={() => navigate(`/app/aula/${nextLesson.id}`)}
                  className="flex items-center gap-2 text-xs font-semibold text-kalin-primary hover:text-kalin-green p-2 rounded-xl hover:bg-kalin-light transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <span className="block text-[10px] text-gray-400">Próxima aula</span>
                    <span className="truncate max-w-[180px] block">{nextLesson.title}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Tabs: Visão Geral / Materiais da Aula / Anotações */}
          <div className="bg-white rounded-2xl border border-kalin-border shadow-kalin-sm overflow-hidden">
            <div className="flex border-b border-kalin-border px-6 pt-3 gap-6 text-sm font-semibold">
              {[
                { id: 'overview', label: 'Visão Geral e Conteúdo' },
                { id: 'materials', label: `Materiais da Aula (${lesson.materials?.length || 3})` },
                { id: 'notes', label: 'Minhas Anotações' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-kalin-primary text-kalin-primary'
                      : 'border-transparent text-kalin-muted hover:text-kalin-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Tab 1: Visão Geral */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-kalin-dark">Sobre esta aula</h3>
                  <p className="text-sm text-kalin-muted leading-relaxed whitespace-pre-line">
                    {lesson.description}
                  </p>

                  <div className="mt-4 p-4 rounded-xl bg-kalin-light/40 border border-kalin-primary/20 space-y-2">
                    <h4 className="text-xs font-bold text-kalin-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-kalin-primary" />
                      Objetivos de Aprendizagem
                    </h4>
                    <ul className="text-xs text-kalin-muted space-y-1 list-disc list-inside">
                      <li>Compreender os mecanismos de neuroplasticidade associados à fisioterapia.</li>
                      <li>Dominar o exame cinesiológico funcional e correlação clínica.</li>
                      <li>Prescrever intervenções seguras baseadas em ensaios clínicos controlados.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Materiais da Aula */}
              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-kalin-dark">Arquivos de Apoio Didático</h3>
                    <span className="text-xs text-kalin-muted">Clique para simular o download</span>
                  </div>

                  {(lesson.materials && lesson.materials.length > 0
                    ? lesson.materials
                    : [
                        { id: 'm1', title: 'Apostila Oficial da Aula.pdf', size: '3.4 MB' },
                        { id: 'm2', title: 'Material complementar e Casos Clínicos.pdf', size: '2.1 MB' },
                        { id: 'm3', title: 'Referências Bibliográficas Selecionadas.pdf', size: '890 KB' }
                      ]
                  ).map((mat: any) => (
                    <div
                      key={mat.id}
                      onClick={() => handleSimulatedDownload(mat.title)}
                      className="p-4 rounded-xl bg-kalin-background border border-kalin-border hover:border-kalin-primary flex items-center justify-between cursor-pointer transition-all hover:shadow-xs group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-kalin-dark group-hover:text-kalin-primary transition-colors">
                            {mat.title}
                          </p>
                          <p className="text-xs text-kalin-muted">{mat.size || 'PDF Document'}</p>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        onClick={e => {
                          e.stopPropagation();
                          handleSimulatedDownload(mat.title);
                        }}
                      >
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Minhas Anotações */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-kalin-dark">Caderno de Notas da Aula</h3>
                  <textarea
                    rows={5}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Escreva aqui suas observações clínicas, dúvidas ou insights sobre esta aula..."
                    className="w-full p-4 rounded-xl border border-kalin-border text-sm text-kalin-text focus:outline-none focus:ring-2 focus:ring-kalin-primary/20 focus:border-kalin-primary"
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => toast('Anotações salvas com sucesso no seu perfil!', 'success')}
                    >
                      Salvar Anotações
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Playlist Modules & Lessons */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-kalin-border shadow-kalin-sm">
            <h3 className="text-base font-bold text-kalin-dark mb-1">Conteúdo do Curso</h3>
            <p className="text-xs text-kalin-muted mb-4">
              Navegue pelas aulas deste curso
            </p>

            <ModuleAccordion
              modules={modules}
              completedLessonIds={progress?.completedLessonIds || []}
              activeLessonId={lesson.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
