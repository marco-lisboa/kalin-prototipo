import React, { useState, useEffect } from 'react';
import { User, Mail, Save, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';

export const TeacherProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || 'Doutor em Neurociências e Reabilitação Motora com ampla experiência clínica.');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const success = await updateProfile({
        name: name.trim(),
        email: email.trim(),
        bio: bio.trim()
      });
      if (success) {
        toast('Perfil do docente atualizado com sucesso!', 'success');
      } else {
        toast('Erro ao atualizar perfil.', 'error');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-kalin-dark">Meu Perfil Docente</h1>
        <p className="text-xs text-kalin-muted mt-0.5">
          Atualize seus dados acadêmicos e biografia exibida aos alunos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs flex flex-col items-center text-center space-y-3">
          <Avatar src={user?.avatar} name={user?.name || 'Professor'} size="xl" className="shadow-md" />
          <h3 className="font-bold text-kalin-dark text-base">{user?.name}</h3>
          <span className="text-xs text-kalin-green font-semibold bg-kalin-light px-2.5 py-0.5 rounded-full">
            Docente Titular Kalin Educ
          </span>
          <p className="text-[11px] text-kalin-muted">{user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-4">
          <Input
            label="Nome Completo / Titulação"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <Input
            label="CPF Cadastrado"
            value={user?.cpf || ''}
            disabled
            helperText="O CPF é protegido pelo sistema"
          />

          <Input
            label="E-mail Institucional"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Biografia e Mini-Currículo Clínico
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
            />
          </div>

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
  );
};
