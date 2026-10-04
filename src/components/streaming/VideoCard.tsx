import React from 'react';
import { Play, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ContinueWatchingItem } from '../../types';

export interface VideoCardProps {
  item: ContinueWatchingItem;
}

export const VideoCard: React.FC<VideoCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const { course, lesson, progressPercent } = item;

  const handleClick = () => {
    navigate(`/app/aula/${lesson.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-72 sm:w-80 cursor-pointer rounded-2xl overflow-hidden bg-white border border-kalin-border shadow-kalin-sm hover:shadow-kalin-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-kalin-primary/50 text-left select-none"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-kalin-dark">
        <img
          src={lesson.thumbnailUrl || course.thumbnailUrl}
          alt={lesson.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Duration badge */}
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1 border border-white/10">
          <Clock className="w-3 h-3 text-kalin-primary" />
          <span>{lesson.durationFormatted}</span>
        </div>

        {/* Floating Play Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
          <div className="w-12 h-12 rounded-full bg-kalin-primary text-white flex items-center justify-center shadow-kalin-glow">
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </div>
        </div>

        {/* Progress Bar at bottom of thumbnail */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/40">
          <div
            className="h-full bg-kalin-primary transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4">
        {/* Category & Percent Pill */}
        <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
          <span className="font-semibold text-kalin-green truncate max-w-[170px]">
            {course.categoryName}
          </span>
          <span className="text-[11px] font-bold text-kalin-dark bg-kalin-light px-2 py-0.5 rounded-full">
            {progressPercent}% concluído
          </span>
        </div>

        {/* Lesson Title */}
        <h4 className="font-bold text-kalin-dark text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-kalin-primary transition-colors">
          {lesson.title}
        </h4>

        {/* Teacher Name */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-kalin-muted">
          <User className="w-3.5 h-3.5 text-kalin-primary flex-shrink-0" />
          <span className="truncate">{course.teacherName}</span>
        </div>

        {/* Quick Action Button on mobile/desktop */}
        <div className="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-kalin-muted">Continuar aula</span>
          <button
            onClick={e => {
              e.stopPropagation();
              handleClick();
            }}
            className="text-xs font-semibold text-kalin-primary hover:text-kalin-green flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
          >
            <span>Assistir</span>
            <Play className="w-3 h-3 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
};
