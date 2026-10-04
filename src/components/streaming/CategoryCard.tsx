import React from 'react';
import {
  Brain,
  Activity,
  Baby,
  Bone,
  HeartPulse,
  Wind,
  Heart,
  Building2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../../types';

export interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const navigate = useNavigate();

  const getIcon = (iconName: string) => {
    const props = { className: 'w-7 h-7' };
    switch (iconName) {
      case 'Brain':
        return <Brain {...props} />;
      case 'Activity':
        return <Activity {...props} />;
      case 'Baby':
        return <Baby {...props} />;
      case 'Bone':
        return <Bone {...props} />;
      case 'HeartPulse':
        return <HeartPulse {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Building2':
        return <Building2 {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const handleClick = () => {
    navigate(`/app/especialidades/${category.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white border border-kalin-border shadow-kalin-sm hover:shadow-kalin-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-kalin-primary/50 cursor-pointer overflow-hidden text-left select-none"
    >
      {/* Background Accent Gradient on Hover */}
      <div
        className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl pointer-events-none"
        style={{ backgroundColor: category.color || '#16A63A' }}
      />

      <div>
        {/* Icon Container with custom brand tint */}
        <div
          className="w-13 h-13 p-3 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color || '#16A63A'
          }}
        >
          {getIcon(category.iconName)}
        </div>

        {/* Title */}
        <h4 className="font-bold text-kalin-dark text-base leading-snug group-hover:text-kalin-primary transition-colors">
          {category.name}
        </h4>

        {/* Description */}
        <p className="mt-1.5 text-xs text-kalin-muted line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-semibold text-kalin-text">
          {category.coursesCount} {category.coursesCount === 1 ? 'curso' : 'cursos'}
        </span>
        <span className="text-kalin-primary group-hover:text-kalin-green flex items-center font-medium group-hover:translate-x-1 transition-transform">
          <span>Explorar</span>
          <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
        </span>
      </div>
    </div>
  );
};
