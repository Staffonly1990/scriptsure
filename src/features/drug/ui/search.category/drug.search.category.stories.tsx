import React from 'react';
import { FormattedMessage } from 'react-intl';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { map } from 'lodash';

import DrugSearchCategory from './drug.search.category';

export default {
  title: 'Features/Drug.Search/Drug.Search.Category',
  component: DrugSearchCategory,
  args: {
    selected: '',
  },
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchCategory>;

const onSelect = action('onSelect');

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

const Template: ComponentStory<typeof DrugSearchCategory> = ({ ...args }) => {
  const [{ selected }, updateArgs] = useArgs();

  return (
    <DrugSearchCategory
      {...args}
      items={map(drugCats, ({ value, name: id }) => ({ value, name: <FormattedMessage id={id} /> }))}
      selected={selected}
      onSelect={(value) => {
        updateArgs({ selected: value });
        onSelect(value);
      }}
    />
  );
};

export const Default = Template.bind({});
