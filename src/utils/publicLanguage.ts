export type PublicLanguage = 'en' | 'am';

export function normalizePublicLanguage(value: string | null | undefined): PublicLanguage {
  return value === 'am' ? 'am' : 'en';
}
