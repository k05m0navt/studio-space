export const locales = ['en', 'ru'] as const;
export type Locale = typeof locales[number];

export function isValidLocale(locale: string): locale is Locale {
	return (locales as readonly string[]).includes(locale);
}

export const defaultLocale: Locale = 'en';

export function formatMessage(messages: Record<string, string>, key: string, vars?: Record<string, any>): string {
	const template = messages[key] ?? key;
	if (!vars) return template;
	return template.replace(/\{([^}]+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}
