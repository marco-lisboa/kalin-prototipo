import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Video,
  TrendingUp,
  Activity,
  Award,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import { activityService, studentService, teacherService, courseService, lessonService } from '../../services';
import { ActivityLog } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const list = await activityService.getRecentActivities(8);
        setActivities(list);
      } catch (err) {
        console.error('Error loading admin activities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-kalin-dark via-[#1a332a] to-kalin-green text-white p-6 sm:p-8 rounded-3xl shadow-kalin-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Painel Central do Super Administrador
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">
            Visão Geral Kalin Educ
          </h1>
          <p className="mt-1 text-xs text-kalin-light/80 max-w-xl">
            Acompanhe indicadores institucionais, métricas de adoção dos cursos e registros em tempo real.
          </p>
        </div>

        {/* <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-right">
            <span className="block text-[10px] text-gray-300 uppercase font-semibold">Status do Sistema</span>
            <span className="text-xs font-bold text-kalin-primary flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-kalin-primary animate-pulse" />
              100% Operacional
            </span>
          </div>
        </div> */}
      </div>

      {/* KPI Cards Oficiais (1.248 Alunos, 34 Professores, 12 Cursos, 186 Aulas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Alunos */}
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Total de Alunos</span>
            <div className="p-2.5 rounded-xl bg-kalin-light text-kalin-green">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">1.248</div>
          <div className="text-xs text-kalin-green font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14% novos cadastros no mês</span>
          </div>
        </div>

        {/* Professores */}
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Professores Cadastrados</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">34</div>
          <div className="text-xs text-blue-600 font-semibold">
            Mestres e Doutores Titulares
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Cursos Disponíveis</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kalin-dark">12</div>
          <div className="text-xs text-kalin-muted font-medium">
            Em 8 especialidades ativas
          </div>
        </div>

      </div>


      {/* ATIVIDADES RECENTES (REQUISITO EXPLÍCITO) */}
      {/* <div className="bg-white rounded-2xl border border-kalin-border shadow-xs p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-base font-bold text-kalin-dark flex items-center gap-2">
              <Activity className="w-5 h-5 text-kalin-primary" />
              <span>Atividades Recentes no Sistema</span>
            </h3>
            <p className="text-xs text-kalin-muted mt-0.5">
              Eventos disparados por alunos e professores na plataforma
            </p>
          </div>
          <span className="text-xs font-semibold text-kalin-muted">Atualizado em tempo real</span>
        </div>

        <div className="divide-y divide-gray-100">
          {activities.map(act => (
            <div key={act.id} className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-kalin-light text-kalin-primary flex items-center justify-center font-bold text-xs">
                  {act.userName.charAt(0)}
                </div>
                <div>
                  <p className="text-xs text-kalin-dark">
                    <strong className="font-bold">{act.userName}</strong>{' '}
                    <span className="text-kalin-muted">{act.action}</span>{' '}
                    <span className="font-semibold text-kalin-primary">{act.targetTitle}</span>
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-gray-400 whitespace-nowrap">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};
