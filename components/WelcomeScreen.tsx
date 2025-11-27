import React from 'react';
import { Button } from './Button';
import { LanguageOption } from '../types';

interface WelcomeScreenProps {
  onSelectLanguage: (lang: LanguageOption) => void;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectLanguage }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-lingo-green mb-4">LingoAI</h1>
        <p className="text-lingo-text text-lg font-medium">I want to learn...</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onSelectLanguage(lang)}
            className="flex items-center p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 group"
          >
            <span className="text-4xl mr-4 group-hover:scale-110 transition-transform">{lang.flag}</span>
            <span className="font-bold text-lingo-text text-lg">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
