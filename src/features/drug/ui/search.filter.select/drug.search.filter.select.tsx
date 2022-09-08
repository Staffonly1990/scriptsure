import React, { FC, Key, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useToggle, useShallowCompareEffect } from 'react-use';
import { CurrencyDollarIcon, DuplicateIcon } from '@heroicons/react/outline';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useCheckboxGroupState } from '@react-stately/checkbox';
import { AdjustmentsIcon } from '@heroicons/react/solid';
import { map, pick, pull, every, filter, includes, assign, reduce, uniq, isEqual } from 'lodash';

import { useBreakpoints } from 'shared/lib/media.breakpoints';
import Button from 'shared/ui/button';
import Popper from 'shared/ui/popper';
import Tooltip from 'shared/ui/tooltip';

export interface IDrugFilterData {
  couponOnly?: boolean;
  searchBrand?: boolean;
  searchGeneric?: boolean;
  searchOtc?: boolean;
  searchSupply?: boolean;
  searchMedication?: boolean;
  searchIndication?: boolean;
  searchStatus?: number;
}

export interface IDrugSearchFilterSelectProps {
  data: IDrugFilterData;
  onChange: (data: IDrugFilterData) => void;
  onCopy: () => void;
}

const initialData: IDrugFilterData = {
  couponOnly: false,
  searchBrand: false,
  searchGeneric: false,
  searchOtc: false,
  searchSupply: false,
  searchMedication: false,
  searchIndication: false,
  searchStatus: 0,
} as const;

function array2data(arr: string[]) {
  return {
    couponOnly: includes(arr, 'couponOnly'),
    searchBrand: includes(arr, 'searchBrand'),
    searchGeneric: includes(arr, 'searchGeneric'),
    searchOtc: includes(arr, 'searchOtc'),
    searchSupply: includes(arr, 'searchSupply'),
    searchMedication: includes(arr, 'searchMedication'),
    searchIndication: includes(arr, 'searchIndication'),
    searchStatus:
      // eslint-disable-next-line no-nested-ternary
      includes(arr, 'activeMedication') && includes(arr, 'inactiveMedication')
        ? 2
        : // eslint-disable-next-line no-nested-ternary
        includes(arr, 'inactiveMedication')
        ? 1
        : // eslint-disable-next-line no-nested-ternary
          0,
  } as IDrugFilterData;
}

function data2array(data: IDrugFilterData) {
  return uniq(
    reduce(
      data,
      (acc, v, k) => {
        switch (k) {
          case 'searchStatus':
            if (v === 2) acc.push('activeMedication', 'inactiveMedication');
            else if (v === 1) acc.push('inactiveMedication');
            else acc.push('activeMedication');
            break;
          default:
            if (v === true) acc.push(k);
            break;
        }
        return acc;
      },
      [] as string[]
    )
  );
}

function normalize4data(data: IDrugFilterData) {
  const cdata = assign({ ...initialData }, { ...data });
  if (every([cdata.searchBrand, cdata.searchGeneric, cdata.searchOtc, cdata.searchSupply], (v) => v === false)) {
    assign(cdata, { searchBrand: true });
  }
  if (!includes([0, 1, 2], cdata.searchStatus)) {
    assign(cdata, { searchStatus: 0 });
  }
  return cdata;
}

const DrugSearchFilterSelect: FC<IDrugSearchFilterSelectProps> = ({ data, onChange, onCopy }) => {
  const { formatMessage } = useIntl();
  const breakpoints = useBreakpoints();

  const [isOpen, toggleOpen] = useToggle(false);
  const [value, setValue] = useState<string[]>([]);
  const state = useCheckboxGroupState({ value });

  const changeValue = (val: string[]) => {
    const cdata: IDrugFilterData = normalize4data(array2data(val));
    const nvalue = data2array(cdata);

    setValue(nvalue);
    onChange(cdata);
  };

  const toggleValue = (val) => {
    if (includes(value, val)) changeValue(pull(value, val));
    else changeValue([...value, val]);
  };

  const handleCopy = () => onCopy();

  useShallowCompareEffect(() => {
    const cdata: IDrugFilterData = normalize4data(data);
    const nvalue = data2array(cdata);

    setValue(nvalue);
  }, [data]);

  const selectOptions = [
    [
      { value: 'searchBrand', label: 'drug.brand' },
      { value: 'searchGeneric', label: 'drug.generic' },
      { value: 'searchOtc', label: 'drug.otc' },
      { value: 'searchSupply', label: 'drug.supply' },
    ],
    [
      { value: 'activeMedication', label: 'active.medications' },
      { value: 'inactiveMedication', label: 'inactive.medications' },
    ],
    [
      { value: 'searchMedication', label: 'search.medications' },
      { value: 'searchIndication', label: 'search.indications' },
    ],
  ];

  const filterItems = [
    <Popper.Listbox>
      <Popper.ListboxItem
        as="label"
        key="show.medications.financial.offers"
        className={
          state.isSelected('couponOnly') ? 'bg-green-500 dark:!bg-green-200 hover:bg-green-500 dark:hover:!bg-green-200 text-white dark:!text-black' : ''
        }
      >
        <VisuallyHidden>
          <input
            type="checkbox"
            checked={state.isSelected('couponOnly')}
            onChange={() => {
              toggleValue('couponOnly');
            }}
          />
        </VisuallyHidden>
        <CurrencyDollarIcon className="w-5 h-5 mr-4 my-1 pointer-events-none" focusable={false} aria-hidden />
        {formatMessage({ id: 'show.medications.financial.offers' })}
      </Popper.ListboxItem>
    </Popper.Listbox>,
    map(selectOptions, (variant) => {
      return (
        <Popper.Listbox>
          {map(variant, (item, index) => (
            <Popper.ListboxItem as="label" key={index.toString(36)}>
              <input
                className="form-checkbox m-0 mr-4"
                type="checkbox"
                tabIndex={-1}
                aria-hidden
                checked={state.isSelected(item.value)}
                onChange={() => {
                  toggleValue(item.value);
                }}
              />
              {formatMessage({ id: item.label })}
            </Popper.ListboxItem>
          ))}
        </Popper.Listbox>
      );
    }),
    <Popper.Listbox onClick={handleCopy}>
      <Popper.ListboxItem as="label" key="copy.favorite.list">
        <DuplicateIcon className="w-5 h-5 mr-4 my-1 pointer-events-none" focusable={false} aria-hidden />
        {formatMessage({ id: 'copy.favorite.list' })}
      </Popper.ListboxItem>
    </Popper.Listbox>,
  ];

  return (
    <Popper placement="bottom-start" trigger={null} open={isOpen} content={filterItems} onClose={() => toggleOpen(false)}>
      {({ ref, visible }) => (
        <Tooltip content={formatMessage({ id: 'drug.medication.type' })}>
          <Button ref={ref} variant="flat" shape={breakpoints.md ? 'smooth' : 'circle'} color="black" onClick={() => toggleOpen(!visible)}>
            <AdjustmentsIcon className="w-6 h-6 pointer-events-none" focusable={false} aria-hidden />
            <span className="hidden uppercase md:inline-block pointer-events-none">{formatMessage({ id: 'filter' })}</span>
          </Button>
        </Tooltip>
      )}
    </Popper>
  );
};

DrugSearchFilterSelect.displayName = 'DrugSearchFilterSelect';
export default DrugSearchFilterSelect;
