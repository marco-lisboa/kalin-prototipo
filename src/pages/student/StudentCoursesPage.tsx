import React, { useState, useEffect } from 'react';
import { BookOpen, Filter, Search, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { courseService, progressService, categoryService } from '../../services';
import { Course, Category, StudentProgress } from '../../types';
import { CourseCard } from '../../components/streaming/CourseCard';
import { SearchInput } from '../../components/common/SearchInput';
import { EmptyState } from '../../components/common/EmptyState';

export const StudentCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, StudentProgress>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = user?.id || 'student-1';
        const allCourses = await courseService.getCourses({ status: 'published' });
        const allProgress = await progressService.getAllStudentProgress(userId);
        const cats = await categoryService.getCategories();

        const pMap: Record<string, StudentProgress> = {};
        allProgress.forEach(p => {
          pMap[p.courseId] = p;
        });

        setCourses(allCourses);
        setProgressMap(pMap);
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching courses page:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filtragem
  const filteredCourses = courses.filter(course => {
    const prog = progressMap[course.id];
    const percent = prog ? prog.percentCompleted : 0;

    // Filtro por Tab (Todas, Em andamento, Concluídos)
    if (activeTab === 'in_progress' && (percent === 0 || percent >= 100)) return false;
    if (activeTab === 'completed' && percent < 100) return false;

    // Filtro por Categoria
    if (selectedCategory !== 'all' && course.categoryId !== selectedCategory) return false;

    // Filtro por Busca
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchCategory = course.categoryName.toLowerCase().includes(q);
      const matchTeacher = course.teacherName.toLowerCase().includes(q);
      return matchTitle || matchCategory || matchTeacher;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
          Meus Cursos e Formações
        </h1>
        <p className="mt-1 text-sm text-kalin-muted">
          Acompanhe seu avanço em cada especialidade e acesse todas as suas aulas.
        </p>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-kalin-border">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-kalin-border rounded-xl shadow-xs">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'in_progress', label: 'Em andamento' },
            { id: 'completed', label: 'Concluídos' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-kalin-primary text-white shadow-xs'
                  : 'text-kalin-text hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 bg-white border border-kalin-border rounded-xl text-xs font-semibold text-kalin-text focus:outline-none focus:ring-2 focus:ring-kalin-primary/20 focus:border-kalin-primary"
          >
            <option value="all">Todas as Especialidades</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por curso ou professor..."
            className="w-full sm:w-64"
          />
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              progress={progressMap[course.id] || null}
              showProgress={true}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-8 h-8" />}
          title="Nenhum curso encontrado"
          description="Não encontramos nenhum curso que corresponda aos filtros selecionados. Tente redefinir os parâmetros."
          actionText="Limpar Filtros"
          onAction={() => {
            setActiveTab('all');
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};
