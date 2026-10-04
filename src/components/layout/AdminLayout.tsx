import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Video,
  Layers,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  School
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { QuickLoginHelper } from '../common/QuickLoginHelper';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUsersOpen, setIsUsersOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex">
      {/* Admin Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#14231D] text-white border-r border-[#20362C] shrink-0">
        <div className="p-6 border-b border-[#20362C]">
          <Logo variant="light" to="/admin" />
          <div className="mt-2 text-[11px] font-bold text-amber-400 uppercase tracking-wider bg-amber-400/10 border border-amber-400/20 py-0.5 px-2 rounded inline-flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Super Administrador</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto text-sm">
          {/* Dashboard */}
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-kalin-primary text-white shadow-kalin-glow/30' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          {/* Usuários Accordion */}
          <div className="pt-2">
            <button
              onClick={() => setIsUsersOpen(!isUsersOpen)}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-gray-400 hover:text-white font-semibold text-xs uppercase tracking-wider focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-kalin-primary" />
                <span>Usuários</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isUsersOpen ? 'rotate-180' : ''}`} />
            </button>

            {isUsersOpen && (
              <div className="pl-6 pt-1 space-y-1">
                <NavLink
                  to="/admin/alunos"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${isActive ? 'text-kalin-primary bg-white/10 font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Alunos</span>
                </NavLink>
                <NavLink
                  to="/admin/professores"
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${isActive ? 'text-kalin-primary bg-white/10 font-bold' : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <School className="w-4 h-4" />
                  <span>Professores</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Cursos */}
          <NavLink
            to="/admin/cursos"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <BookOpen className="w-5 h-5" />
            <span>Cursos</span>
          </NavLink>

          {/* Aulas */}
          <NavLink
            to="/admin/aulas"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Video className="w-5 h-5" />
            <span>Aulas</span>
          </NavLink>

          {/* Categorias / Especialidades */}
          <NavLink
            to="/admin/categorias"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Layers className="w-5 h-5" />
            <span>Categorias</span>
          </NavLink>

          {/* Relatórios */}
          {/* <NavLink
            to="/admin/relatorios"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <BarChart3 className="w-5 h-5" />
            <span>Relatórios</span>
          </NavLink> */}

          {/* Configurações */}
          {/* <NavLink
            to="/admin/configuracoes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all duration-200 ${isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </NavLink> */}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-[#20362C] bg-[#0E1B16]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src={user?.avatar} name={user?.name || 'Administrador'} size="sm" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">Diretoria Geral</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-kalin-border px-4 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-kalin-text hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-sm font-bold text-kalin-dark p-4">
              Painel de Controle Institucional
            </span>
          </div>

        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <QuickLoginHelper />
    </div>
  );
};
