
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Language, LANGUAGE_NAMES } from '../types';
import { Languages, ChevronDown, Check } from 'lucide-react';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-agro-50 text-agro-700 rounded-full text-xs font-semibold hover:bg-agro-100 transition-colors border border-agro-200"
      >
        <Languages size={14} />
        <span className="truncate max-w-[80px]">{LANGUAGE_NAMES[language].split(' ')[0]}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden py-1 max-h-80 overflow-y-auto">
            {(Object.keys(LANGUAGE_NAMES) as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-agro-50 transition-colors ${
                  language === lang ? 'text-agro-600 font-bold bg-agro-50/50' : 'text-gray-600'
                }`}
              >
                {LANGUAGE_NAMES[lang]}
                {language === lang && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
