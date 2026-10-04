import React, { useState, useEffect } from 'react';
import {
  Video,
  PlusCircle,
  Search,
  Eye,
  Edit2,
  Trash2,
  Clock,
  ToggleLeft,
  ToggleRight,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { lessonService, courseService, categoryService, teacherService } from '../../services';
import { Lesson, Course, Category, Teacher } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminLessonsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Filtros
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Edit Modal
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDuration, setEditDuration] = useState(30);
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog
  const [deletingLessonId, setDeletingLessonId] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const allLessons = await lessonService.getLessons();
      const allCourses = await courseService.getCourses();
      const allCats = await categoryService.getCategories();
      const allProfs = await teacherService.getTeachers();

      setLessons(allLessons);
      setCourses(allCourses);
      setCategories(allCats);
      setTeachers(allProfs);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await lessonService.togglePublish(id);
      if (updated) {
        toast(
          `Aula ${updated.status === 'published' ? 'publicada' : 'despublicada'} com sucesso!`,
          'info'
        );
        await fetchAll();
      }
    } catch (err) {
      toast('Erro ao alterar status da aula.', 'error');
    }
  };

  const handleOpenEdit = (l: Lesson) => {
    setEditingLesson(l);
    setEditTitle(l.title);
    setEditDesc(l.description);
    setEditDuration(l.durationMinutes);
    setEditStatus(l.status);
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
      toast('Aula atualizada!', 'success');
      setEditingLesson(null);
      await fetchAll();
    } catch (err) {
      toast('Erro ao salvar aula.', 'error');
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
      await fetchAll();
    } catch (err) {
      toast('Erro ao excluir aula.', 'error');
    }
  };

  // Filtragem composta
  const filteredLessons = lessons.filter(l => {
    if (selectedCourse !== 'all' && l.courseId !== selectedCourse) return false;
    if (selectedTeacher !== 'all' && l.teacherId !== selectedTeacher) return false;
    if (selectedStatus !== 'all' && l.status !== selectedStatus) return false;

    if (selectedCategory !== 'all') {
      const c = courses.find(course => course.id === l.courseId);
      if (c && c.categoryId !== selectedCategory) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.teacherName.toLowerCase().includes(q)
      );
    }

    return true;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Gerenciamento de Aulas</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Publique, edite, filtre e organize o acervo de videoaulas da Kalin Educ.
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

      {/* Bar: 4 Filtros Obrigatórios (Curso, Categoria, Professor, Status) + Busca */}
      <div className="bg-white p-4 rounded-2xl border border-kalin-border shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-kalin-dark">
          <Filter className="w-4 h-4 text-kalin-primary" />
          <span>Filtros de Pesquisa:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Filtro Curso */}
          <select
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="px-3 py-2 bg-kalin-background border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none"
          >
            <option value="all">Todos os Cursos</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Filtro Categoria */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-kalin-background border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none"
          >
            <option value="all">Todas as Especialidades</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Filtro Professor */}
          <select
            value={selectedTeacher}
            onChange={e => setSelectedTeacher(e.target.value)}
            className="px-3 py-2 bg-kalin-background border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none"
          >
            <option value="all">Todos os Professores</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Filtro Status */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-kalin-background border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none"
          >
            <option value="all">Todos os Status</option>
            <option value="published">Publicado</option>
            <option value="draft">Rascunho</option>
          </select>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-kalin-muted font-medium">
            Exibindo {filteredLessons.length} de {lessons.length} aulas cadastradas
          </span>

          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar por título ou descrição..."
            className="w-full sm:w-80"
          />
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Aula & Capa</th>
                <th className="py-3.5 px-4">Curso</th>
                <th className="py-3.5 px-4">Docente</th>
                <th className="py-3.5 px-4">Duração</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLessons.map(l => {
                const c = courses.find(item => item.id === l.courseId);

                return (
                  <tr key={l.id} className="hover:bg-kalin-light/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={l.thumbnailUrl}
                          alt={l.title}
                          className="w-14 h-10 rounded-lg object-cover border border-kalin-border flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-kalin-dark block truncate max-w-xs sm:max-w-sm">
                            {l.title}
                          </span>
                          <span className="text-[11px] text-kalin-muted truncate block max-w-xs">
                            {l.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-kalin-dark font-medium truncate max-w-[180px]">
                      {c?.title || 'Formação'}
                    </td>

                    <td className="py-3.5 px-4 text-kalin-muted whitespace-nowrap">
                      {l.teacherName}
                    </td>

                    <td className="py-3.5 px-4 text-kalin-muted whitespace-nowrap font-medium">
                      {l.durationFormatted}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(l.id)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-all ${
                          l.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Clique para alternar publicação"
                      >
                        {l.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/app/aula/${l.id}`)}
                          className="p-1.5 text-kalin-muted hover:text-kalin-primary rounded-lg transition-colors"
                          title="Visualizar Vídeo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(l)}
                          className="p-1.5 text-kalin-muted hover:text-blue-600 rounded-lg transition-colors"
                          title="Editar Aula"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingLessonId(l.id)}
                          className="p-1.5 text-kalin-muted hover:text-red-600 rounded-lg transition-colors"
                          title="Excluir Aula"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingLesson && (
        <Modal
          isOpen={!!editingLesson}
          onClose={() => setEditingLesson(null)}
          title="Editar Aula"
          subtitle={editingLesson.title}
          size="md"
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
                Descrição
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full p-3 border border-kalin-border rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Duração (min)"
                type="number"
                value={editDuration}
                onChange={e => setEditDuration(parseInt(e.target.value) || 0)}
              />

              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={e => setEditStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingLessonId}
        onClose={() => setDeletingLessonId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Aula"
        message="Tem certeza de que deseja remover esta aula do sistema? Ela deixará de constar na contagem do curso."
        confirmText="Sim, excluir aula"
      />
    </div>
  );
};
