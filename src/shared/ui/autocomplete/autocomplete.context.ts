import { createContext, useContext } from 'react';
import { noop } from 'lodash';

const AutocompleteContext = createContext({
  debouncedSource: null,
  source: null,
  select: noop,
  change: noop,
  delegateChange: noop,
  setInputRef: noop,
  inputRef: null as Nullable<HTMLInputElement>,
});

export const AutocompleteProvider = AutocompleteContext.Provider;

export const useAutocompleteContext = () => {
  const context = useContext(AutocompleteContext);
  return context;
};

export default AutocompleteContext;
