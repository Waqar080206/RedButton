import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import i18n from '@/i18n';
import { DEFAULT_LANGUAGE, isSupportedLanguage, type LanguageCode } from '@/i18n/languages';

const STORAGE_KEY = 'redbutton.language';

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => Promise<void>;
  isReady: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(
    isSupportedLanguage(i18n.language) ? i18n.language : DEFAULT_LANGUAGE,
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      if (isSupportedLanguage(lng)) setLanguageState(lng);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (isSupportedLanguage(stored) && stored !== i18n.language) {
          return i18n.changeLanguage(stored);
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const setLanguage = useCallback(async (code: LanguageCode) => {
    await i18n.changeLanguage(code);
    await AsyncStorage.setItem(STORAGE_KEY, code);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isReady }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
