import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { DEFAULT_LANGUAGE, isSupportedLanguage } from '@/i18n/languages';
import en from '@/i18n/locales/en.json';
import es from '@/i18n/locales/es.json';
import hi from '@/i18n/locales/hi.json';

function detectDeviceLanguage(): string {
  const deviceCode = Localization.getLocales()[0]?.languageCode;
  return isSupportedLanguage(deviceCode) ? deviceCode : DEFAULT_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    es: { translation: es },
  },
  lng: detectDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v4',
});

export default i18n;
