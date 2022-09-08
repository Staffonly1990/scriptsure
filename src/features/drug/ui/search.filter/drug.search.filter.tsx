import React, { FC, Key } from 'react';
import { DrugSearchInput, DrugSearchCategorySelect, DrugSearchFilterSelect, IDrugFilterData } from 'features/drug';

export interface IDrugSearchFilter {
  data: IDrugFilterData;
  categories: any[];
  selectedCategory: Key;
  onSelectCategory: (value: Key) => void;
  onChangeData: (data: IDrugFilterData) => void;
  onSearch: (value: string) => void;
  onCopy: () => void;
}

const DrugSearchFilter: FC<IDrugSearchFilter> = ({ data, categories, selectedCategory, onSelectCategory, onChangeData, onSearch, onCopy }) => {
  return (
    <div className="flex items-end">
      <DrugSearchInput onSearch={onSearch} />
      <DrugSearchCategorySelect items={categories} selected={selectedCategory} onSelect={onSelectCategory} />
      <DrugSearchFilterSelect data={data} onChange={onChangeData} onCopy={onCopy} />
    </div>
  );
};

DrugSearchFilter.displayName = 'DrugSearchFilter';
export default DrugSearchFilter;
