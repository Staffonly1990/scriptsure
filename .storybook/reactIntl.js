import English from './../src/shared/lang/messages/en-GB.json';
import Russian from './../src/shared/lang/messages/ru-RU.json';

const locales = ['en', 'ru'];

// const messages = locales.reduce((acc, lang) => ({
//   ...acc,
//   [lang]: require(`./../src/shared/lang/messages/${lang}.json`),
// }), {});

const messages = {
  en: English,
  ru: Russian,
};
// console.log(messages);
const getMessages = (locale) => messages[locale];
export const reactIntl = {
  defaultLocale: 'en',
  locales,
  messages,
};
