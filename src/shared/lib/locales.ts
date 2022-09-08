import { createContext } from 'react';

export const OLocales = {
  EN: 'en',
  RU: 'ru',
} as const;

export type LangContextType = {
  lang: string;
  setLang: (name: string) => void;
};

export const LangContext = createContext<LangContextType>({} as LangContextType);
