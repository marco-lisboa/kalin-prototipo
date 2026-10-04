import React from 'react';
import { Star, Clock, BookOpen, ChevronRight, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Course, StudentProgress } from '../../types';
import { ProgressBar } from '../common/ProgressBar';

export interface CourseCardProps {
  course: Course;
  progress?: StudentProgress | null;
  showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  showProgress = false
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/app/cursos/${course.id}`);
  };

  const percent = progress ? progress.percentCompleted : undefined;

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-kalin-border shadow-kalin-sm hover:shadow-kalin-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-kalin-primary/40 cursor-pointer text-left select-none"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-kalin-dark">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />

        {/* Level / Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-kalin-dark/80 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
            {course.level}
          </span>
          {course.isNew && (
            <span className="px-2 py-0.5 rounded-md bg-kalin-primary text-white text-[10px] font-bold tracking-wide uppercase shadow-sm">
              Novo
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1 border border-white/10">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{course.rating.toFixed(1)}</span>
        </div>

        {/* Certificate Tag */}
        {course.certificateProvided && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
            <Award className="w-3 h-3 text-kalin-primary" />
            <span>Certificado</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <div className="text-xs font-bold text-kalin-green uppercase tracking-wider mb-1.5">
            {course.categoryName}
          </div>

          {/* Title */}
          <h3 className="font-bold text-kalin-dark text-base line-clamp-2 leading-snug group-hover:text-kalin-primary transition-colors">
            {course.title}
          </h3>

          {/* Instructor with Avatar */}
          <div className="mt-3 flex items-center gap-2.5">
            <img
              src={course.teacherAvatar}
              alt={course.teacherName}
              className="w-6 h-6 rounded-full object-cover border border-kalin-border"
            />
            <span className="text-xs text-kalin-muted font-medium truncate">
              {course.teacherName}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-kalin-muted mb-3">
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-kalin-primary" />
              <span>{course.lessonsCount} aulas</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-kalin-primary" />
              <span>{course.durationHours}h de conteúdo</span>
            </div>
          </div>

          {/* Progress bar if present */}
          {showProgress && percent !== undefined ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-kalin-muted">Seu progresso</span>
                <span className="text-kalin-green">{percent}%</span>
              </div>
              <ProgressBar progress={percent} size="sm" />
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-semibold text-kalin-primary group-hover:text-kalin-green">
              <span>{percent !== undefined && percent > 0 ? 'Continuar curso' : 'Ver detalhes'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
