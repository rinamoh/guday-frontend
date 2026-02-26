import { useEffect, useMemo, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import {
  type AdminCategory,
  type AdminCategoryCreateRequest,
} from '../api/adminCategories';
import { useAdminCategories, useAdminCategory } from '../features/admin/categories/queries';
import {
  useCreateAdminCategory,
  useUpdateAdminCategory,
  useDeleteAdminCategory,
} from '../features/admin/categories/mutations';

type FlatCategory = AdminCategory & {
  depth: number;
  parent_name?: string;
};

const EMPTY_FORM: AdminCategoryCreateRequest = {
  name: '',
  slug: '',
  description: '',
  parent_id: null,
  icon_url: '',
  display_order: 1,
};

function flattenCategoryTree(
  nodes: AdminCategory[],
  depth = 0,
  parent?: AdminCategory
): FlatCategory[] {
  const out: FlatCategory[] = [];

  for (const node of nodes) {
    out.push({
      ...node,
      depth,
      parent_id: node.parent_id ?? parent?.id ?? null,
      parent_name: parent?.name,
    });

    if (Array.isArray(node.children) && node.children.length > 0) {
      out.push(...flattenCategoryTree(node.children, depth + 1, node));
    }
  }

  return out;
}

export function AdminCategoriesPage() {
  const categoriesQuery = useAdminCategories();
  const createMutation = useCreateAdminCategory();
  const updateMutation = useUpdateAdminCategory();
  const deleteMutation = useDeleteAdminCategory();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminCategoryCreateRequest>(EMPTY_FORM);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const detailQuery = useAdminCategory(editingId ?? '');

  useEffect(() => {
    if (!editingId || !detailQuery.data) return;
    const c = detailQuery.data;
    setForm({
      name: c.name || '',
      slug: c.slug || '',
      description: c.description || '',
      parent_id: c.parent_id ?? null,
      icon_url: c.icon_url || '',
      display_order: typeof c.display_order === 'number' ? c.display_order : 1,
    });
  }, [editingId, detailQuery.data]);

  const categoryTree = categoriesQuery.data?.data ?? [];

  const flatCategories = useMemo(() => {
    return flattenCategoryTree(categoryTree);
  }, [categoryTree]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return flatCategories;

    return flatCategories.filter((c) =>
      [
        c.name,
        c.slug,
        c.description || '',
        c.parent_name || '',
        String(c.service_count ?? ''),
      ].some((v) => v.toLowerCase().includes(q))
    );
  }, [flatCategories, searchQuery]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Categories' },
  ];

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage(null);
    setIsFormOpen(true);
  }

  function openEdit(id: string) {
    setEditingId(id);
    setErrorMessage(null);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrorMessage(null);
  }

  function updateField<K extends keyof AdminCategoryCreateRequest>(key: K, value: AdminCategoryCreateRequest[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.slug.trim()) return 'Slug is required.';
    if (form.display_order < 0) return 'Display order must be 0 or greater.';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const err = validate();
    if (err) {
      setErrorMessage(err);
      return;
    }

    try {
      const payload: AdminCategoryCreateRequest = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim() || undefined,
        parent_id: form.parent_id?.trim() ? form.parent_id.trim() : null,
        icon_url: form.icon_url?.trim() || undefined,
        display_order: Number(form.display_order || 0),
      };

      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: payload });
        alert('Category updated successfully');
      } else {
        await createMutation.mutateAsync(payload);
        alert('Category created successfully');
      }

      closeForm();
    } catch (error) {
      setErrorMessage((error as Error).message || 'Failed to save category.');
    }
  }

  function onDelete(id: string) {
    if (!window.confirm('Delete this category?')) return;

    deleteMutation.mutate(id, {
      onSuccess: () => alert('Category deleted successfully'),
      onError: (error) => alert(`Failed to delete category: ${(error as Error).message}`),
    });
  }

  return (
    <AdminLayout
      title="Category Management"
      breadcrumbs={breadcrumbs}
      actions={
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-sm mr-2">add</span>
          Add Category
        </button>
      }
    >
      <main className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-primary focus:border-primary"
                placeholder="Search categories by name, slug, parent..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {categoriesQuery.isLoading ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-slate-600">
              Loading categories...
            </div>
          ) : categoriesQuery.error ? (
            <div className="bg-white rounded-xl border border-red-200 p-8 text-red-600">
              Failed to load categories: {(categoriesQuery.error as Error).message}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">SubCategory</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Parent</th>
                      
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Services</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          <div className="flex items-center" style={{ paddingLeft: `${c.depth * 18}px` }}>
                            {c.depth > 0 && (
                              <span className="material-symbols-outlined text-slate-400 text-base mr-1">
                                subdirectory_arrow_right
                              </span>
                            )}
                            {c.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{c.slug}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{c.parent_name || '-'}</td>
                       
                        <td className="px-6 py-4 text-sm text-slate-600">{c.service_count ?? 0}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(c.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => onDelete(c.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-sm text-slate-500">
                          No categories found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isFormOpen && (
            <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl bg-white rounded-xl border border-slate-200 shadow-xl">
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingId ? 'Edit Category' : 'Create Category'}
                  </h3>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                  {errorMessage && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Sub Category</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => updateField('slug', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                    <textarea
                      value={form.description || ''}
                      onChange={(e) => updateField('description', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm min-h-[90px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Parent ID</label>
                      <input
                        type="text"
                        value={form.parent_id || ''}
                        onChange={(e) => updateField('parent_id', e.target.value || null)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                        placeholder="optional"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Display Order</label>
                      <input
                        type="number"
                        min={0}
                        value={form.display_order}
                        onChange={(e) => updateField('display_order', Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Icon URL</label>
                    <input
                      type="url"
                      value={form.icon_url || ''}
                      onChange={(e) => updateField('icon_url', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                      placeholder="https://example.com/icon.svg"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending || detailQuery.isFetching}
                      className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
                    >
                      {editingId ? 'Save Changes' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}
