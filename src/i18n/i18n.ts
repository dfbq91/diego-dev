import es from './es.json';
import en from './en.json';

export type Locale = 'es' | 'en';

export const translations = { es, en } as const;

export function getLocale(url: URL): Locale {
  const param = url.searchParams.get('lang');
  if (param === 'es') return 'es';
  return 'en';
}

export function getTranslations(url: URL) {
  const locale = getLocale(url);
  return translations[locale];
}

export function t(url: URL, key: string): string {
  const locale = getLocale(url);
  const keys = key.split('.');
  let value: unknown = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

export function getAlternateUrl(url: URL, locale: Locale): string {
  const newUrl = new URL(url);
  newUrl.searchParams.set('lang', locale);
  return `${newUrl.pathname}${newUrl.search}${newUrl.hash}`;
}
