const LOCALE_STORAGE_KEY = 'locale';

export type SupportedLocale = 'en' | 'fr';

const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'fr'];

export function getLocale(): SupportedLocale {
	const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
	if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
		return stored as SupportedLocale;
	}

	const nav = navigator.language;
	if (nav.startsWith('fr')) return 'fr';

	return 'en';
}

export function setLocale(locale: SupportedLocale): void {
	localStorage.setItem(LOCALE_STORAGE_KEY, locale);
	window.location.reload();
}
