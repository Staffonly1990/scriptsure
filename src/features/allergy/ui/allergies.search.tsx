import React, { ChangeEvent, FC, useEffect, useCallback, useState, useRef } from 'react';
import { useIntl } from 'react-intl';
import { observer } from 'mobx-react-lite';
import { runInAction } from 'mobx';
import { map } from 'lodash';

import { useDebouncedValue } from 'shared/hooks';
import { IAllergyClassification } from 'shared/api/allergy';
import { OActionStatus } from 'shared/lib/model';
import Autocomplete from 'shared/ui/autocomplete';
import Spinner from 'shared/ui/spinner';
import Popper from 'shared/ui/popper';
import Button from 'shared/ui/button';
import { allergyStore } from '../model';
import { getResultClassText } from '../lib/classification';

export interface IAllergiesSearchProps {
  onSelect?: (value: string, classification: IAllergyClassification) => void;
}

const AllergiesSearch: FC<IAllergiesSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState(allergyStore.searchText);
  const intl = useIntl();
  const debouncedQuery = useDebouncedValue(query, 600);
  const xhrRef = useRef(new XMLHttpRequest());

  const setSearchText = useCallback((value: string) => {
    runInAction(() => {
      allergyStore.searchText = value;
    });
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event?.target?.value);
    if ((event?.nativeEvent as InputEvent)?.inputType !== '') setQuery(event?.target?.value);
  }, []);

  const handleReset = useCallback(() => setQuery(''), []);

  useEffect(() => {
    if (debouncedQuery?.length > 2) {
      allergyStore.searchForAllergyByName(debouncedQuery, () => {
        xhrRef.current = new XMLHttpRequest();
        return xhrRef.current;
      });
    } else if (allergyStore.searchResults.length > 0) {
      allergyStore.resetSearchResults();
    }

    return () => {
      xhrRef.current?.abort();
    };
  }, [debouncedQuery]);

  return (
    <Autocomplete onSelect={onSelect}>
      <Popper
        className="min-w-[200px] max-h-[200px] overflow-y-auto"
        trigger="focus"
        content={
          <>
            {allergyStore.searchResults.length > 0 && (
              <Popper.Listbox>
                {map(allergyStore.searchResults, (classification, index) => (
                  <Popper.ListboxItem
                    as={Autocomplete.Option}
                    key={`${index.toString(36)}`}
                    value={classification}
                    valueToString={(value: IAllergyClassification) => value?.Descr ?? ''}
                    label={
                      <span className="flex items-center justify-between w-full space-x-1">
                        <span>{classification?.Descr}</span>
                        <Button as="span" variant="filled" shape="smooth" color="gray" size="xs">
                          {getResultClassText(classification?.allergyType)}
                        </Button>
                      </span>
                    }
                    dismissed
                  />
                ))}
              </Popper.Listbox>
            )}
            {allergyStore.searchText.length > 0 &&
              !allergyStore.searchResults.length &&
              allergyStore.status.searchForAllergyByName === OActionStatus.Fulfilled && (
                <Popper.Content>
                  <span>
                    {intl.formatMessage({ id: 'allergies.measures.notFound' })} &quot;
                    {allergyStore.searchText}&quot;.
                  </span>
                </Popper.Content>
              )}
          </>
        }
        placement="bottom-start"
        hidden={!allergyStore.searchText?.length}
      >
        {({ ref }) => (
          <span className="inline-flex relative">
            <Autocomplete.Input
              placeholder={intl.formatMessage({ id: 'allergy.measures.searchForAllergy' })}
              ref={ref}
              className="form-input w-[200px] m-px pr-5"
              value={allergyStore.searchText}
              onChange={handleChange}
            />
            {allergyStore.searchText.length > 0 && allergyStore.status.searchForAllergyByName !== OActionStatus.Pending && (
              <span className="absolute top-1/2 right-1 -translate-y-1/2 transform-gpu">
                <Autocomplete.Reset className="w-4 h-4" onClick={handleReset} />
              </span>
            )}
            {allergyStore.status.searchForAllergyByName === OActionStatus.Pending && (
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
AllergiesSearch.displayName = 'AllergiesSearch';

export default observer(AllergiesSearch);
