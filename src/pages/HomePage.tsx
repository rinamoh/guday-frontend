import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useServices } from "../features/services/queries";
import { useCategories } from "../features/categories/queries";
import { ServiceCard } from "../components/ServiceCard";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import LatestNewsSection from "../components/LatestNewsSection";
import { normalizePublicLanguage } from "../utils/publicLanguage";
import { publicCopy } from "../i18n/public";

type CategoryNode = {
  id: string;
  name: string;
  children?: CategoryNode[];
};

type FlatCategory = { id: string; name: string };

const MOST_ASKED_COUNT = 3;

function flattenCategories(nodes: CategoryNode[]): FlatCategory[] {
  const out: FlatCategory[] = [];
  const walk = (arr: CategoryNode[]) => {
    for (const n of arr) {
      out.push({ id: n.id, name: n.name });
      if (Array.isArray(n.children) && n.children.length > 0) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const language = normalizePublicLanguage(searchParams.get("language"));
  const t = publicCopy[language];

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>("");

  const { data: servicesResponse, isLoading: servicesLoading, error: servicesError } = useServices({
    target_audience: "individuals",
    category_id: selectedCategoryId || undefined,
    search: searchQuery || undefined,
    language,
  });

  const { data: categoriesResponse, isLoading: categoriesLoading, error: categoriesError } = useCategories({
    language,
  });

  const services = servicesResponse?.data || [];
  const rawCategories = (categoriesResponse?.data || []) as CategoryNode[];
  const categories = useMemo(() => flattenCategories(rawCategories), [rawCategories]);
  const mostAsked = services.slice(0, MOST_ASKED_COUNT);

  const isLoading = servicesLoading || categoriesLoading;
  const error = servicesError || categoriesError;

  const goSearch = (q?: string) => {
    const p = new URLSearchParams();
    p.set("language", language);
    if (q?.trim()) p.set("q", q.trim());
    navigate(`/search?${p.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-light">
      <Header />

      <main className="flex-1">
        <section className="bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.hero_title}</h1>
              <p className="text-white/90 text-lg">{t.hero_subtitle}</p>
            </div>

            <div className="w-full md:max-w-md shrink-0">
              <label htmlFor="hero-search" className="sr-only">
                {t.hero_search_placeholder}
              </label>
              <div className="flex rounded overflow-hidden bg-white shadow">
                <input
                  id="hero-search"
                  type="text"
                  placeholder={t.hero_search_placeholder}
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") goSearch(heroSearchQuery);
                  }}
                  className="flex-1 px-4 py-3 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <button
                  type="button"
                  onClick={() => goSearch(heroSearchQuery)}
                  className="bg-primary text-white px-4 py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <span className="material-icons">search</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-primary dark:bg-slate-900 pt-4 pb-5">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 md:p-10">
              <h2 className="text-primary text-3xl font-bold mb-8">{t.most_searched_title}</h2>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">{t.most_searched_error}</p>
                </div>
              ) : mostAsked.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600 dark:text-slate-400">{t.most_searched_empty}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {mostAsked.map((service) => (
                    <div key={service.id} className="flex">
                      <div className="w-1.5 bg-primary self-stretch mr-4 shrink-0" aria-hidden />
                      <Link
                        to={`/services/${service.slug}`}
                        className="text-slate-900 hover:text-primary font-medium text-lg leading-tight transition-colors"
                      >
                        {service.title}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-10 pb-14">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-primary">{t.all_services_title}</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">{t.all_categories_option}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="text"
                  placeholder={t.services_search_placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 pl-10 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <span className="material-icons text-sm">search</span>
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-slate-600">{t.loading_services}</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{t.failed_load_services}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                {t.retry}
              </button>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600">{t.no_services_match}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        <LatestNewsSection />
      </main>

      <Footer />
    </div>
  );
}
