import React, { ChangeEvent, FC, useEffect, useCallback, useState } from 'react';
import { map, reduce, isFunction, debounce } from 'lodash';
import cx from 'classnames';

import Autocomplete from 'shared/ui/autocomplete';
import Spinner from 'shared/ui/spinner';
import Popper from 'shared/ui/popper';

const ControlSuggestions: FC<any> = ({ className, container, defaultValue, value, name, options, loading, onReset, onSelect, onChange }) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!query?.length && value) {
      setQuery(() =>
        reduce(
          options,
          (acc, o) => {
            if (o?.value === value) return o?.label;
            return acc;
          },
          ''
        )
      );
    }
  }, [value, options]);

  const debouncedChange = useCallback(
    debounce((val) => {
      if (isFunction(onChange)) onChange(val);
    }, 300),
    [onChange]
  );

  const handleInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      debouncedChange(event?.target?.value ?? '');
      setQuery(event?.target?.value ?? '');
    },
    [debouncedChange]
  );

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event?.target?.value ?? '');
  }, []);

  const handleReset = useCallback(() => {
    if (isFunction(onReset)) onReset(defaultValue ?? '');
    setQuery('');
  }, [defaultValue, onReset]);

  return (
    <Autocomplete onSelect={onSelect}>
      <Popper
        className="min-w-[200px] w-auto max-h-[200px] overflow-y-auto"
        trigger="focus"
        content={
          <>
            {options?.length > 0 && (
              <Popper.Listbox>
                {map(options, (option, index: number) => (
                  <Popper.ListboxItem
                    as={Autocomplete.Option}
                    key={`${index.toString(36)}`}
                    value={option}
                    valueToString={(o: any) => o?.label ?? ''}
                    label={
                      <span className="flex items-center justify-between w-full space-x-1">
                        <span>{option?.label}</span>
                      </span>
                    }
                    dismissed
                  />
                ))}
              </Popper.Listbox>
            )}
            {query?.length > 0 && !options?.length && (
              <Popper.Content>
                <span>No found matching &quot;{query}&quot;.</span>
              </Popper.Content>
            )}
          </>
        }
        placement="bottom-start"
        hidden={!query?.length || (options?.[0]?.label === query && options?.[0]?.value === value)}
        container={container}
      >
        {({ ref }) => (
          <span className={cx(className, 'inline-flex relative w-full')}>
            <Autocomplete.Input ref={ref} className="form-input w-full m-px pr-5" name={name} value={query} onInput={handleInput} onChange={handleChange} />
            {query?.length > 0 && !loading && (
              <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                <Autocomplete.Reset className="w-4 h-4" onClick={handleReset} />
              </span>
            )}
            {loading && (
              <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                <Spinner.Loader className="w-4 h-4" color="blue" size={null} />
              </span>
            )}
          </span>
        )}
      </Popper>
    </Autocomplete>
  );
};
ControlSuggestions.displayName = 'ControlSuggestions';

export default ControlSuggestions;
