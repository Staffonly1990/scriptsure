import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import DrugSearchCustom from './drug.search.custom';

export default {
  title: 'Features/Drug.Search/Drug.Search.Custom',
  component: DrugSearchCustom,
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchCustom>;

const Template: ComponentStory<typeof DrugSearchCustom> = () => {
  return <DrugSearchCustom />;
};
export const Default = Template.bind({});
