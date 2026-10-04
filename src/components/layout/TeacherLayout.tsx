import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Users,
  User,
  LogOut,
  PlusCircle,
  Menu,
  X,
  Bell,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import { QuickLoginHelper } from '../common/QuickLoginHelper';

export const TeacherLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/teacher', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { to: '/teacher/aulas', label: 'Minhas Aulas', icon: <Video className="w-5 h-5" /> },
    { to: '/teacher/cursos', label: 'Meus Cursos', icon: <BookOpen className="w-5 h-5" /> },
    { to: '/teacher/alunos', label: 'Alunos', icon: <Users className="w-5 h-5" /> },
    { to: '/teacher/perfil', label: 'Meu Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-kalin-dark text-white border-r border-kalin-darkborder shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-kalin-darkborder">
          <Logo variant="light" to="/teacher" />
          <div className="mt-2 text-[11px] font-semibold text-kalin-primary uppercase tracking-wider bg-white/5 py-1 px-2.5 rounded-md inline-block">
            Portal do Professor
          </div>
        </div>

        {/* CTA Nova Aula */}
        <div className="p-4">
          <Button
            variant="primary"
            className="w-full shadow-kalin-glow/30"
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => navigate('/teacher/aulas/nova')}
          >
            Nova Aula
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-kalin-primary text-white shadow-kalin-glow/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-kalin-darkborder bg-[#13251E]">
          <div className="flex items-center gap-3 mb-3">
            <Avatar src={user?.avatar} name={user?.name || 'Professor'} size="sm" />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">Docente Titular</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-64 max-w-xs bg-kalin-dark text-white flex flex-col z-50">
            <div className="p-4 flex items-center justify-between border-b border-kalin-darkborder">
              <Logo variant="light" to="/teacher" />
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <Button
                variant="primary"
                className="w-full"
                size="sm"
                leftIcon={<PlusCircle className="w-4 h-4" />}
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate('/teacher/aulas/nova');
                }}
              >
                Nova Aula
              </Button>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold ${isActive ? 'bg-kalin-primary text-white' : 'text-gray-300 hover:bg-white/5'
                    }`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-kalin-darkborder">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Teacher Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-kalin-border shadow-xs px-4 sm:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-kalin-text hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-bold text-kalin-dark leading-tight">
                Olá, {user?.name || 'Professor'}
              </h2>
              <p className="text-xs text-kalin-muted hidden sm:block">
                Gerencie seus cursos, aulas publicadas e acompanhe seus alunos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="w-4 h-4" />}
              onClick={() => navigate('/teacher/aulas/nova')}
            >
              Nova Aula
            </Button>
          </div>
        </header>

        {/* Sub-view Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <QuickLoginHelper />
    </div>
  );
};
