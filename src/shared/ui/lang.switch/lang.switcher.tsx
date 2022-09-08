import React, { FC, useContext, useEffect } from 'react';
import { LangContext } from '../../lib/locales';

const LangSwitcher: FC = () => {
  const { lang, setLang } = useContext(LangContext);
  useEffect(() => {
    window.localStorage.setItem('localeLang', lang);
  }, [lang]);

  return (
    <>
      <button onClick={() => setLang('en')}>EN</button>
      <button onClick={() => setLang('ru')}>RU</button>
    </>
  );
};

export default LangSwitcher;
