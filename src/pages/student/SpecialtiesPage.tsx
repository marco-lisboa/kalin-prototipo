import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services';
import { Category } from '../../types';
import { CategoryCard } from '../../components/streaming/CategoryCard';
import { SearchInput } from '../../components/common/SearchInput';
import { Layers } from 'lucide-react';

export const SpecialtiesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await categoryService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching specialties:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCats();
  }, []);

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-kalin-dark tracking-tight">
            Especialidades em Fisioterapia
          </h1>
          <p className="mt-1 text-sm text-kalin-muted">
            Explore as grandes áreas de atuação e aprofunde seus conhecimentos clínicos.
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Buscar especialidade..."
          className="w-full sm:w-72"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(cat => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
};
