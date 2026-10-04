import React, { useState } from 'react';
import { UserCheck, RefreshCw, ChevronDown, ChevronUp, ShieldCheck, GraduationCap, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

export const QuickLoginHelper: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { login, resetMockData, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuickLogin = async (cpf: string, pass: string, targetPath: string, roleName: string) => {
    const res = await login(cpf, pass);
    if (res.success) {
      toast(`Logado com sucesso como ${roleName}!`, 'success');
      navigate(targetPath);
      setIsOpen(false);
    } else {
      toast(res.error || 'Falha ao autenticar', 'error');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Deseja restaurar todos os dados mockados para o estado inicial padrão?')) {
      resetMockData();
      toast('Dados padrão restaurados!', 'info');
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-kalin-dark/90 hover:bg-kalin-dark text-white text-xs font-medium shadow-kalin-md border border-kalin-primary/40 backdrop-blur-md transition-all hover:scale-105"
          title="Alternar perfis de teste e restaurar dados"
        >
          <span className="w-2 h-2 rounded-full bg-kalin-primary animate-pulse" />
          <span>Perfis de Teste (Demo)</span>
          <ChevronUp className="w-3.5 h-3.5 opacity-70" />
        </button>
      ) : (
        <div className="w-72 bg-kalin-dark text-white rounded-2xl p-4 shadow-2xl border border-kalin-primary/30 backdrop-blur-lg animate-slide-up">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-kalin-darkborder">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-kalin-light">
              <UserCheck className="w-4 h-4 text-kalin-primary" />
              <span>Acesso Rápido para Apresentação</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 mb-3 text-xs">
            {/* Aluno */}
            <button
              onClick={() => handleQuickLogin('123.456.789-00', '123456', '/app', 'Aluno')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Aluno (Lucas)</div>
                  <div className="text-[10px] text-gray-400">CPF: 123.456.789-00</div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-kalin-primary bg-kalin-primary/10 px-2 py-0.5 rounded">Entrar</span>
            </button>

            {/* Professor */}
            <button
              onClick={() => handleQuickLogin('111.111.111-11', '123456', '/teacher', 'Professor')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                  <School className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Professor (Dr. Rafael)</div>
                  <div className="text-[10px] text-gray-400">CPF: 111.111.111-11</div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Entrar</span>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickLogin('000.000.000-00', 'admin123', '/admin', 'Super Admin')}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-white">Super Admin (Alexandre)</div>
                  <div className="text-[10px] text-gray-400">CPF: 000.000.000-00</div>
                </div>
              </div>
              <span className="text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Entrar</span>
            </button>
          </div>

          <div className="pt-2 border-t border-kalin-darkborder flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Status: {user ? `${user.role} (${user.name.split(' ')[0]})` : 'Desconectado'}</span>
            <button
              onClick={handleResetData}
              className="inline-flex items-center gap-1 text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
              title="Restaura localStorage original"
            >
              <RefreshCw className="w-3 h-3 text-kalin-primary" />
              <span>Resetar Dados</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
