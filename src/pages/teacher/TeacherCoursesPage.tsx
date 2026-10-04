import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Video, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services';
import { Course } from '../../types';
import { Button } from '../../components/common/Button';

export const TeacherCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const teacherId = user?.id || 'prof-1';
        const teacherCourses = await courseService.getCourses({ teacherId });
        setCourses(teacherCourses);
      } catch (err) {
        console.error('Error fetching teacher courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-kalin-light border-t-kalin-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-kalin-dark">Meus Cursos e Formações</h1>
        <p className="text-xs text-kalin-muted mt-0.5">
          Programas de ensino desenvolvidos e ministrados por você na Kalin Educ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-kalin-border shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-kalin-dark">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-0.5 rounded bg-kalin-dark/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {course.categoryName}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-base font-bold text-kalin-dark">{course.title}</h3>
                <p className="text-xs text-kalin-muted mt-1 line-clamp-2">{course.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-kalin-muted">
                <div className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-kalin-primary" />
                  <span>{course.lessonsCount} aulas</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-kalin-primary" />
                  <span>{course.durationHours}h totais</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-kalin-primary" />
                  <span>{course.studentsCount} inscritos</span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
