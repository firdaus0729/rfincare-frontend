import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { LANGUAGE_CODES } from './languages.js';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import mrTranslations from './locales/mr.json';
import guTranslations from './locales/gu.json';
import bnTranslations from './locales/bn.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import knTranslations from './locales/kn.json';

i18n?.use(LanguageDetector)?.use(initReactI18next)?.init({
    resources: {
      en: { translation: enTranslations },
      hi: { translation: hiTranslations },
      mr: { translation: mrTranslations },
      gu: { translation: guTranslations },
      bn: { translation: bnTranslations },
      ta: { translation: taTranslations },
      te: { translation: teTranslations },
      kn: { translation: knTranslations },
    },
    supportedLngs: LANGUAGE_CODES,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

const applyDocumentLanguage = (lang) => {
  if (typeof document === 'undefined') return;
  const baseLang = (lang || 'en').split('-')[0];
  document.documentElement.lang = baseLang;
  document.documentElement.setAttribute('data-lang', baseLang);
};

applyDocumentLanguage(i18n?.language);
i18n?.on('languageChanged', applyDocumentLanguage);

export default i18n;