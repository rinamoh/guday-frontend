import React, { useMemo, useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCategories } from "../features/categories/queries";
import { normalizePublicLanguage } from "../utils/publicLanguage";

type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  children?: CategoryNode[];
};

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
] as const;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [languageOpen, setLanguageOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const paramsFromUrl = new URLSearchParams(location.search);
  const language = normalizePublicLanguage(paramsFromUrl.get("language"));

  const { data: categoriesResponse } = useCategories({ language });

  const topLevelCategories = useMemo(() => {
    const raw = (categoriesResponse?.data ?? []) as CategoryNode[];
    return raw.map((c) => ({ id: c.id, name: c.name }));
  }, [categoriesResponse?.data]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    }
    if (languageOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [languageOpen]);

  const setLanguage = (next: "en" | "am") => {
    const params = new URLSearchParams(location.search);
    params.set("language", next);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    setLanguageOpen(false);
  };

  const handleHeaderSearch = () => {
    const q = headerSearch.trim();
    if (!q) return;

    const p = new URLSearchParams();
    p.set("q", q);
    p.set("language", language);
    navigate(`/search?${p.toString()}`);
  };

  const selectedLangLabel = LANGUAGES.find((l) => l.code === language)?.label ?? "English";

  return (
    <header className="bg-background-light dark:bg-background-dark shadow-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <Link to={`/?language=${language}`} className="text-primary text-4xl font-bold tracking-tight font-display shrink-0">
          Guday
        </Link>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:shrink-0 md:max-w-2xl md:flex-1 md:justify-end">
          <div className="flex w-full sm:max-w-md">
            <input
              type="text"
              placeholder={language === "am" ? "ፈልግ..." : "Search..."}
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleHeaderSearch();
              }}
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-l transition-all"
            />
            <button
              type="button"
              onClick={handleHeaderSearch}
              className="bg-secondary hover:opacity-90 text-white px-4 py-2 flex items-center justify-center rounded-r transition-colors"
            >
              <span className="material-icons text-[20px]">search</span>
            </button>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setLanguageOpen((prev) => !prev)}
              className="bg-primary hover:opacity-90 text-white font-bold py-2 px-6 rounded text-sm transition-opacity whitespace-nowrap flex items-center gap-1"
              aria-expanded={languageOpen}
              aria-haspopup="listbox"
              aria-label="Select language"
            >
              {selectedLangLabel}
              <span className="material-icons text-[18px]">
                {languageOpen ? "expand_less" : "expand_more"}
              </span>
            </button>

            {languageOpen && (
              <ul
                role="listbox"
                className="absolute right-0 top-full mt-1 min-w-[140px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded shadow-lg py-1 z-50"
              >
                {LANGUAGES.map((lang) => (
                  <li key={lang.code} role="option" aria-selected={language === lang.code}>
                    <button
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                        language === lang.code ? "text-primary font-semibold" : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <nav className="border-t border-slate-100 dark:border-slate-800" aria-label="Main">
        <div className="max-w-7xl mx-auto px-4 items-center">
          <ul className="flex flex-wrap items-center justify-start py-3 overflow-x-auto no-scrollbar gap-x-6 md:gap-x-8">
            {topLevelCategories.map((category) => {
              const p = new URLSearchParams();
              p.set("category_id", category.id);
              p.set("language", language);

              return (
                <li key={category.id}>
                  <Link
                    to={`/search?${p.toString()}`}
                    className="text-black font-bold text-sm md:text-base hover:underline underline-offset-4 py-2 block whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
            {topLevelCategories.length === 0 && (
              <li className="text-slate-500 text-sm py-2">
                {language === "am" ? "ምንም ምድብ አልተገኘም" : "No categories available"}
              </li>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
