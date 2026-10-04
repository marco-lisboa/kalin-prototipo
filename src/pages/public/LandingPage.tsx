import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Shield,
  Award,
  Sparkles,
  BookOpen,
  Users,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Brain,
  Activity,
  Bone,
  Wind
} from 'lucide-react';
import { Logo } from '../../components/common/Logo';
import { Button } from '../../components/common/Button';
import { QuickLoginHelper } from '../../components/common/QuickLoginHelper';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kalin-background text-kalin-text flex flex-col selection:bg-kalin-primary selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-kalin-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo to="/" />
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white via-kalin-light/30 to-kalin-background">
        {/* Glow decoration */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-kalin-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-kalin-light border border-kalin-primary/30 text-kalin-green text-xs font-bold tracking-wide uppercase mb-6 shadow-xs animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-kalin-primary" />
              <span>Plataforma de Educação Continuada em Fisioterapia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-kalin-dark tracking-tight leading-[1.15] mb-6">
              Conhecimento que <span className="text-kalin-primary">transforma</span> profissionais.
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-kalin-muted leading-relaxed mb-10 max-w-2xl mx-auto">
              Uma nova experiência de aprendizagem em streaming para profissionais e acadêmicos de fisioterapia. Cursos de alta imersão, prática clínica e evidências científicas.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/login')}
                rightIcon={<ChevronRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-kalin-glow/30"
              >
                Conheça a plataforma
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-white"
              >
                Já sou aluno • Entrar
              </Button>
            </div>

            {/* Proof Badges */}
            <div className="mt-12 pt-8 border-t border-kalin-border/60 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-kalin-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
                <span>+34 Aulas Práticas em Vídeo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
                <span>Docentes Mestres e Doutores</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-kalin-primary" />
                <span>Certificação com Selo Grupo Kalin</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup Preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-kalin-dark relative group">
            <div className="relative aspect-[16/9] w-full">
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1600&auto=format&fit=crop&q=80"
                alt="Plataforma Kalin Educ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-kalin-dark via-kalin-dark/40 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 text-white text-left">
                <span className="px-3 py-1 rounded bg-kalin-primary text-white text-xs font-bold w-fit mb-3">
                  EM DESTAQUE NA PLATAFORMA
                </span>
                <h3 className="text-2xl sm:text-4xl font-extrabold max-w-2xl leading-tight drop-shadow-md">
                  Formação em Fisioterapia Neurofuncional: Da Avaliação à Prática
                </h3>
                <p className="mt-2 text-sm text-gray-200 max-w-xl hidden sm:block">
                  Aprenda com o Prof. Dr. Rafael Almeida através de casos clínicos reais de AVC, Parkinson e Lesão Medular.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate('/login')}
                    leftIcon={<Play className="w-4 h-4 fill-white" />}
                  >
                    Acessar Conteúdo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Aprenda com Especialistas */}
      <section className="py-20 bg-white border-y border-kalin-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-kalin-primary uppercase tracking-widest mb-2">
              Corpo Docente de Referência
            </h2>
            <h3 className="text-3xl font-extrabold text-kalin-dark">
              Aprenda com quem vive a prática clínica
            </h3>
            <p className="mt-3 text-sm text-kalin-muted">
              Nossos professores são clínicos atuantes, pesquisadores e referências nacionais em suas respectivas especialidades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-kalin-background border border-kalin-border hover:shadow-kalin-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-kalin-light text-kalin-primary flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-kalin-dark mb-2">Casos Clínicos Reais</h4>
              <p className="text-xs text-kalin-muted leading-relaxed">
                Aulas gravadas em ambiente clínico demonstrando o manejo com pacientes reais, testes ortopédicos e intervenções neurofuncionais.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-kalin-background border border-kalin-border hover:shadow-kalin-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-kalin-light text-kalin-primary flex items-center justify-center mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-kalin-dark mb-2">Materiais Complementares</h4>
              <p className="text-xs text-kalin-muted leading-relaxed">
                Apostilas completas, escalas validadas, fichas de avaliação clínica e artigos de alto impacto científico disponíveis para download.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-kalin-background border border-kalin-border hover:shadow-kalin-md transition-all text-left">
              <div className="w-12 h-12 rounded-xl bg-kalin-light text-kalin-primary flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-kalin-dark mb-2">Acompanhe seu Progresso</h4>
              <p className="text-xs text-kalin-muted leading-relaxed">
                Dashboard pessoal com percentual de conclusão por módulo, horas computadas e emissão automática de certificados válidos em todo o Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Especialidades em um só lugar */}
      <section className="py-20 bg-kalin-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold text-kalin-primary uppercase tracking-widest mb-1">
                Grade de Formação
              </h2>
              <h3 className="text-3xl font-extrabold text-kalin-dark">
                As principais especialidades em um só lugar
              </h3>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/login')}>
              Ver todas as especialidades
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Neurofuncional', icon: <Brain className="w-6 h-6 text-kalin-primary" />, desc: 'AVC, Parkinson e Lesão Medular' },
              { name: 'Esportiva', icon: <Activity className="w-6 h-6 text-kalin-green" />, desc: 'LCA e Return to Play' },
              { name: 'Traumato-Ortopédica', icon: <Bone className="w-6 h-6 text-kalin-dark" />, desc: 'Coluna e Terapia Manual' },
              { name: 'Respiratória & UTI', icon: <Wind className="w-6 h-6 text-teal-600" />, desc: 'Ventilação Mecânica e Desmame' },
            ].map(esp => (
              <div
                key={esp.name}
                onClick={() => navigate('/login')}
                className="p-5 bg-white rounded-2xl border border-kalin-border shadow-xs hover:shadow-kalin-md transition-all cursor-pointer group text-left"
              >
                <div className="mb-3 p-2.5 rounded-xl bg-kalin-light/60 w-fit group-hover:scale-110 transition-transform">
                  {esp.icon}
                </div>
                <h4 className="font-bold text-sm text-kalin-dark group-hover:text-kalin-primary transition-colors">
                  {esp.name}
                </h4>
                <p className="text-[11px] text-kalin-muted mt-1">
                  {esp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-kalin-dark text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Pronto para transformar sua prática profissional?
          </h2>
          <p className="text-sm text-kalin-light/80 max-w-xl mx-auto mb-8">
            Junte-se a centenas de fisioterapeutas que já estão acelerando suas carreiras com a Kalin Educ.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/register')}
            className="shadow-kalin-glow"
          >
            Começar Agora Gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#12221B] text-white py-8 border-t border-kalin-darkborder text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo variant="light" to="/" />
          <p>© 2026 Kalin Educ • Grupo Kalin. Todos os direitos reservados.</p>
        </div>
      </footer>

      <QuickLoginHelper />
    </div>
  );
};
