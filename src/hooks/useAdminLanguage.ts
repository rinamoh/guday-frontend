import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  getStoredAdminLanguage,
  setStoredAdminLanguage,
  type AdminLanguage,
} from '../utils/adminLanguage';

function normalizeAdminLanguage(raw: string | null | undefined): AdminLanguage {
  if (!raw) return 'en';
  const v = raw.trim().toLowerCase();
  return v === 'am' ? 'am' : 'en';
}

export function useAdminLanguage() {
  const location = useLocation();
  const navigate = useNavigate();

  const language = useMemo<AdminLanguage>(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('language');
    if (raw === 'en' || raw === 'am') return raw;
    return getStoredAdminLanguage();
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const raw = params.get('language');
    const normalized = normalizeAdminLanguage(raw);

    // Keep storage in sync with URL (or default).
    setStoredAdminLanguage(normalized);

    // If missing/invalid, rewrite URL to include language=en|am.
    if (raw !== normalized) {
      params.set('language', normalized);
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const setLanguage = useCallback(
    (next: AdminLanguage) => {
      setStoredAdminLanguage(next);
      const params = new URLSearchParams(location.search);
      params.set('language', next);
      navigate(`${location.pathname}?${params.toString()}`);
    },
    [location.pathname, location.search, navigate]
  );

  return { language, setLanguage };
}
