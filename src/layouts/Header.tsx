import React, { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onToggleDarkMode?: () => void;
}

const NAV_LINKS = [
  { href: "#", label: "Business & Trade Services" },
  { href: "#", label: "Employment & labour" },
  { href: "#", label: "Financial services" },
  { href: "#", label: "Identity, Civil Status & Vital Records" },
  { href: "#", label: "Taxes" },
  { href: "#", label: "Employment & labour" },
  { href: "#", label: "Travel" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "am", label: "Amharic" },
  { code: "om", label: "Oromiffa" },
];

const Header: React.FC<HeaderProps> = ({ onToggleDarkMode }) => {
  const [isDark, setIsDark] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const dropdownRef = useRef<HTMLDivElement>(null);

//use effect for the languaes 
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


  const handleToggleDarkMode = () => {
    setIsDark(!isDark);
    onToggleDarkMode?.();
  };

  return (
    <header className="bg-background-light dark:bg-background-dark shadow-sm border-b border-slate-200 dark:border-slate-700">
      {/* Top bar: logo left, search + language right */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <a
          href="#"
          className="text-primary text-4xl font-bold tracking-tight font-display shrink-0"
        >
          Guday
        </a>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:shrink-0 md:max-w-2xl md:flex-1 md:justify-end">
          <div className="flex w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-l transition-all"
            />
            <button
              type="button"
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
            {selectedLang}
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
                <li key={lang.code} role="option" aria-selected={selectedLang === lang.label}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang.label);
                      setLanguageOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${
                      selectedLang === lang.label ? "text-primary font-semibold" : "text-slate-800 dark:text-slate-200"
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

      {/* Navigation */}
      <nav className="border-t border-slate-100 dark:border-slate-800" aria-label="Main">
        <div className="max-w-7xl mx-auto px-4 items-center">
          <ul className="flex flex-wrap items-center justify-start md:gap-x-8 py-3 overflow-x-auto no-scrollbar gap-x-6 md:gap-x-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-black font-bold text-sm md:text-base hover:underline underline-offset-4 py-2 block whitespace-nowrap"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;