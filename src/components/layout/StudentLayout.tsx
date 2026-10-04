import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Compass,
  BookOpen,
  Layers,
  GraduationCap,
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import { Avatar } from '../common/Avatar';
import { QuickLoginHelper } from '../common/QuickLoginHelper';

export const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/app', label: 'Início', end: true },
    { to: '/app/cursos', label: 'Meus Cursos' },
    { to: '/app/especialidades', label: 'Especialidades' },
    { to: '/app/progresso', label: 'Meu Progresso' },
  ];

  return (
    <div className="min-h-screen bg-kalin-background flex flex-col selection:bg-kalin-primary selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-kalin-border shadow-kalin-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-8">
              {/* <img src="/src/public/kalin.png" alt="Kalin" className="w-12 h-12" /> */}
              < Logo to='/app' />
              {/* Desktop Navigation Links */}
              <nav className="hiddSen md:flex items-center gap-1">
                {navLinks.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                        ? 'bg-kalin-light text-kalin-green shadow-xs'
                        : 'text-kalin-text/80 hover:text-kalin-dark hover:bg-gray-100/70'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right Side: Notifications & Profile */}
            <div className="flex items-center gap-3">
              {/* Notifications Button & Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 rounded-xl text-kalin-muted hover:text-kalin-dark hover:bg-gray-100 transition-colors focus:outline-none"
                  aria-label="Notificações"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-kalin-primary" />
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-kalin-border rounded-2xl shadow-kalin-lg p-4 z-50 animate-slide-up text-left">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                      <h4 className="font-bold text-sm text-kalin-dark">Notificações</h4>
                      <span className="text-[11px] font-semibold text-kalin-primary bg-kalin-light px-2 py-0.5 rounded-full">
                        2 novas
                      </span>
                    </div>
                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-kalin-light/50 border border-kalin-primary/20 flex gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-kalin-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-kalin-dark">Nova aula disponível!</p>
                          <p className="text-kalin-muted mt-0.5">Módulo de Lesão Medular já está liberado na Formação Neurofuncional.</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">Há 2 horas</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-gray-50 flex gap-2.5">
                        <Award className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-kalin-dark">Parabéns pelo seu progresso!</p>
                          <p className="text-kalin-muted mt-0.5">Você concluiu 70% do curso de Fisioterapia Neurofuncional.</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">Ontem</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none"
                >
                  <Avatar
                    src={user?.avatar}
                    name={user?.name || 'Aluno'}
                    size="sm"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-kalin-dark truncate max-w-[120px]">
                      {user?.name?.split(' ')[0] || 'Aluno'}
                    </span>
                    <span className="text-[10px] text-kalin-muted font-medium">
                      Fisioterapeuta
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-kalin-muted" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-kalin-border rounded-2xl shadow-kalin-lg p-2 z-50 animate-slide-up text-left">
                    {/* User info header */}
                    <div className="px-3 py-2.5 border-b border-gray-100 mb-1">
                      <p className="text-xs font-bold text-kalin-dark truncate">{user?.name}</p>
                      <p className="text-[11px] text-kalin-muted truncate">{user?.email}</p>
                      <div className="mt-1.5 inline-block text-[10px] font-semibold text-kalin-green bg-kalin-light px-2 py-0.5 rounded">
                        CPF: {user?.cpf}
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/app/perfil');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-kalin-text hover:bg-kalin-light/70 hover:text-kalin-green font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-kalin-muted" />
                        <span>Meu Perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/app/progresso');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-kalin-text hover:bg-kalin-light/70 hover:text-kalin-green font-medium transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-kalin-muted" />
                        <span>Meu Progresso</span>
                      </button>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sair da conta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-kalin-text hover:bg-gray-100 transition-colors"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-kalin-border bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg animate-slide-up">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${isActive
                    ? 'bg-kalin-light text-kalin-green'
                    : 'text-kalin-text hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* Main Outlet */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-kalin-dark text-white border-t border-kalin-darkborder py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Logo variant="light" to="/app" />
            <p className="mt-2 text-xs text-kalin-light/70 max-w-sm text-center md:text-left">
              Plataforma de streaming e educação continuada especializada em Fisioterapia. Conhecimento que transforma práticas clínicas.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-kalin-light/80">
            <span>© 2026 Grupo Kalin. Todos os direitos reservados.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-kalin-primary font-semibold">Protótipo Comercial v1.0</span>
          </div>
        </div>
      </footer>

      {/* Floating Demo Helper */}
      <QuickLoginHelper />
    </div>
  );
};
