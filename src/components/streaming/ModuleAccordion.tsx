import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Module, Lesson } from '../../types';
import { useNavigate } from 'react-router-dom';

export interface ModuleAccordionProps {
  modules: Module[];
  completedLessonIds?: string[];
  activeLessonId?: string;
  onSelectLesson?: (lesson: Lesson) => void;
  defaultExpandedIndex?: number;
}

export const ModuleAccordion: React.FC<ModuleAccordionProps> = ({
  modules,
  completedLessonIds = [],
  activeLessonId,
  onSelectLesson,
  defaultExpandedIndex = 0
}) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([defaultExpandedIndex]);
  const navigate = useNavigate();

  const toggleModule = (index: number) => {
    setExpandedIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (onSelectLesson) {
      onSelectLesson(lesson);
    } else {
      navigate(`/app/aula/${lesson.id}`);
    }
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, modIdx) => {
        const isExpanded = expandedIndices.includes(modIdx);
        const moduleLessons = mod.lessons || [];
        const completedInModule = moduleLessons.filter(l => completedLessonIds.includes(l.id)).length;
        const totalInModule = moduleLessons.length;

        return (
          <div
            key={mod.id}
            className="rounded-2xl border border-kalin-border bg-white overflow-hidden shadow-kalin-sm transition-all"
          >
            {/* Header Accordion Button */}
            <button
              onClick={() => toggleModule(modIdx)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-kalin-background/60 transition-colors focus:outline-none"
            >
              <div className="flex items-start gap-3.5 pr-2">
                <span className="w-8 h-8 rounded-xl bg-kalin-light text-kalin-primary font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {String(modIdx + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-bold text-kalin-dark text-sm sm:text-base leading-snug">
                    {mod.title}
                  </h4>
                  {mod.description && (
                    <p className="mt-0.5 text-xs text-kalin-muted line-clamp-1">
                      {mod.description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3 text-xs text-kalin-muted font-medium">
                    <span>{totalInModule} {totalInModule === 1 ? 'aula' : 'aulas'}</span>
                    <span>•</span>
                    <span className={completedInModule === totalInModule && totalInModule > 0 ? 'text-kalin-green font-semibold' : ''}>
                      {completedInModule} de {totalInModule} concluídas
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-1 rounded-lg text-kalin-muted hover:text-kalin-dark">
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>
            </button>

            {/* Lessons List (Collapsible) */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-kalin-background/30 divide-y divide-gray-100">
                {moduleLessons.length === 0 ? (
                  <div className="p-4 text-xs text-center text-kalin-muted italic">
                    Nenhuma aula cadastrada neste módulo.
                  </div>
                ) : (
                  moduleLessons.map((lesson, lesIdx) => {
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isActive = activeLessonId === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-colors group ${
                          isActive
                            ? 'bg-kalin-light/70 border-l-4 border-kalin-primary text-kalin-dark'
                            : 'hover:bg-white text-kalin-text'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 pr-3">
                          {/* Status Icon */}
                          <div className="flex-shrink-0">
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5 text-kalin-primary" />
                            ) : (
                              <PlayCircle className={`w-5 h-5 transition-colors ${isActive ? 'text-kalin-primary' : 'text-gray-400 group-hover:text-kalin-primary'}`} />
                            )}
                          </div>

                          {/* Order and Title */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono text-kalin-muted">
                                {String(lesIdx + 1).padStart(2, '0')}
                              </span>
                              <span className={`text-xs sm:text-sm font-semibold truncate ${isActive ? 'text-kalin-primary font-bold' : 'group-hover:text-kalin-primary'}`}>
                                {lesson.title}
                              </span>
                            </div>
                            {lesson.materials && lesson.materials.length > 0 && (
                              <div className="mt-0.5 flex items-center gap-1 text-[11px] text-kalin-muted">
                                <FileText className="w-3 h-3 text-kalin-muted" />
                                <span>{lesson.materials.length} {lesson.materials.length === 1 ? 'material' : 'materiais'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meta and Status */}
                        <div className="flex items-center gap-3 flex-shrink-0 text-xs">
                          <span className="flex items-center gap-1 text-kalin-muted font-medium">
                            <Clock className="w-3 h-3" />
                            <span>{lesson.durationFormatted}</span>
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium hidden sm:inline-block ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 font-semibold'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {isCompleted ? 'Concluída' : 'Pendente'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
