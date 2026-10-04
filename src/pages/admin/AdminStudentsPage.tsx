import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Search,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  Mail
} from 'lucide-react';
import { studentService, courseService } from '../../services';
import { Student, Course } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { SearchInput } from '../../components/common/SearchInput';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Avatar } from '../../components/common/Avatar';

export const AdminStudentsPage: React.FC = () => {
  const { toast } = useToast();

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // New Student Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCpf, setNewCpf] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCourseId, setNewCourseId] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'inactive'>('active');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Student Modal
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  // View Student Modal
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Delete Dialog
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      const allStudents = await studentService.getStudents();
      const allCourses = await courseService.getCourses();
      setStudents(allStudents);
      setCourses(allCourses);
      if (allCourses.length > 0 && !newCourseId) {
        setNewCourseId(allCourses[0].id);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCpf.trim() || !newEmail.trim()) {
      toast('Preencha todos os campos obrigatórios.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await studentService.createStudent({
        name: newName.trim(),
        cpf: newCpf.trim(),
        email: newEmail.trim(),
        status: newStatus,
        enrolledCourseIds: newCourseId ? [newCourseId] : ['course-neuro-1']
      });

      toast('Aluno cadastrado com sucesso!', 'success');
      setIsNewModalOpen(false);
      setNewName('');
      setNewCpf('');
      setNewEmail('');
      await fetchStudents();
    } catch (err) {
      toast('Erro ao cadastrar aluno.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (s: Student) => {
    setEditingStudent(s);
    setEditName(s.name);
    setEditEmail(s.email);
    setEditStatus(s.status);
  };

  const handleSaveEdit = async () => {
    if (!editingStudent) return;
    setIsSubmitting(true);
    try {
      await studentService.updateStudent(editingStudent.id, {
        name: editName.trim(),
        email: editEmail.trim(),
        status: editStatus
      });
      toast('Dados do aluno atualizados com sucesso!', 'success');
      setEditingStudent(null);
      await fetchStudents();
    } catch (err) {
      toast('Erro ao salvar edições.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingStudentId) return;
    try {
      await studentService.deleteStudent(deletingStudentId);
      toast('Aluno removido com sucesso.', 'info');
      setDeletingStudentId(null);
      await fetchStudents();
    } catch (err) {
      toast('Erro ao excluir aluno.', 'error');
    }
  };

  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.cpf.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Gerenciamento de Alunos</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Cadastre, edite, consulte e gerencie o status dos alunos da plataforma.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Novo Aluno
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-kalin-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {['all', 'active', 'inactive'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-kalin-primary text-white shadow-xs'
                  : 'bg-kalin-background text-kalin-text hover:bg-gray-100'
              }`}
            >
              {st === 'all' ? 'Todos' : st === 'active' ? 'Ativos' : 'Inativos'}
            </button>
          ))}
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar por nome, CPF ou e-mail..."
          className="w-full sm:w-80"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nome & CPF</th>
                <th className="py-3.5 px-4">E-mail</th>
                <th className="py-3.5 px-4">Curso Principal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Cadastro</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map(s => {
                const enrolled = courses.find(c => s.enrolledCourseIds?.includes(c.id)) || courses[0];

                return (
                  <tr key={s.id} className="hover:bg-kalin-light/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar src={s.avatar} name={s.name} size="sm" />
                        <div>
                          <span className="font-bold text-kalin-dark block">{s.name}</span>
                          <span className="text-[11px] text-kalin-muted">{s.cpf}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-kalin-muted font-medium">
                      {s.email}
                    </td>

                    <td className="py-3.5 px-4 text-kalin-dark font-medium truncate max-w-[200px]">
                      {enrolled?.title || 'Fisioterapia Neurofuncional'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          s.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {s.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-kalin-muted">
                      {s.createdAt}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingStudent(s)}
                          className="p-1.5 text-kalin-muted hover:text-kalin-primary hover:bg-gray-100 rounded-lg transition-colors"
                          title="Visualizar Aluno"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-kalin-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar Aluno"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudentId(s.id)}
                          className="p-1.5 text-kalin-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir Aluno"
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

      {/* Modal: Novo Aluno */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Cadastrar Novo Aluno"
        subtitle="Preencha os dados cadastrais para liberar o acesso ao sistema."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateStudent} isLoading={isSubmitting}>
              Salvar Aluno
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateStudent} className="space-y-4 text-left">
          <Input
            label="Nome Completo"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Ex: Dra. Juliana Santos"
            required
          />

          <Input
            label="CPF"
            value={newCpf}
            onChange={e => setNewCpf(e.target.value)}
            placeholder="000.000.000-00"
            required
          />

          <Input
            label="E-mail"
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="email@exemplo.com"
            required
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Curso Inicial de Matrícula
            </label>
            <select
              value={newCourseId}
              onChange={e => setNewCourseId(e.target.value)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
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
              Status Inicial
            </label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as any)}
              className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
            >
              <option value="active">Ativo (Acesso Liberado)</option>
              <option value="inactive">Inativo (Acesso Bloqueado)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar Aluno */}
      {editingStudent && (
        <Modal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          title="Editar Aluno"
          subtitle={editingStudent.name}
          size="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingStudent(null)}>
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
              label="CPF (Não editável)"
              value={editingStudent.cpf}
              disabled
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

      {/* Modal: Visualizar Aluno */}
      {viewingStudent && (
        <Modal
          isOpen={!!viewingStudent}
          onClose={() => setViewingStudent(null)}
          title="Detalhes do Aluno"
          size="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setViewingStudent(null)}>
              Fechar
            </Button>
          }
        >
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <Avatar src={viewingStudent.avatar} name={viewingStudent.name} size="lg" />
              <div>
                <h3 className="font-bold text-base text-kalin-dark">{viewingStudent.name}</h3>
                <p className="text-xs text-kalin-muted">{viewingStudent.email}</p>
                <span className="text-[11px] font-semibold text-kalin-primary">CPF: {viewingStudent.cpf}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-gray-50">
                <span className="text-gray-400 block">Data de Cadastro</span>
                <span className="font-bold text-kalin-dark">{viewingStudent.createdAt}</span>
              </div>
              <div className="p-3 rounded-xl bg-gray-50">
                <span className="text-gray-400 block">Status da Conta</span>
                <span className="font-bold text-emerald-600 capitalize">{viewingStudent.status}</span>
              </div>
            </div>

            <div className="text-xs">
              <span className="text-kalin-muted font-semibold block mb-2">Cursos Vinculados:</span>
              <div className="p-3 rounded-xl bg-kalin-light/40 border border-kalin-primary/20 space-y-1">
                {viewingStudent.enrolledCourseIds?.map(cId => {
                  const c = courses.find(item => item.id === cId);
                  return (
                    <div key={cId} className="font-semibold text-kalin-dark">
                      • {c?.title || cId}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingStudentId}
        onClose={() => setDeletingStudentId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Aluno"
        message="Tem certeza de que deseja remover este aluno? Os registros de progresso e emissões de certificados vinculados serão desativados."
        confirmText="Sim, excluir aluno"
      />
    </div>
  );
};
