import React, { useContext, memo, FC } from 'react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { OLocales, LangContext } from 'shared/lib/locales';
import Select from '../select/select';

const langVariants = [
  { value: 'en', label: 'en', code: OLocales.EN },
  { value: 'ru', label: 'ru', code: OLocales.RU },
];

const LangSwitcher: FC = memo(() => {
  const { lang, setLang } = useContext(LangContext);
  const langChange = (e) => {
    setLang(e.target.value);
  };
  return <Select options={langVariants} onChange={langChange} checkedIcon={<CheckIcon />} selectIcon={<ChevronDownIcon />} iconPosition="right" value={lang} />;
});
LangSwitcher.displayName = 'LangSwitcher';

export default LangSwitcher;
