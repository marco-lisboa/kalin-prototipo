import React, { useState, useEffect } from 'react';
import { User, Mail, UserCheck, Calendar, Award, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { progressService, courseService } from '../../services';
import { Course, StudentProgress } from '../../types';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import { ProgressBar } from '../../components/common/ProgressBar';

export const StudentProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [userCourses, setUserCourses] = useState<{ course: Course; progress: StudentProgress | null }[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);

      const loadCourses = async () => {
        const allCourses = await courseService.getCourses();
        const allProgress = await progressService.getAllStudentProgress(user.id);
        const mapped = allCourses.map(c => ({
          course: c,
          progress: allProgress.find(p => p.courseId === c.id) || null
        }));
        setUserCourses(mapped);
      };
      loadCourses();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast('Nome não pode estar vazio.', 'error');
      return;
    }
    if (!email.trim()) {
      toast('E-mail não pode estar vazio.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const success = await updateProfile({ name: name.trim(), email: email.trim() });
      if (success) {
        toast('Perfil atualizado com sucesso!', 'success');
      } else {
        toast('Erro ao atualizar perfil.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
          Meu Perfil de Aluno
        </h1>
        <p className="mt-1 text-sm text-kalin-muted">
          Gerencie seus dados cadastrais e visualize seu histórico na Kalin Educ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs flex flex-col items-center text-center space-y-4">
          <Avatar src={user?.avatar} name={user?.name || 'Aluno'} size="xl" className="shadow-md" />
          <div>
            <h3 className="text-lg font-bold text-kalin-dark">{user?.name}</h3>
            <p className="text-xs text-kalin-green font-semibold">Aluno Regular • Fisioterapia</p>
          </div>

          <div className="w-full pt-4 border-t border-gray-100 space-y-2 text-xs text-left">
            <div className="flex items-center justify-between text-kalin-muted">
              <span>Status da Conta</span>
              <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Ativo</span>
            </div>
            <div className="flex items-center justify-between text-kalin-muted">
              <span>Data de Cadastro</span>
              <span className="font-semibold text-kalin-dark">{user?.createdAt || '2024-04-10'}</span>
            </div>
            <div className="flex items-center justify-between text-kalin-muted">
              <span>Tipo de Acesso</span>
              <span className="font-semibold text-kalin-dark">Assinatura Premium</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Edit Form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-6">
          <h3 className="text-base font-bold text-kalin-dark pb-2 border-b border-gray-100">
            Informações Cadastrais
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              id="profile-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="CPF (Não editável)"
              id="profile-cpf"
              type="text"
              value={user?.cpf || ''}
              disabled
              leftIcon={<UserCheck className="w-4 h-4" />}
              helperText="O CPF é protegido e vinculado à emissão de seus certificados."
            />

            <Input
              label="E-mail"
              id="profile-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSaving}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Cursos e Progresso Vinculados */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-4">
        <h3 className="text-base font-bold text-kalin-dark">Minhas Matrículas e Progresso</h3>

        <div className="divide-y divide-gray-100">
          {userCourses.map(({ course, progress }) => (
            <div key={course.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-kalin-green uppercase tracking-wider">
                  {course.categoryName}
                </span>
                <h4 className="font-bold text-kalin-dark text-sm">{course.title}</h4>
                <p className="text-xs text-kalin-muted">{course.durationHours} horas de conteúdo</p>
              </div>

              <div className="w-full sm:w-48 space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-kalin-muted">Concluído</span>
                  <span className="text-kalin-green">{progress?.percentCompleted || 0}%</span>
                </div>
                <ProgressBar progress={progress?.percentCompleted || 0} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
