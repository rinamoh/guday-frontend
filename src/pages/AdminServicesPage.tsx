import { AdminLayout } from '../layouts/AdminLayout';
import { ServicesSearchAndFilters } from '../components/admin/ServicesSearchAndFilters';
import { ServicesGrid } from '../components/admin/ServicesGrid';
import { ServicesPageHeaderActions } from '../components/admin/ServicesPageHeaderActions';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminServices } from '../features/admin/services/queries';
import { useArchiveAdminService, useDeleteAdminService } from '../features/admin/services/mutations';
import { useAdminLanguage } from '../hooks/useAdminLanguage';
import { AdminLanguageSelect } from '../components/admin/AdminLanguageSelect';
import { useAdminCategories } from '../features/admin/categories/queries';
import { type AdminCategory } from '../api/adminCategories';
import { useLinkAdminCategoryTranslation } from '../features/admin/categories/mutations';

type FlatOption = { id: string; label: string };

function flattenCategoryOptions(nodes: AdminCategory[], depth = 0): FlatOption[] {
  const out: FlatOption[] = [];
  const prefix = depth > 0 ? `${'  '.repeat(depth)}- ` : '';

  for (const n of nodes) {
    out.push({ id: n.id, label: `${prefix}${n.name}` });

    if (Array.isArray(n.children) && n.children.length > 0) {
      out.push(...flattenCategoryOptions(n.children, depth + 1));
    }
  }

  return out;
}

export function AdminServicesPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useAdminLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { data: servicesResponse, isLoading, error } = useAdminServices({
    page: 1,
    page_size: 50,
    status: statusFilter !== 'All Status' ? statusFilter.toLowerCase() : undefined,
    category_id: selectedCategoryId || undefined,
    search: searchQuery || undefined,
    language,
  });

  const archiveMutation = useArchiveAdminService();
  const deleteMutation = useDeleteAdminService();

  const services =
    servicesResponse?.data?.map((service) => ({
      id: service.id,
      title: service.title,
      description: service.overview,
      status: service.status === 'published' ? ('Published' as const) : ('Draft' as const),
      icon: 'description',
      lastUpdated: new Date(service.updated_at).toLocaleDateString(),
      categoryId: service.category_id,
      subCategoryId: service.sub_category_id,
    })) || [];

  const handleEditService = (id: string) => {
    const selected = servicesResponse?.data?.find((s) => s.id === id);
    navigate(`/admin/services/${id}/edit`, {
      state: { service: selected },
    });
  };

  const handleArchiveService = (id: string) => {
    if (window.confirm('Are you sure you want to archive this service?')) {
      archiveMutation.mutate(id, {
        onSuccess: () => {
          alert('Service archived successfully');
        },
        onError: (err) => {
          alert(`Failed to archive service: ${err.message}`);
        },
      });
    }
  };

  const handleDeleteService = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this service? This action cannot be undone.')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          alert('Service deleted successfully');
        },
        onError: (err) => {
          alert(`Failed to delete service: ${err.message}`);
        },
      });
    }
  };

  const handleCreateService = () => {
    navigate('/admin/services/new');
  };

  const handleAddService = () => {
    handleCreateService();
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
  };

  const breadcrumbs = [
    { label: 'Content Management', href: '/admin/services' },
    { label: 'Service Directory' },
  ];

  // Translation linking modal state
  const canLinkTranslations = language === 'en'; // endpoint expects en_category_id as source

  const [linkOpen, setLinkOpen] = useState(false);
  const [linkServiceId, setLinkServiceId] = useState<string | null>(null);
  const [targetCategoryId, setTargetCategoryId] = useState('');
  const [linkError, setLinkError] = useState<string | null>(null);

  const selectedService = useMemo(() => {
    if (!linkServiceId) return null;
    return services.find((s) => s.id === linkServiceId) ?? null;
  }, [linkServiceId, services]);

  const targetLanguage = 'am'; // because we only link from English -> Amharic with this endpoint
  const targetCategoriesQuery = useAdminCategories({ language: targetLanguage });

  const targetOptions = useMemo(() => {
    const tree = targetCategoriesQuery.data?.data ?? [];
    return flattenCategoryOptions(tree);
  }, [targetCategoriesQuery.data]);

  const linkMutation = useLinkAdminCategoryTranslation();

  const openLinkModal = (serviceId: string) => {
    if (!canLinkTranslations) {
      alert('Switch the admin language to English to link translations.');
      return;
    }
    setLinkServiceId(serviceId);
    setTargetCategoryId('');
    setLinkError(null);
    setLinkOpen(true);
  };

  const closeLinkModal = () => {
    setLinkOpen(false);
    setLinkServiceId(null);
    setTargetCategoryId('');
    setLinkError(null);
  };

  const submitLink = async () => {
    setLinkError(null);

    if (!selectedService) {
      setLinkError('No service selected.');
      return;
    }
    if (!selectedService.categoryId) {
      setLinkError('This service has no category_id to link.');
      return;
    }
    if (!targetCategoryId) {
      setLinkError('Please select a target (Amharic) category.');
      return;
    }

    try {
      await linkMutation.mutateAsync({
        enCategoryId: selectedService.categoryId,
        targetId: targetCategoryId,
      });

      alert('Category translation linked successfully.');
      closeLinkModal();
    } catch (e) {
      setLinkError((e as Error).message || 'Failed to link translation.');
    }
  };

  return (
    <AdminLayout
      title="Service Directory"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-3">
          <ServicesPageHeaderActions onCreateService={handleCreateService} />
          <AdminLanguageSelect language={language} onChange={setLanguage} />
        </div>
      }
    >
      <div className="p-8 max-w-7xl mx-auto w-full bg-[#F8FAFC]">
        <div className="mb-8">
          <ServicesSearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categoryFilter={selectedCategoryId}
            onCategoryChange={handleCategoryChange}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading services...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Failed to load services: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <ServicesGrid
            services={services}
            onEditService={handleEditService}
            onArchiveService={handleArchiveService}
            onDeleteService={handleDeleteService}
            onAddService={handleAddService}
            onLinkCategoryTranslation={openLinkModal}
            canLinkCategoryTranslation={canLinkTranslations}
          />
        )}

        {linkOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-xl border border-slate-200 shadow-xl">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Link Category Translation</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Link this service’s English category to an Amharic category.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {linkError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {linkError}
                  </div>
                )}

                <div className="text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Service</div>
                  <div className="mt-1">{selectedService?.title ?? '-'}</div>
                  <div className="mt-2 text-xs text-slate-500">
                    Source (English) category_id: <span className="font-mono">{selectedService?.categoryId ?? '-'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Target (Amharic) Category
                  </label>

                  {targetCategoriesQuery.isLoading ? (
                    <div className="text-sm text-slate-500">Loading Amharic categories...</div>
                  ) : targetCategoriesQuery.error ? (
                    <div className="text-sm text-red-600">
                      Failed to load Amharic categories: {(targetCategoriesQuery.error as Error).message}
                    </div>
                  ) : (
                    <select
                      value={targetCategoryId}
                      onChange={(e) => setTargetCategoryId(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm"
                    >
                      <option value="">Select Amharic category...</option>
                      {targetOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeLinkModal}
                    className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitLink}
                    disabled={linkMutation.isPending}
                    className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-blue-800 disabled:opacity-60"
                  >
                    {linkMutation.isPending ? 'Linking...' : 'Link Translation'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
