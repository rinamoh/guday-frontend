import { useEffect, useRef, useState } from 'react';
import { type AdminLanguage } from '../../utils/adminLanguage';

const ADMIN_LANGUAGES: { code: AdminLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'am', label: 'Amharic' },
];

interface AdminLanguageSelectProps {
  language: AdminLanguage;
  onChange: (next: AdminLanguage) => void;
}

export function AdminLanguageSelect({ language, onChange }: AdminLanguageSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (!open) return;
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const selectedLabel = ADMIN_LANGUAGES.find((l) => l.code === language)?.label ?? 'English';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="bg-primary hover:opacity-90 text-white font-semibold py-1.5 px-4 rounded text-xs sm:text-sm transition-opacity whitespace-nowrap flex items-center gap-1"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        {selectedLabel}
        <span className="material-symbols-outlined text-[18px]">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[140px] bg-white border border-slate-200 rounded shadow-lg py-1 z-50 text-sm"
        >
          {ADMIN_LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={language === lang.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 transition-colors ${
                  language === lang.code ? 'text-primary font-semibold' : 'text-slate-800'
                }`}
              >
                {lang.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
