import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { AdjustmentsIcon, CurrencyDollarIcon, DuplicateIcon } from '@heroicons/react/outline';
import { useCheckboxGroupState } from '@react-stately/checkbox';

import DrugSearchFilterSelect from './drug.search.filter.select';

export default {
  title: 'Features/Drug.Search/Drug.Search.Filter.Select',
  component: DrugSearchFilterSelect,
  args: {
    data: {
      couponOnly: false,
      searchBrand: true,
      searchGeneric: true,
      searchOtc: true,
      searchSupply: true,
      searchMedication: true,
      searchStatus: 0,
    },
  },
  argTypes: {
    onChange: { control: false },
    onCopy: { control: false },
  },
  parameters: { layout: 'centered', docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof DrugSearchFilterSelect>;

const onChange = action('onChange');
const onCopy = action('onCopy');

const Template: ComponentStory<typeof DrugSearchFilterSelect> = ({ ...args }) => {
  const [{ data }, updateArgs] = useArgs();

  const handleChange = (val) => {
    updateArgs({ data: val });
    onChange(val);
  };

  return <DrugSearchFilterSelect {...args} data={data} onChange={handleChange} onCopy={onCopy} />;
};

export const Default = Template.bind({});
