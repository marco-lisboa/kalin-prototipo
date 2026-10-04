import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, BookOpen, Users, Video, Award } from 'lucide-react';
import { categoryService, courseService, teacherService } from '../../services';
import { Category, Course, Teacher } from '../../types';
import { CourseCard } from '../../components/streaming/CourseCard';

export const SpecialtyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      try {
        const cat = await categoryService.getCategoryBySlug(slug);
        if (cat) {
          setCategory(cat);
          const catCourses = await courseService.getCourses({ categoryId: cat.id, status: 'published' });
          setCourses(catCourses);

          // Professores que lecionam nesta categoria
          const allTeachers = await teacherService.getTeachers({ specialtyId: cat.id });
          setTeachers(allTeachers);
        }
      } catch (err) {
        console.error('Error fetching specialty details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-kalin-dark">Especialidade não encontrada</h2>
        <Link to="/app/especialidades" className="text-kalin-primary font-bold mt-4 inline-block">
          Voltar para Especialidades
        </Link>
      </div>
    );
  }

  const totalLessons = courses.reduce((acc, c) => acc + c.lessonsCount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <Link
        to="/app/especialidades"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-kalin-muted hover:text-kalin-dark transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Voltar para todas as especialidades</span>
      </Link>

      {/* Specialty Banner */}
      <div
        className="p-8 sm:p-12 rounded-3xl text-white relative overflow-hidden shadow-kalin-lg"
        style={{
          background: `linear-gradient(135deg, #193027 0%, ${category.color || '#0B6B18'} 100%)`
        }}
      >
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            Área de Especialização
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">{category.name}</h1>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            {category.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-kalin-light" />
              <span>{courses.length} {courses.length === 1 ? 'Curso' : 'Cursos'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-kalin-light" />
              <span>{totalLessons} Aulas Práticas</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-kalin-light" />
              <span>{teachers.length || 1} Especialistas Docentes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cursos desta Especialidade */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-kalin-dark">Cursos Disponíveis nesta Especialidade</h2>
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} showProgress={false} />
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-white border border-dashed border-kalin-border text-center text-sm text-kalin-muted">
            Novos cursos desta especialidade estão sendo gravados pelo corpo docente.
          </div>
        )}
      </div>

      {/* Docentes da Especialidade */}
      <div className="space-y-4 pt-6 border-t border-kalin-border">
        <h2 className="text-xl font-bold text-kalin-dark">Professores e Coordenadores da Área</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(teachers.length > 0 ? teachers : [
            {
              id: 'prof-default',
              name: 'Corpo Docente Kalin Educ',
              title: 'Doutores e Especialistas Hospitalares',
              avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
              bio: 'Professores com mais de 10 anos de experiência clínica no Grupo Kalin.'
            }
          ]).map((teacher: any) => (
            <div key={teacher.id} className="p-5 bg-white rounded-2xl border border-kalin-border flex items-start gap-4 shadow-xs">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-14 h-14 rounded-2xl object-cover border border-kalin-border flex-shrink-0"
              />
              <div>
                <h4 className="font-bold text-sm text-kalin-dark">{teacher.name}</h4>
                <p className="text-xs text-kalin-green font-semibold mt-0.5">{teacher.title}</p>
                <p className="text-[11px] text-kalin-muted mt-1.5 line-clamp-2">{teacher.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
