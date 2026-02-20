import { useParams, Link } from 'react-router-dom';
import { useCategory } from '../features/categories/queries';
import { useServices } from '../features/services/queries';
import { ServiceCard } from '../components/ServiceCard';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categoryResponse } = useCategory(slug!);
  const { data: servicesResponse } = useServices({ 
    category_id: categoryResponse?.data?.id,
    page_size: 50 
  });

  const category = categoryResponse?.data;
  const services = servicesResponse?.data || [];

  if (!category) {
    return <div>Loading category...</div>;
  }

  return (
    <div>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm font-medium text-slate-500">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="hover:text-primary">Home</Link>
            </li>
            <li aria-current="page">
              <span className="text-slate-800">{category.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-slate-600 max-w-3xl">
              {category.description}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Services in this category ({services.length})
          </h2>
          
          {services.length === 0 ? (
            <p className="text-slate-600">No services found in this category.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}