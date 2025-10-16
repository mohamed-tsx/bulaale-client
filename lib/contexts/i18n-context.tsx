'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Translation types
export type Language = 'en' | 'so';

export interface Translations {
  [key: string]: any;
}

export interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

// Create context
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import static translations as fallback
import enTranslations from '@/lib/translations/en.json';
import soTranslations from '@/lib/translations/so.json';

// Translation data
const translations: Record<Language, Translations> = {
  en: enTranslations,
  so: soTranslations
};

// Load translations dynamically
const loadTranslations = async (lang: Language): Promise<Translations> => {
  try {
    const response = await fetch(`/translations/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${lang}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${lang}:`, error);
    return {};
  }
};

// Helper function to get nested translation value
const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : path;
  }, obj);
};

// Helper function to replace parameters in translation strings
const replaceParams = (text: string, params?: Record<string, string | number>): string => {
  if (!params) return text;
  
  return Object.entries(params).reduce((result, [key, value]) => {
    return result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  }, text);
};

// Provider component
interface I18nProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  defaultLanguage = 'en' 
}) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTranslations, setCurrentTranslations] = useState<Translations>(translations[defaultLanguage]);

  // Load translations when language changes
  useEffect(() => {
    const loadLanguage = async () => {
      setIsLoading(true);
      try {
        // Use static translations immediately
        const staticTranslations = translations[language];
        setCurrentTranslations(staticTranslations);
        
        // Try to load dynamic translations to update if available
        try {
          const loadedTranslations = await loadTranslations(language);
          if (Object.keys(loadedTranslations).length > 0) {
            translations[language] = loadedTranslations;
            setCurrentTranslations(loadedTranslations);
          }
        } catch (dynamicError) {
          console.log('Using static translations for', language);
        }
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English if current language fails
        if (language !== 'en') {
          setCurrentTranslations(translations['en']);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, [language]);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('bulaale-language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'so')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Translation function
  const t = (key: string, params?: Record<string, string | number>): string => {
    const translation = getNestedValue(currentTranslations, key);
    return replaceParams(translation, params);
  };

  // Set language function
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bulaale-language', lang);
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
    isLoading
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// Hook to use i18n context
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Hook for translation function only
export const useTranslation = () => {
  const { t } = useI18n();
  return t;
};

// Higher-order component for class components (if needed)
export const withI18n = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    const i18n = useI18n();
    return <Component {...props} i18n={i18n} />;
  };
};
