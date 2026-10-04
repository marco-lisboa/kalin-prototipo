import React, { useState, useEffect } from 'react';
import {
  Users,
  PlusCircle,
  Search,
  Eye,
  Edit2,
  Trash2,
  School,
  Award,
  BookOpen
} from 'lucide-react';
import { teacherService, categoryService } from '../../services';
import { Teacher, Category } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Avatar } from '../../components/common/Avatar';

export const AdminTeachersPage: React.FC = () => {
  const { toast } = useToast();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // New Teacher Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSpecialtyId, setNewSpecialtyId] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Teacher Modal
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSpecialtyId, setEditSpecialtyId] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  // Delete Dialog
  const [deletingTeacherId, setDeletingTeacherId] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      const list = await teacherService.getTeachers();
      const cats = await categoryService.getCategories();
      setTeachers(list);
      setCategories(cats);
      if (cats.length > 0 && !newSpecialtyId) {
        setNewSpecialtyId(cats[0].id);
      }
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCpf.trim() || !newEmail.trim()) {
      toast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    const cat = categories.find(c => c.id === newSpecialtyId) || categories[0];

    setIsSubmitting(true);
    try {
      await teacherService.createTeacher({
        name: newName.trim(),
        cpf: newCpf.trim(),
        email: newEmail.trim(),
        title: newTitle.trim() || 'Docente Especialista',
        specialty: cat?.name || 'Fisioterapia Neurofuncional',
        specialtyId: cat?.id || 'cat-neuro',
        status: newStatus
      });

      toast('Professor cadastrado com sucesso!', 'success');
      setIsNewModalOpen(false);
      setNewName('');
      setNewCpf('');
      setNewEmail('');
      setNewTitle('');
      await fetchTeachers();
    } catch (err) {
      toast('Erro ao cadastrar professor.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (t: Teacher) => {
    setEditingTeacher(t);
    setEditName(t.name);
    setEditEmail(t.email);
    setEditTitle(t.title || '');
    setEditSpecialtyId(t.specialtyId);
    setEditStatus(t.status);
  };

  const handleSaveEdit = async () => {
    if (!editingTeacher) return;
    setIsSubmitting(true);
    try {
      const cat = categories.find(c => c.id === editSpecialtyId) || categories[0];

      await teacherService.updateTeacher(editingTeacher.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        title: editTitle.trim(),
        specialty: cat?.name || editingTeacher.specialty,
        specialtyId: cat?.id || editingTeacher.specialtyId,
        status: editStatus
      });

      toast('Dados do docente atualizados com sucesso!', 'success');
      setEditingTeacher(null);
      await fetchTeachers();
    } catch (err) {
      toast('Erro ao atualizar docente.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingTeacherId) return;
    try {
      await teacherService.deleteTeacher(deletingTeacherId);
      toast('Professor excluído com sucesso.', 'info');
      setDeletingTeacherId(null);
      await fetchTeachers();
    } catch (err) {
      toast('Erro ao remover professor.', 'error');
    }
  };

  const filteredTeachers = teachers.filter(t => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.specialty.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Gerenciamento de Professores</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Cadastre novos especialistas, edite titulações e gerencie o corpo docente.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Novo Professor
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-kalin-border shadow-xs flex items-center justify-between">
        <span className="text-xs font-semibold text-kalin-muted">
          Total de {teachers.length} docentes cadastrados
        </span>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar professor ou especialidade..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Professor & Titulação</th>
                <th className="py-3.5 px-4">CPF</th>
                <th className="py-3.5 px-4">E-mail</th>
                <th className="py-3.5 px-4">Especialidade</th>
                <th className="py-3.5 px-4">Cursos</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTeachers.map(t => (
                <tr key={t.id} className="hover:bg-kalin-light/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={t.avatar} name={t.name} size="sm" />
                      <div>
                        <span className="font-bold text-kalin-dark block">{t.name}</span>
                        <span className="text-[11px] text-kalin-green font-semibold truncate max-w-[200px] block">
                          {t.title || 'Docente Titular'}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-kalin-muted font-medium">
                    {t.cpf}
                  </td>

                  <td className="py-3.5 px-4 text-kalin-muted font-medium">
                    {t.email}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-kalin-light text-kalin-green text-[11px] font-bold">
                      {t.specialty}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-kalin-dark font-semibold">
                    {t.taughtCourseIds?.length || 1} formações
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        t.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {t.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(t)}
                        className="p-1.5 text-kalin-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar Professor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTeacherId(t.id)}
                        className="p-1.5 text-kalin-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir Professor"
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

      {/* Modal: Novo Professor */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Cadastrar Novo Professor"
        subtitle="Adicione um novo docente titular ao quadro da Kalin Educ."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateTeacher} isLoading={isSubmitting}>
              Salvar Professor
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTeacher} className="space-y-4 text-left">
          <Input
            label="Nome Completo"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Ex: Prof. Dr. Carlos Eduardo Silva"
            required
          />

          <Input
            label="Titulação Acadêmica"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Ex: Doutor em Biomecânica da Marcha"
            required
          />

          <Input
            label="CPF"
            value={newCpf}
            onChange={e => setNewCpf(e.target.value)}
            placeholder="111.111.111-11"
            required
          />

          <Input
            label="E-mail"
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="carlos.silva@kalineduc.com.br"
            required
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Especialidade Principal
            </label>
            <select
              value={newSpecialtyId}
              onChange={e => setNewSpecialtyId(e.target.value)}
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
              Status Inicial
            </label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar Professor */}
      {editingTeacher && (
        <Modal
          isOpen={!!editingTeacher}
          onClose={() => setEditingTeacher(null)}
          title="Editar Dados do Professor"
          subtitle={editingTeacher.name}
          size="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingTeacher(null)}>
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
              label="Nome Completo"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />

            <Input
              label="Titulação"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              required
            />

            <Input
              label="E-mail"
              type="email"
              value={editEmail}
              onChange={e => setEditEmail(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Especialidade
              </label>
              <select
                value={editSpecialtyId}
                onChange={e => setEditSpecialtyId(e.target.value)}
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
                Status
              </label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value as any)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingTeacherId}
        onClose={() => setDeletingTeacherId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Professor"
        message="Tem certeza de que deseja remover este docente da plataforma? Seus cursos permanecerão arquivados."
        confirmText="Sim, excluir professor"
      />
    </div>
  );
};
