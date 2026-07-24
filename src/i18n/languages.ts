export type LanguageCode = 'en' | 'hi' | 'es';

export const LANGUAGES: { code: LanguageCode; nativeLabel: string }[] = [
  { code: 'en', nativeLabel: 'English' },
  { code: 'hi', nativeLabel: 'हिन्दी' },
  { code: 'es', nativeLabel: 'Español' },
];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export function isSupportedLanguage(code: string | null | undefined): code is LanguageCode {
  return LANGUAGES.some((lang) => lang.code === code);
}
