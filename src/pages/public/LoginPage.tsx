import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, UserCheck, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { QuickLoginHelper } from '../../components/common/QuickLoginHelper';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Formatador de máscara de CPF
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
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.trim()) {
      setErrorMessage('Por favor, informe seu CPF.');
      return;
    }
    if (!password) {
      setErrorMessage('Por favor, informe sua senha.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await login(cpf, password);
      if (res.success) {
        toast('Autenticado com sucesso!', 'success');
        // Redirecionamento baseado no papel
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          // O hook de auth atualiza o user e poderemos navegar de acordo
          if (cpf === '000.000.000-00') {
            navigate('/admin');
          } else if (cpf === '111.111.111-11' || cpf.startsWith('111.')) {
            navigate('/teacher');
          } else {
            navigate('/app');
          }
        }
      } else {
        setErrorMessage(res.error || 'Credenciais inválidas. Verifique o CPF e a senha.');
        toast(res.error || 'Falha ao autenticar', 'error');
      }
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao processar o login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-kalin-background flex">
      {/* Lado Esquerdo: Branding Kalin Educ & Imersão Visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-kalin-dark text-white relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Image with Dark Tint Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1400&auto=format&fit=crop&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kalin-dark via-kalin-dark/80 to-transparent" />

        {/* Top Brand Logo */}
        <div className="relative z-10">
          <Logo variant="light" to="/" size="lg" />
        </div>

        {/* Middle Message */}
        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kalin-primary/20 border border-kalin-primary/30 text-kalin-light text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4 text-kalin-primary" />
            <span>Educação Médica & Fisioterapêutica</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight mb-4">
            Excelência em Reabilitação e Saúde Baseada em Evidências.
          </h2>

          <p className="text-sm text-kalin-light/80 leading-relaxed">
            Tenha acesso ilimitado aos cursos das mais conceituadas especialidades da fisioterapia, gravados em alta definição por profissionais de referência do Grupo Kalin.
          </p>

          <div className="mt-8 space-y-3">
            {[
              'Aulas com pacientes reais e simulação de leito',
              'Metodologia modular e flexível estilo streaming',
              'Apostilas e referências bibliográficas em PDF'
            ].map(item => (
              <div key={item} className="flex items-center gap-3 text-xs text-kalin-light font-medium">
                <div className="w-5 h-5 rounded-full bg-kalin-primary/30 text-kalin-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Institutional Signature */}
        <div className="relative z-10 pt-6 border-t border-kalin-darkborder/60 flex items-center justify-between text-xs text-kalin-light/60">
          <span>Grupo Kalin © 2026</span>
          <span className="text-kalin-primary font-semibold">Inovação em Saúde</span>
        </div>
      </div>

      {/* Lado Direito: Formulário de Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo no mobile */}
          <div className="lg:hidden mb-8">
            <Logo to="/" />
          </div>

          {/* Cabeçalho */}
          <div className="mb-8 text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
              Bem-vindo à Kalin Educ
            </h1>
            <p className="mt-2 text-sm text-kalin-muted leading-relaxed">
              Aprenda, evolua e transforme sua prática profissional.
            </p>
          </div>

          {/* Mensagem de Erro Geral */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium animate-slide-up flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="CPF"
              id="login-cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              autoComplete="username"
              leftIcon={<UserCheck className="w-4 h-4" />}
              helperText="Digite os 11 dígitos do seu CPF cadastrado"
              required
            />

            <div className="space-y-1 text-left">
              <div className="relative">
                <Input
                  label="Senha"
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  autoComplete="current-password"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-kalin-dark transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => toast('Para redefinir sua senha no protótipo, use o CPF de teste ou solicite ao administrador.', 'info')}
                  className="text-xs text-kalin-primary hover:text-kalin-green font-medium transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-kalin-glow/30 mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Entrar na Plataforma
            </Button>
          </form>

          {/* Link para Cadastro */}
          <div className="mt-8 pt-6 border-t border-kalin-border text-center">
            <p className="text-sm text-kalin-muted">
              Não possui uma conta?{' '}
              <Link
                to="/register"
                className="font-bold text-kalin-primary hover:text-kalin-green transition-colors"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>

      <QuickLoginHelper />
    </div>
  );
};
