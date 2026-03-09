// src/utils/adminLanguage.ts

export type AdminLanguage = 'en' | 'am';

const ADMIN_LANGUAGE_KEY = 'admin_language';

function normalizeAdminLanguage(raw: string | null | undefined): AdminLanguage {
  if (!raw) return 'en';
  const value = raw.trim().toLowerCase();
  return value === 'am' ? 'am' : 'en';
}

export function getStoredAdminLanguage(): AdminLanguage {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(ADMIN_LANGUAGE_KEY);
  return normalizeAdminLanguage(stored);
}

export function setStoredAdminLanguage(lang: AdminLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ADMIN_LANGUAGE_KEY, lang);
}