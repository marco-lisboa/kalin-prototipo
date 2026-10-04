import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  BookOpen
} from 'lucide-react';
import { categoryService } from '../../services';
import { Category } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const AdminCategoriesPage: React.FC = () => {
  const { toast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Category Modal
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newColor, setNewColor] = useState('#16A63A');
  const [newIconName, setNewIconName] = useState('Brain');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit Category Modal
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editIconName, setEditIconName] = useState('');

  // Delete Category Dialog
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  const fetchCats = async () => {
    try {
      const list = await categoryService.getCategories(true); // include inactive
      setCategories(list);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast('Nome da categoria é obrigatório.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const slug = newName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

      await categoryService.createCategory({
        name: newName.trim(),
        slug,
        description: newDesc.trim() || 'Especialidade clínica da fisioterapia.',
        color: newColor,
        iconName: newIconName,
        isActive: true,
        order: categories.length + 1
      });

      toast('Especialidade criada com sucesso!', 'success');
      setIsNewModalOpen(false);
      setNewName('');
      setNewDesc('');
      await fetchCats();
    } catch (err) {
      toast('Erro ao cadastrar categoria.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setEditName(c.name);
    setEditDesc(c.description);
    setEditColor(c.color || '#16A63A');
    setEditIconName(c.iconName || 'Brain');
  };

  const handleSaveEdit = async () => {
    if (!editingCategory) return;
    setIsSubmitting(true);
    try {
      await categoryService.updateCategory(editingCategory.id, {
        name: editName.trim(),
        description: editDesc.trim(),
        color: editColor,
        iconName: editIconName
      });

      toast('Especialidade atualizada com sucesso!', 'success');
      setEditingCategory(null);
      await fetchCats();
    } catch (err) {
      toast('Erro ao atualizar categoria.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await categoryService.toggleCategoryActive(id);
      toast('Status da especialidade alterado.', 'info');
      await fetchCats();
    } catch (err) {
      toast('Erro ao alterar status.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCatId) return;
    try {
      await categoryService.deleteCategory(deletingCatId);
      toast('Especialidade excluída com sucesso.', 'info');
      setDeletingCatId(null);
      await fetchCats();
    } catch (err) {
      toast('Erro ao excluir especialidade.', 'error');
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-kalin-dark">Especialidades & Categorias</h1>
          <p className="text-xs text-kalin-muted mt-0.5">
            Gerencie as 8 grandes áreas da Fisioterapia e adicione novas subespecialidades.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => setIsNewModalOpen(true)}
        >
          Nova Especialidade
        </Button>
      </div>

      {/* Grid of Categories Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map(cat => (
          <div
            key={cat.id}
            className={`p-5 rounded-2xl border transition-all bg-white flex flex-col justify-between ${
              cat.isActive ? 'border-kalin-border shadow-xs' : 'border-gray-200 opacity-60 bg-gray-50'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color || '#16A63A' }}
                />
                <button
                  onClick={() => handleToggleActive(cat.id)}
                  className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors ${
                    cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'
                  }`}
                  title="Clique para ativar/desativar"
                >
                  {cat.isActive ? 'Ativa' : 'Inativa'}
                </button>
              </div>

              <h3 className="font-bold text-base text-kalin-dark">{cat.name}</h3>
              <p className="text-xs text-kalin-muted mt-1.5 line-clamp-3 leading-relaxed">
                {cat.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="font-bold text-kalin-primary">
                {cat.coursesCount || 0} {cat.coursesCount === 1 ? 'curso' : 'cursos'}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 text-kalin-muted hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Editar Categoria"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeletingCatId(cat.id)}
                  className="p-1.5 text-kalin-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  title="Excluir Categoria"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Nova Categoria */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Nova Especialidade"
        subtitle="Adicione uma nova categoria de formação à plataforma."
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate} isLoading={isSubmitting}>
              Salvar Especialidade
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4 text-left">
          <Input
            label="Nome da Especialidade"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Ex: Fisioterapia Pélvica e Uroginecológica"
            required
          />

          <div>
            <label className="block text-sm font-medium text-kalin-text mb-1">
              Descrição
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Descreva o escopo e os principais tópicos clínicos abordados..."
              className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Cor de Destaque
              </label>
              <input
                type="color"
                value={newColor}
                onChange={e => setNewColor(e.target.value)}
                className="w-full h-10 p-1 border border-kalin-border rounded-xl cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Ícone do Sistema
              </label>
              <select
                value={newIconName}
                onChange={e => setNewIconName(e.target.value)}
                className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
              >
                <option value="Brain">Brain (Cérebro / Neuro)</option>
                <option value="Activity">Activity (Esporte)</option>
                <option value="Bone">Bone (Ortopedia / Ossos)</option>
                <option value="Baby">Baby (Pediatria)</option>
                <option value="HeartPulse">HeartPulse (Geronto)</option>
                <option value="Wind">Wind (Respiratória)</option>
                <option value="Heart">Heart (Cardiorrespiratória)</option>
                <option value="Building2">Building2 (Hospitalar)</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: Editar Categoria */}
      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          title="Editar Especialidade"
          subtitle={editingCategory.name}
          size="md"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setEditingCategory(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveEdit} isLoading={isSubmitting}>
                Salvar Alterações
              </Button>
            </>
          }
        >
          <div className="space-y-4 text-left">
            <Input
              label="Nome da Especialidade"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />

            <div>
              <label className="block text-sm font-medium text-kalin-text mb-1">
                Descrição
              </label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={e => setEditDesc(e.target.value)}
                className="w-full p-3 border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Cor de Destaque
                </label>
                <input
                  type="color"
                  value={editColor}
                  onChange={e => setEditColor(e.target.value)}
                  className="w-full h-10 p-1 border border-kalin-border rounded-xl cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-kalin-text mb-1">
                  Ícone
                </label>
                <select
                  value={editIconName}
                  onChange={e => setEditIconName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-kalin-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kalin-primary/20"
                >
                  <option value="Brain">Brain (Cérebro / Neuro)</option>
                  <option value="Activity">Activity (Esporte)</option>
                  <option value="Bone">Bone (Ortopedia / Ossos)</option>
                  <option value="Baby">Baby (Pediatria)</option>
                  <option value="HeartPulse">HeartPulse (Geronto)</option>
                  <option value="Wind">Wind (Respiratória)</option>
                  <option value="Heart">Heart (Cardiorrespiratória)</option>
                  <option value="Building2">Building2 (Hospitalar)</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deletingCatId}
        onClose={() => setDeletingCatId(null)}
        onConfirm={handleConfirmDelete}
        title="Excluir Especialidade"
        message="Tem certeza de que deseja remover esta especialidade? Ela deixará de ser exibida aos alunos na home."
        confirmText="Sim, excluir especialidade"
      />
    </div>
  );
};
