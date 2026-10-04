import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  CheckCircle2,
  Video,
  Image,
  ArrowLeft,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { courseService, categoryService, lessonService } from '../../services';
import { Course, Category, Module } from '../../types';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ProgressBar } from '../../components/common/ProgressBar';

export const TeacherNewLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [duration, setDuration] = useState(35);
  const [order, setOrder] = useState(1);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80'
  );

  // Video Upload Simulation State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'completed'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const teacherId = user?.id || 'prof-1';
        const allCourses = await courseService.getCourses({ teacherId });
        const allCats = await categoryService.getCategories();

        setCourses(allCourses);
        setCategories(allCats);

        if (allCourses.length > 0) {
          const defaultCourse = allCourses[0];
          setSelectedCourseId(defaultCourse.id);
          setSelectedCategoryId(defaultCourse.categoryId);

          const courseMods = await courseService.getCourseModules(defaultCourse.id);
          setModules(courseMods);
          if (courseMods.length > 0) {
            setSelectedModuleId(courseMods[0].id);
          }
        }
      } catch (err) {
        console.error('Error loading form data:', err);
      }
    };

    loadInitialData();
  }, [user]);

  // Ao alterar o curso, atualizar módulos correspondentes
  const handleCourseChange = async (courseId: string) => {
    setSelectedCourseId(courseId);
    const chosenCourse = courses.find(c => c.id === courseId);
    if (chosenCourse) {
      setSelectedCategoryId(chosenCourse.categoryId);
    }
    const courseMods = await courseService.getCourseModules(courseId);
    setModules(courseMods);
    if (courseMods.length > 0) {
      setSelectedModuleId(courseMods[0].id);
    }
  };

  // Simulação de Upload de Vídeo
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 10;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatus('completed');
        toast('Vídeo enviado com sucesso para a plataforma!', 'success');
      } else {
        setUploadProgress(current);
      }
    }, 250);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast('Por favor, informe o título da aula.', 'error');
      return;
    }
    if (!selectedCourseId) {
      toast('Selecione o curso correspondente.', 'error');
      return;
    }
    if (!selectedModuleId) {
      toast('Selecione o módulo da aula.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const chosenCourse = courses.find(c => c.id === selectedCourseId);

      await lessonService.createLesson({
        title: title.trim(),
        description: description.trim() || 'Aula gravada pelo corpo docente Kalin Educ.',
        courseId: selectedCourseId,
        moduleId: selectedModuleId,
        durationMinutes: duration,
        durationFormatted: `${duration} min`,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: thumbnailUrl,
        order: Number(order) || 1,
        status: status,
        materials: [
          { id: `mat-${Date.now()}-1`, title: `Apostila - ${title}.pdf`, type: 'pdf', size: '2.5 MB', url: '#' },
          { id: `mat-${Date.now()}-2`, title: 'Casos Clínicos Complementares.pdf', type: 'pdf', size: '1.2 MB', url: '#' }
        ],
        teacherId: user?.id || 'prof-1',
        teacherName: user?.name || chosenCourse?.teacherName || 'Prof. Dr. Rafael Almeida'
      });

      toast('Aula publicada com sucesso no catálogo!', 'success');
      navigate('/teacher/aulas');
    } catch (err) {
      toast('Erro ao cadastrar aula.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in pb-12">
      <button
        onClick={() => navigate('/teacher/aulas')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-kalin-muted hover:text-kalin-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Minhas Aulas</span>
      </button>

      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark">Cadastrar Nova Aula</h1>
        <p className="text-xs text-kalin-muted mt-0.5">
          Preencha os metadados do vídeo e vincule à estrutura curricular do seu curso.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-6">
        {/* Título */}
        <Input
          label="Título da Aula"
          id="lesson-title"
          placeholder="Ex: Avaliação Funcional da Marcha no AVC"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-kalin-text mb-1">
            Descrição e Objetivos Didáticos
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Descreva as técnicas ensinadas nesta aula, fundamentação teórica e casos clínicos..."
            className="w-full p-3.5 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20 focus:border-kalin-primary"
            required
          />
        </div>

        {/* Curso, Categoria e Módulo */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Curso Vinculado
            </label>
            <select
              value={selectedCourseId}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              required
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Especialidade
            </label>
            <select
              value={selectedCategoryId}
              onChange={e => setSelectedCategoryId(e.target.value)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Módulo
            </label>
            <select
              value={selectedModuleId}
              onChange={e => setSelectedModuleId(e.target.value)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              required
            >
              {modules.map(m => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thumbnail e Duração */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="URL da Thumbnail (Capa do Vídeo)"
              id="lesson-thumb"
              value={thumbnailUrl}
              onChange={e => setThumbnailUrl(e.target.value)}
              leftIcon={<Image className="w-4 h-4" />}
            />
          </div>

          <div>
            <Input
              label="Duração (minutos)"
              id="lesson-duration"
              type="number"
              value={duration}
              onChange={e => setDuration(parseInt(e.target.value) || 0)}
              leftIcon={<Clock className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Ordem e Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Ordem no Módulo"
            id="lesson-order"
            type="number"
            value={order}
            onChange={e => setOrder(parseInt(e.target.value) || 1)}
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Status da Publicação
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
            >
              <option value="published">Publicado</option>
              <option value="draft">Rascunho</option>
            </select>
          </div>
        </div>

        {/* SIMULAÇÃO DE UPLOAD DE VÍDEO (REQUISITO EXPLÍCITO) */}
        <div className="p-6 rounded-2xl bg-kalin-background border-2 border-dashed border-kalin-border text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-kalin-light text-kalin-primary flex items-center justify-center mx-auto shadow-sm">
            <Video className="w-6 h-6" />
          </div>

          <div>
            <h4 className="text-sm font-bold text-kalin-dark">Arquivo de Vídeo da Aula</h4>
            <p className="text-xs text-kalin-muted mt-0.5">
              Formatos aceitos: MP4, MOV, MKV (Simulação de upload em alta definição)
            </p>
          </div>

          {/* Estado Inicial: Botão de Selecionar Arquivo */}
          {uploadStatus === 'idle' && (
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-kalin-primary text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-kalin-green transition-colors shadow-sm">
                <UploadCloud className="w-4 h-4" />
                <span>Selecionar Arquivo de Vídeo</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Estado: Enviando vídeo... com barra de progresso */}
          {uploadStatus === 'uploading' && (
            <div className="max-w-md mx-auto space-y-2 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-kalin-dark">
                <span className="flex items-center gap-1.5 text-kalin-primary">
                  <span className="w-2 h-2 rounded-full bg-kalin-primary animate-ping" />
                  Enviando vídeo...
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <ProgressBar progress={uploadProgress} size="md" colorVariant="primary" />
              <p className="text-[11px] text-kalin-muted">{videoFile?.name}</p>
            </div>
          )}

          {/* Estado: Vídeo enviado com sucesso */}
          {uploadStatus === 'completed' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold animate-slide-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Vídeo enviado ({videoFile?.name || 'video_aula.mp4'})</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate('/teacher/aulas')}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="shadow-kalin-glow"
            isLoading={isSubmitting}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            Publicar Aula
          </Button>
        </div>
      </form>
    </div>
  );
};
