import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
// import { IntlProvider } from 'for';

import { LangContext } from 'shared/lib/locales';
import en from 'shared/lang/messages/en-GB.json';
import ru from 'shared/lang/messages/ru-RU.json';

export const LangProvider = ({ children }) => {
  const [defaultLang] = useState(() => window.localStorage.getItem('localeLang') ?? navigator.language);
  const [lang, setLang] = useState(defaultLang);

  let messages;
  switch (lang) {
    case 'ru':
    case 'ru-RU':
      messages = ru;
      break;
    case 'en':
    case 'en-GB':
    case 'en-US':
    default:
      messages = en;
      break;
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <IntlProvider locale={lang} defaultLocale={lang} messages={messages}>
        {children}
      </IntlProvider>
    </LangContext.Provider>
  );
};
LangProvider.displayName = 'LangProvider';
