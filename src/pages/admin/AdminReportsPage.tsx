import React from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Award,
  TrendingUp,
  Users,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

export const AdminReportsPage: React.FC = () => {
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast(`Exportação simulada gerada com sucesso: relatorio_academico_kalin.${format}`, 'success');
  };

  return (
    <div className="space-y-8 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Relatórios e Métricas Institucionais</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Analise dados consolidados de conclusão de cursos, retenção e engajamento.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
            onClick={() => handleExport('csv')}
          >
            Exportar CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => handleExport('pdf')}
          >
            Exportar Relatório PDF
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Taxa Média de Conclusão</span>
          <div className="text-3xl font-black text-kalin-dark">74.2%</div>
          <p className="text-[11px] text-kalin-green font-medium">+8% acima da média de plataformas EAD de saúde</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Total de Horas Transmitidas</span>
          <div className="text-3xl font-black text-kalin-dark">4.920h</div>
          <p className="text-[11px] text-blue-600 font-medium">Consumo contínuo de aulas práticas</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-kalin-border shadow-xs space-y-2">
          <span className="text-xs font-bold text-kalin-muted uppercase tracking-wider">Certificados Emitidos</span>
          <div className="text-3xl font-black text-kalin-dark">892</div>
          <p className="text-[11px] text-amber-600 font-medium">Validados e autenticados pelo Grupo Kalin</p>
        </div>
      </div>

      {/* Relatório por Curso */}
      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs p-6 sm:p-7 space-y-4">
        <h3 className="text-base font-bold text-kalin-dark">Desempenho por Formação Especializada</h3>

        <div className="divide-y divide-gray-100 text-xs">
          {[
            { name: 'Formação em Fisioterapia Neurofuncional', students: 412, completionRate: '78%', rating: 4.9, hours: '1.420h' },
            { name: 'Fisioterapia Esportiva na Prática', students: 380, completionRate: '72%', rating: 4.8, hours: '1.180h' },
            { name: 'Avaliação e Tratamento Traumato-Ortopédico', students: 295, completionRate: '75%', rating: 4.9, hours: '940h' },
            { name: 'Fisioterapia Respiratória e Ventilação na UTI', students: 310, completionRate: '81%', rating: 4.9, hours: '860h' },
            { name: 'Fundamentos da Fisioterapia Pediátrica', students: 184, completionRate: '69%', rating: 4.7, hours: '520h' }
          ].map(row => (
            <div key={row.name} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-bold text-sm text-kalin-dark block">{row.name}</span>
                <span className="text-kalin-muted">{row.students} alunos matriculados • {row.hours} assistidas</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] uppercase">Conclusão</span>
                  <span className="font-bold text-kalin-green text-sm">{row.completionRate}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] uppercase">Avaliação</span>
                  <span className="font-bold text-amber-500 text-sm">★ {row.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
