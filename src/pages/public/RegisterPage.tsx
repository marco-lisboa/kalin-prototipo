import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCheck, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { QuickLoginHelper } from '../../components/common/QuickLoginHelper';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }

    setCpf(value);
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Nome completo é obrigatório.';
    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório.';
    } else if (cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve conter 11 dígitos.';
    }

    if (!email.trim()) {
      newErrors.email = 'E-mail é obrigatório.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Informe um endereço de e-mail válido.';
    }

    if (!password) {
      newErrors.password = 'A senha é obrigatória.';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    if (!agreeTerms) {
      newErrors.terms = 'Você precisa aceitar os termos de uso para continuar.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await register({
        name,
        cpf,
        email,
        password
      });

      if (res.success) {
        toast('Conta criada com sucesso! Seja bem-vindo à Kalin Educ.', 'success');
        navigate('/app');
      } else {
        toast(res.error || 'Erro ao criar conta', 'error');
        setErrors(prev => ({ ...prev, general: res.error || 'Erro ao cadastrar' }));
      }
    } catch (err) {
      toast('Erro inesperado ao registrar.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kalin-background flex">
      {/* Lado Esquerdo: Imagem Institucional */}
      <div className="hidden lg:flex lg:w-1/2 bg-kalin-dark text-white relative flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1400&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kalin-dark via-kalin-dark/80 to-transparent" />

        <div className="relative z-10">
          <Logo variant="light" to="/" size="lg" />
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kalin-primary/20 border border-kalin-primary/30 text-kalin-light text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-kalin-primary" />
            <span>Formação Profissional Kalin Educ</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight mb-4">
            Dê o próximo passo na sua carreira em Fisioterapia.
          </h2>

          <p className="text-sm text-kalin-light/80 leading-relaxed mb-6">
            Junte-se à maior comunidade de estudos práticos e baseados em evidências científicas do país.
          </p>

          <div className="space-y-2.5 text-xs text-kalin-light font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
              <span>Acesso imediato aos cursos liberados</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
              <span>Emissão de certificados em alta resolução</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
              <span>Suporte e materiais didáticos inclusos</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-kalin-darkborder/60 flex items-center justify-between text-xs text-kalin-light/60">
          <span>Grupo Kalin © 2026</span>
          <span className="text-kalin-primary font-semibold">Tecnologia & Saúde</span>
        </div>
      </div>

      {/* Lado Direito: Formulário de Cadastro */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <div className="lg:hidden mb-6">
            <Logo to="/" />
          </div>

          <div className="mb-6 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
              Criar Conta de Aluno
            </h1>
            <p className="mt-1 text-sm text-kalin-muted">
              Preencha os dados abaixo para iniciar sua jornada educacional.
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo"
              id="register-name"
              type="text"
              placeholder="Ex: Dra. Mariana Costa"
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
              leftIcon={<User className="w-4 h-4" />}
              required
            />

            <Input
              label="CPF"
              id="register-cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              error={errors.cpf}
              leftIcon={<UserCheck className="w-4 h-4" />}
              helperText="Utilizado para emissão dos seus certificados"
              required
            />

            <Input
              label="E-mail"
              id="register-email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Senha"
                id="register-password"
                type="password"
                placeholder="Mín. 6 caracteres"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Input
                label="Confirmar Senha"
                id="register-confirm"
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </div>

            {/* Checkbox Termos */}
            <div className="pt-1 text-left">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-kalin-border text-kalin-primary focus:ring-kalin-primary"
                />
                <span className="text-xs text-kalin-muted leading-tight">
                  Li e concordo com os{' '}
                  <span className="text-kalin-primary font-semibold underline">Termos de Uso</span>{' '}
                  e a{' '}
                  <span className="text-kalin-primary font-semibold underline">Política de Privacidade</span>{' '}
                  do Grupo Kalin.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-600 mt-1 font-medium">{errors.terms}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-kalin-glow/30 mt-3"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Criar minha conta
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-kalin-border text-center">
            <p className="text-sm text-kalin-muted">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="font-bold text-kalin-primary hover:text-kalin-green transition-colors"
              >
                Fazer Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      <QuickLoginHelper />
    </div>
  );
};
