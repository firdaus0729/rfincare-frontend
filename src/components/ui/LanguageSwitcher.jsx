import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../AppIcon';
import Button from './Button';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
  ];

  const currentLanguage = languages?.find(lang => lang?.code === i18n?.language) || languages?.[0];

  const changeLanguage = (langCode) => {
    i18n?.changeLanguage(langCode);
  };

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center space-x-2 text-sm"
      >
        <Icon name="Globe" size={16} />
        <span className="hidden md:inline">{currentLanguage?.nativeName}</span>
        <Icon name="ChevronDown" size={14} />
      </Button>
      
      <div className="absolute right-0 mt-2 w-40 bg-popover border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {languages?.map((lang) => (
            <button
              key={lang?.code}
              onClick={() => changeLanguage(lang?.code)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center justify-between ${
                i18n?.language === lang?.code ? 'bg-muted text-primary font-semibold' : ''
              }`}
            >
              <span>{lang?.nativeName}</span>
              {i18n?.language === lang?.code && <Icon name="Check" size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;