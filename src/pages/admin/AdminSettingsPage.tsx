import React from 'react';
import {
  Settings,
  RefreshCw,
  Trash2,
  Database,
  Server,
  Code2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';

export const AdminSettingsPage: React.FC = () => {
  const { resetMockData, logout } = useAuth();
  const { toast } = useToast();

  const handleResetData = () => {
    if (window.confirm('Tem certeza de que deseja restaurar os dados originais? Todas as alterações manuais serão resetadas para o estado inicial da demonstração.')) {
      resetMockData();
    }
  };

  const handleClearStorage = () => {
    if (window.confirm('ATENÇÃO: Deseja apagar todo o armazenamento local da plataforma? Você será deslogado imediatamente.')) {
      localStorage.clear();
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-black text-kalin-dark">Configurações da Plataforma</h1>
        <p className="text-xs text-kalin-muted mt-0.5">
          Parâmetros do sistema, gestão da base de dados mockada e preparação para backend.
        </p>
      </div>

      {/* Informações da Plataforma */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-4">
        <h3 className="text-base font-bold text-kalin-dark flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-kalin-primary" />
          <span>Informações do Protótipo Kalin Educ</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-kalin-background">
            <span className="text-kalin-muted block">Ambiente</span>
            <span className="font-bold text-kalin-dark">Prova de Conceito (PoC) / Protótipo Front-End</span>
          </div>

          <div className="p-3.5 rounded-xl bg-kalin-background">
            <span className="text-kalin-muted block">Propriedade Intelectual</span>
            <span className="font-bold text-kalin-dark">Grupo Kalin • Educação em Saúde</span>
          </div>

          <div className="p-3.5 rounded-xl bg-kalin-background">
            <span className="text-kalin-muted block">Mecanismo de Persistência Atual</span>
            <span className="font-bold text-kalin-primary">LocalStorage Isolado via Service Layer</span>
          </div>

          <div className="p-3.5 rounded-xl bg-kalin-background">
            <span className="text-kalin-muted block">Arquitetura de Transição</span>
            <span className="font-bold text-kalin-green">Preparada para Backend Laravel REST API</span>
          </div>
        </div>
      </div>

      {/* Arquitetura & Preparação para Backend Futuro */}
      <div className="bg-gradient-to-br from-kalin-dark to-[#10221A] text-white p-6 sm:p-8 rounded-2xl shadow-kalin-md space-y-4">
        <div className="flex items-center gap-2 text-kalin-light">
          <Server className="w-5 h-5 text-kalin-primary" />
          <h3 className="text-base font-bold">Transição Tecnológica para Laravel API</h3>
        </div>

        <p className="text-xs text-kalin-light/80 leading-relaxed">
          Toda a aplicação foi construída com o padrão de repositórios/serviços (Services Layer). Os componentes de interface não dependem de chamadas diretas ao <code className="bg-white/10 px-1 py-0.5 rounded text-kalin-primary font-mono">localStorage</code>.
        </p>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
          <div className="text-gray-400">// Camada atual de protótipo:</div>
          <div className="text-emerald-400">courseService.getCourses() → busca de dados no LocalStorage</div>
          <div className="text-gray-400 mt-2">// Futura implementação com backend real (sem alterar telas):</div>
          <div className="text-kalin-light">courseService.getCourses() → axios.get('/api/v1/courses')</div>
        </div>
      </div>

      {/* Ações de Dados Mockados */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-kalin-border shadow-xs space-y-4">
        <h3 className="text-base font-bold text-kalin-dark flex items-center gap-2">
          <Database className="w-5 h-5 text-kalin-green" />
          <span>Gestão de Dados Locais (LocalStorage)</span>
        </h3>

        <p className="text-xs text-kalin-muted leading-relaxed">
          Utilize os botões abaixo para restaurar o catálogo demonstrativo inicial com 10 alunos, 5 professores, 8 especialidades e mais de 30 aulas.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<RefreshCw className="w-4 h-4" />}
            onClick={handleResetData}
          >
            Restaurar Dados Mockados Originais
          </Button>

          <Button
            variant="outline"
            size="md"
            className="text-red-600 hover:bg-red-50 hover:border-red-200"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleClearStorage}
          >
            Limpar Todo o LocalStorage
          </Button>
        </div>
      </div>
    </div>
  );
};
