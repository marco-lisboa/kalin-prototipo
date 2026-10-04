import { Category } from '../types';
import { StorageService, StorageKeys } from './storage';

export const categoryService = {
  // Obter categorias
  async getCategories(includeInactive: boolean = false): Promise<Category[]> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    let filtered = categories;
    if (!includeInactive) {
      filtered = filtered.filter(c => c.isActive);
    }
    return filtered.sort((a, b) => a.order - b.order);
  },

  // Obter categoria por ID
  async getCategoryById(id: string): Promise<Category | null> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    return categories.find(c => c.id === id) || null;
  },

  // Obter categoria por Slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    return categories.find(c => c.slug === slug) || null;
  },

  // Criar categoria
  async createCategory(data: Omit<Category, 'id' | 'coursesCount'>): Promise<Category> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      coursesCount: 0
    };
    categories.push(newCategory);
    StorageService.set(StorageKeys.CATEGORIES, categories);
    return newCategory;
  },

  // Atualizar categoria
  async updateCategory(id: string, data: Partial<Category>): Promise<Category | null> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    const updated = { ...categories[index], ...data };
    categories[index] = updated;
    StorageService.set(StorageKeys.CATEGORIES, categories);
    return updated;
  },

  // Excluir categoria
  async deleteCategory(id: string): Promise<boolean> {
    let categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    const initialLen = categories.length;
    categories = categories.filter(c => c.id !== id);
    if (categories.length !== initialLen) {
      StorageService.set(StorageKeys.CATEGORIES, categories);
      return true;
    }
    return false;
  },

  // Alternar ativação de categoria
  async toggleCategoryActive(id: string): Promise<Category | null> {
    const categories = StorageService.get<Category[]>(StorageKeys.CATEGORIES, []);
    const category = categories.find(c => c.id === id);
    if (!category) return null;

    return this.updateCategory(id, { isActive: !category.isActive });
  }
};
