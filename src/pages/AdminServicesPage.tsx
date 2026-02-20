import { AdminLayout } from '../layouts/AdminLayout';
import { ServicesSearchAndFilters } from '../components/admin/ServicesSearchAndFilters';
import { ServicesGrid } from '../components/admin/ServicesGrid';
import { ServicesPageHeaderActions } from '../components/admin/ServicesPageHeaderActions';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminServices } from '../features/admin/services/queries';
import { usePublishAdminService, useArchiveAdminService, useDeleteAdminService } from '../features/admin/services/mutations';

export function AdminServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { data: servicesResponse, isLoading, error } = useAdminServices({
    page: 1,
    page_size: 50,
    status: statusFilter !== 'All Status' ? statusFilter.toLowerCase() : undefined,
    category_id: selectedCategoryId || undefined,
    search: searchQuery || undefined,
  });

  const publishMutation = usePublishAdminService();
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
    setCategoryFilter(categoryId ? 'Filtered' : 'All Categories');
  };

  const breadcrumbs = [
    { label: 'Content Management', href: '/admin/services' },
    { label: 'Service Directory' },
  ];

  return (
    <AdminLayout
      title="Service Directory"
      breadcrumbs={breadcrumbs}
      actions={<ServicesPageHeaderActions onCreateService={handleCreateService} />}
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
          />
        )}
      </div>
    </AdminLayout>
  );
}
