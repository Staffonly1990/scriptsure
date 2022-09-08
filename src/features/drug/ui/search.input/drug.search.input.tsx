import React, { FC, useCallback, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { useIntl } from 'react-intl';
import { SearchIcon } from '@heroicons/react/outline';
import { isFunction, isEqual } from 'lodash';

import Button from 'shared/ui/button';
import Tooltip from 'shared/ui/tooltip';

export interface IDrugSearchProps {
  value?: string;
  onSearch?: (value: string) => void;
}

const DrugSearchInput: FC<IDrugSearchProps> = ({ value = '', onSearch }) => {
  const { formatMessage } = useIntl();
  const [query, setQuery] = useState(value);

  useUpdateEffect(() => {
    if (!isEqual(query, value)) setQuery(value);
  }, [value]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event?.target?.value ?? '');
  }, []);

  const handleSearch = () => {
    if (isFunction(onSearch)) onSearch(query);
  };

  return (
    <div className="flex item-center">
      <div>
        <label className="form-label text-xs opacity-50">{formatMessage({ id: 'measures.search' })}</label>
        <input className="form-input" type="text" value={query} onChange={handleChange} />
      </div>

      <Tooltip content={formatMessage({ id: 'measures.search' })}>
        <Button variant="flat" shape="circle" color="black" className="ml-1 mt-2" onClick={handleSearch}>
          <SearchIcon className="h-6 w-6 pointer-events-none" focusable={false} aria-hidden />
        </Button>
      </Tooltip>
    </div>
  );
};

DrugSearchInput.displayName = 'DrugSearchInput';
export default DrugSearchInput;
