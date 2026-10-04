import React, { useState, useEffect } from 'react';
import {
  Video,
  PlusCircle,
  Search,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { lessonService, courseService } from '../../services';
import { Lesson, Course } from '../../types';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const TeacherLessonsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');
  const [isSaving, setIsSaving] = useState(false);

  // Delete dialog state
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const fetchLessons = async () => {
    try {
      const teacherId = user?.id || 'prof-1';
      const allLessons = await lessonService.getLessons({ teacherId });
      const allCourses = await courseService.getCourses({ teacherId });
      setLessons(allLessons);
      setCourses(allCourses);
    } catch (err) {
      console.error('Error fetching teacher lessons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [user]);

  const handleOpenEdit = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setEditTitle(lesson.title);
    setEditDesc(lesson.description);
    setEditDuration(lesson.durationMinutes);
    setEditStatus(lesson.status);
  };

  const handleSaveEdit = async () => {
    if (!editingLesson) return;
    setIsSaving(true);
    try {
      await lessonService.updateLesson(editingLesson.id, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        durationMinutes: editDuration,
        durationFormatted: `${editDuration} min`,
        status: editStatus
      });
      toast('Aula atualizada com sucesso!', 'success');
      setEditingLesson(null);
      await fetchLessons();
    } catch (err) {
      toast('Erro ao atualizar aula.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLessonId) return;
    try {
      await lessonService.deleteLesson(deletingLessonId);
      toast('Aula excluída com sucesso.', 'info');
      setDeletingLessonId(null);
      await fetchLessons();
    } catch (err) {
      toast('Erro ao excluir aula.', 'error');
    }
  };

  const filteredLessons = lessons.filter(l => {
    if (selectedCourse !== 'all' && l.courseId !== selectedCourse) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Minhas Aulas Gravadas</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Gerencie publicações, visualize estatísticas e adicione novos conteúdos.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => navigate('/teacher/aulas/nova')}
        >
          Nova Aula
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-kalin-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="px-3.5 py-2 bg-kalin-background border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none"
          >
            <option value="all">Todos os Cursos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar aula por título..."
          className="w-full sm:w-72"
        />
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Aula & Capa</th>
                <th className="py-3.5 px-4">Duração</th>
                <th className="py-3.5 px-4">Visualizações</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLessons.map(l => (
                <tr key={l.id} className="hover:bg-kalin-light/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={l.thumbnailUrl}
                        alt={l.title}
                        className="w-14 h-10 rounded-lg object-cover border border-kalin-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-kalin-dark block truncate max-w-md sm:max-w-lg">
                          {l.title}
                        </span>
                        <span className="text-[11px] text-kalin-muted truncate block max-w-sm">
                          {l.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-medium text-kalin-muted whitespace-nowrap">
                    {l.durationFormatted}
                  </td>

                  <td className="py-3 px-4 font-semibold text-kalin-dark whitespace-nowrap">
                    {l.viewsCount} views
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        l.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {l.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/app/aula/${l.id}`)}
                        className="p-1.5 text-kalin-muted hover:text-kalin-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="Visualizar no Player"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(l)}
                        className="p-1.5 text-kalin-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Aula"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setDeletingLessonId(l.id)}
                        className="p-1.5 text-kalin-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir Aula"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredLessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-kalin-muted italic">
                    Nenhuma aula encontrada com os critérios informados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <Modal
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
          title="Editar Informações da Aula"
          subtitle={editingLesson.title}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingLesson(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit} isLoading={isSaving}>
                Salvar Alterações
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-left">
            <Input
              label="Título da Aula"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Descrição Detalhada
              </label>
              <textarea
                rows={4}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20 focus:border-kalin-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duração (minutos)"
                type="number"
                value={editDuration}
                onChange={e => setEditDuration(parseInt(e.target.value) || 0)}
              />

              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Status de Publicação
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
                >
                  <option value="published">Publicado (Visível aos Alunos)</option>
                  <option value="draft">Rascunho (Oculto)</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deletingLessonId}
        onClose={() => setDeletingLessonId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Aula"
        message="Tem certeza de que deseja excluir permanentemente esta aula? Essa ação removerá o vídeo da grade do curso."
        confirmText="Sim, excluir aula"
      />
    </div>
  );
};
