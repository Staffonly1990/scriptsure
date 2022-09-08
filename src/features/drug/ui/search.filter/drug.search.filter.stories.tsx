import React from 'react';
import { FormattedMessage } from 'react-intl';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { map } from 'lodash';

import DrugSearchFilter from './drug.search.filter';

export default {
  title: 'Features/Drug.Search/Drug.Search.Filter',
  component: DrugSearchFilter,
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
    selectedCategory: 'F',
  },
  argTypes: {
    categories: { control: false },
    onSelectCategory: { control: false },
    onChangeData: { control: false },
    onSearch: { control: false },
    onCopy: { control: false },
  },
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchFilter>;

const onSelectCategory = action('onSelectCategory');
const onChangeData = action('onChangeData');
const onSearch = action('onSearch');
const onCopy = action('onCopy');

const drugCats = [
  { value: 'F', name: 'favorite' },
  { value: 'A', name: 'drug.antibiotics' },
  { value: 'B', name: 'drug.bronchodilator' },
  { value: 'C', name: 'drug.cardiac' },
  { value: 'D', name: 'drug.decongestant' },
  { value: 'E', name: 'drug.endocrine' },
  { value: 'G', name: 'drug.gi' },
  { value: 'K+', name: 'drug.htn' },
  { value: 'O', name: 'drug.ophth' },
  { value: 'P', name: 'drug.pain' },
  { value: 'SD', name: 'drug.salves' },
  { value: 'PSY', name: 'drug.psychotropic' },
  { value: 'Z', name: 'drug.misc' },
  { value: 'CO', name: 'drug.compound' },
  { value: 'OR', name: 'drug.order.set' },
];

const Template: ComponentStory<typeof DrugSearchFilter> = ({ ...args }) => {
  const [{ data, selectedCategory }, updateArgs] = useArgs();

  return (
    <DrugSearchFilter
      {...args}
      data={data}
      categories={map(drugCats, ({ value, name: id }) => ({ value, name: <FormattedMessage id={id} /> }))}
      selectedCategory={selectedCategory}
      onSelectCategory={(value) => {
        updateArgs({ selectedCategory: value });
        onSelectCategory(value);
      }}
      onChangeData={(value) => {
        updateArgs({ data: value });
        onChangeData(value);
      }}
      onSearch={(value) => {
        onSearch(value, selectedCategory, data);
      }}
      onCopy={onCopy}
    />
  );
};
export const Default = Template.bind({});
