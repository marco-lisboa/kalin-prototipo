import React, { useState, useEffect } from 'react';
import { Users, Search, Mail, Calendar, CheckCircle2, Award } from 'lucide-react';
import { studentService } from '../../services';
import { Student } from '../../types';
import { SearchInput } from '../../components/common/SearchInput';
import { Avatar } from '../../components/common/Avatar';

export const TeacherStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const list = await studentService.getStudents();
        setStudents(list);
      } catch (err) {
        console.error('Error fetching students:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Alunos Inscritos</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Acompanhe a lista de profissionais matriculados nas suas turmas.
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar aluno..."
          className="w-full sm:w-72"
        />
      </div>

      <div className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-kalin-border text-kalin-muted font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Aluno</th>
                <th className="py-3.5 px-4">E-mail</th>
                <th className="py-3.5 px-4">Data de Inscrição</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-kalin-light/20 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={s.avatar} name={s.name} size="sm" />
                      <div>
                        <span className="font-bold text-kalin-dark block">{s.name}</span>
                        <span className="text-[11px] text-kalin-muted">Fisioterapeuta</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-kalin-muted">
                    {s.email}
                  </td>

                  <td className="py-3.5 px-4 text-kalin-muted">
                    {s.createdAt}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        s.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {s.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
