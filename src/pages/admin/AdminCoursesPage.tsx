import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  Star,
  Users,
  Video,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courseService, categoryService, teacherService } from '../../services';
import { Course, Category, Teacher } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Course Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newTeacherId, setNewTeacherId] = useState('');
  const [newDuration, setNewDuration] = useState(24);
  const [newLevel, setNewLevel] = useState<'Iniciante' | 'Intermediário' | 'Avançado' | 'Especialização'>('Especialização');
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80');
  const [newBanner, setNewBanner] = useState('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&auto=format&fit=crop&q=80');
  const [newStatus, setNewStatus] = useState<'published' | 'draft'>('published');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Course Modal
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editTeacherId, setEditTeacherId] = useState('');
  const [editDuration, setEditDuration] = useState(20);
  const [editLevel, setEditLevel] = useState<any>('Especialização');
  const [editStatus, setEditStatus] = useState<'published' | 'draft'>('published');

  // Delete Dialog
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const all = await courseService.getCourses();
      const cats = await categoryService.getCategories();
      const profs = await teacherService.getTeachers();

      setCourses(all);
      setCategories(cats);
      setTeachers(profs);

      if (cats.length > 0 && !newCategoryId) setNewCategoryId(cats[0].id);
      if (profs.length > 0 && !newTeacherId) setNewTeacherId(profs[0].id);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast('Título do curso é obrigatório.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const cat = categories.find(c => c.id === newCategoryId) || categories[0];
      const prof = teachers.find(t => t.id === newTeacherId) || teachers[0];
      const slug = newTitle.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      await courseService.createCourse({
        title: newTitle.trim(),
        slug,
        subtitle: newSubtitle.trim() || 'Formação continuada em Fisioterapia',
        description: newDesc.trim() || 'Curso prático com evidências científicas.',
        categoryId: cat.id,
        categoryName: cat.name,
        teacherId: prof.id,
        teacherName: prof.name,
        teacherRole: prof.title || 'Docente Titular Kalin Educ',
        teacherAvatar: prof.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
        thumbnailUrl: newThumbnail,
        bannerUrl: newBanner,
        durationHours: newDuration,
        level: newLevel,
        featured: false,
        isNew: true,
        status: newStatus,
        tags: [cat.name, 'Fisioterapia'],
        certificateProvided: true
      });

      toast('Curso criado com sucesso!', 'success');
      setIsNewModalOpen(false);
      setNewTitle('');
      setNewSubtitle('');
      setNewDesc('');
      await fetchCourses();
    } catch (err) {
      toast('Erro ao cadastrar curso.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setEditTitle(c.title);
    setEditSubtitle(c.subtitle);
    setEditDesc(c.description);
    setEditCategoryId(c.categoryId);
    setEditTeacherId(c.teacherId);
    setEditDuration(c.durationHours);
    setEditLevel(c.level);
    setEditStatus(c.status);
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;
    setIsSubmitting(true);
    try {
      const cat = categories.find(c => c.id === editCategoryId) || categories[0];
      const prof = teachers.find(t => t.id === editTeacherId) || teachers[0];

      await courseService.updateCourse(editingCourse.id, {
        title: editTitle.trim(),
        subtitle: editSubtitle.trim(),
        description: editDesc.trim(),
        categoryId: cat.id,
        categoryName: cat.name,
        teacherId: prof.id,
        teacherName: prof.name,
        teacherRole: prof.title || 'Docente',
        durationHours: editDuration,
        level: editLevel,
        status: editStatus
      });

      toast('Curso atualizado com sucesso!', 'success');
      setEditingCourse(null);
      await fetchCourses();
    } catch (err) {
      toast('Erro ao atualizar curso.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCourseId) return;
    try {
      await courseService.deleteCourse(deletingCourseId);
      toast('Curso e seus módulos excluídos com sucesso.', 'info');
      setDeletingCourseId(null);
      await fetchCourses();
    } catch (err) {
      toast('Erro ao excluir curso.', 'error');
    }
  };

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    c.teacherName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Gerenciamento de Cursos</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Crie novos programas, gerencie módulos e monitore turmas matriculadas.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Novo Curso
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-kalin-border shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-kalin-muted">
          Total de {courses.length} formações cadastradas
        </span>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar curso, categoria ou professor..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Courses List / Table */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Capa & Título</th>
                <th className="py-3.5 px-4">Especialidade</th>
                <th className="py-3.5 px-4">Docente</th>
                <th className="py-3.5 px-4">Módulos / Aulas</th>
                <th className="py-3.5 px-4">Alunos</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-kalin-light/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.thumbnailUrl}
                        alt={c.title}
                        className="w-14 h-10 rounded-lg object-cover border border-kalin-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-kalin-dark block truncate max-w-sm sm:max-w-md">
                          {c.title}
                        </span>
                        <span className="text-[11px] text-kalin-muted">{c.durationHours}h • Nível {c.level}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-kalin-light text-kalin-green text-[11px] font-bold">
                      {c.categoryName}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-kalin-dark font-medium whitespace-nowrap">
                    {c.teacherName}
                  </td>

                  <td className="py-3.5 px-4 text-kalin-muted whitespace-nowrap">
                    {c.modulesCount} módulos • {c.lessonsCount} aulas
                  </td>

                  <td className="py-3.5 px-4 font-bold text-kalin-dark whitespace-nowrap">
                    {c.studentsCount} inscritos
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/app/cursos/${c.id}`)}
                        className="p-1.5 text-kalin-muted hover:text-kalin-primary rounded-lg transition-colors"
                        title="Ver Curso"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 text-kalin-muted hover:text-blue-600 rounded-lg transition-colors"
                        title="Editar Curso"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCourseId(c.id)}
                        className="p-1.5 text-kalin-muted hover:text-red-600 rounded-lg transition-colors"
                        title="Excluir Curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Novo Curso */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Criar Novo Curso"
        subtitle="Adicione uma nova formação à grade educacional."
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateCourse} isLoading={isSubmitting}>
              Salvar Curso
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateCourse} className="space-y-4 text-left">
          <Input
            label="Título do Curso"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Ex: Formação em Fisioterapia Traumato-Ortopédica"
            required
          />

          <Input
            label="Subtítulo / Chamada Curta"
            value={newSubtitle}
            onChange={e => setNewSubtitle(e.target.value)}
            placeholder="Ex: Do diagnóstico cinesiológico ao retorno funcional"
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Descrição Completa
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Descreva o conteúdo do curso e a quem se destina..."
              className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Especialidade
              </label>
              <select
                value={newCategoryId}
                onChange={e => setNewCategoryId(e.target.value)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Professor Titular
              </label>
              <select
                value={newTeacherId}
                onChange={e => setNewTeacherId(e.target.value)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Carga Horária (horas)"
              type="number"
              value={newDuration}
              onChange={e => setNewDuration(parseInt(e.target.value) || 0)}
            />

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Nível de Profundidade
              </label>
              <select
                value={newLevel}
                onChange={e => setNewLevel(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Especialização">Especialização</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Status
              </label>
              <select
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                <option value="published">Publicado</option>
                <option value="draft">Rascunho</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar Curso */}
      {editingCourse && (
        <Modal
          isOpen={!!editingCourse}
          onClose={() => setEditingCourse(null)}
          title="Editar Curso"
          subtitle={editingCourse.title}
          size="lg"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingCourse(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit} isLoading={isSubmitting}>
                Salvar Alterações
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-left">
            <Input
              label="Título do Curso"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />

            <Input
              label="Subtítulo"
              value={editSubtitle}
              onChange={e => setEditSubtitle(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Especialidade
                </label>
                <select
                  value={editCategoryId}
                  onChange={e => setEditCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Professor
                </label>
                <select
                  value={editTeacherId}
                  onChange={e => setEditTeacherId(e.target.value)}
                  className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Carga Horária (h)"
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
        isOpen={!!deletingCourseId}
        onClose={() => setDeletingCourseId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Curso"
        message="Tem certeza de que deseja excluir este curso? Todos os módulos e aulas pertencentes a ele também serão removidos."
        confirmText="Sim, excluir curso"
      />
    </div>
  );
};
