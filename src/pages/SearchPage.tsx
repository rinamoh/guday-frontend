import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useServices } from "../features/services/queries";
import { useCategories } from "../features/categories/queries";
import { ServiceCard } from "../components/ServiceCard";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category_id") || "";

  const [searchInput, setSearchInput] = useState(query);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId);

  const { data: servicesResponse, isLoading } = useServices({
    page: 1,
    page_size: 50,
    search: query || undefined,
    category_id: categoryId || undefined,
  });

  const { data: categoriesResponse } = useCategories();

  const services = servicesResponse?.data || [];
  const categories = categoriesResponse?.data || [];
  const total = servicesResponse?.meta?.total || services.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    }
    if (selectedCategoryId) {
      params.set("category_id", selectedCategoryId);
    }
    setSearchParams(params);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    const params = new URLSearchParams(searchParams);
    if (categoryId) {
      params.set("category_id", categoryId);
    } else {
      params.delete("category_id");
    }
    setSearchParams(params);
  };

  useEffect(() => {
    setSearchInput(query);
    setSelectedCategoryId(categoryId);
  }, [query, categoryId]);

  return (
    <div>
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-4 inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary"
          >
            <span className="material-symbols-outlined text-base mr-1">
              arrow_back
            </span>
            Back to home
          </button>

          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            Search Services
          </h1>

          <form onSubmit={handleSearch} className="max-w-4xl space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for services..."
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <select
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent min-w-[200px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {query && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Search results {query && `for "${query}"`}
            </h2>
            <p className="text-slate-600 mt-1">
              {total} result{total !== 1 ? "s" : ""} found
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Searching...</p>
          </div>
        ) : services.length === 0 && query ? (
          <div className="text-center py-12">
            <p className="text-slate-600">
              No services found matching your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}