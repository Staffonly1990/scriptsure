import React from 'react';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DrugSearchInput from './drug.search.input';

export default {
  title: 'Features/Drug.Search/Drug.Search.Input',
  component: DrugSearchInput,
  args: {},
  argTypes: {
    onSearch: { control: false },
  },
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchInput>;

const onSearch = action('onSearch');

const Template: ComponentStory<typeof DrugSearchInput> = ({ ...args }) => {
  return <DrugSearchInput {...args} onSearch={onSearch} />;
};

export const Default = Template.bind({});
