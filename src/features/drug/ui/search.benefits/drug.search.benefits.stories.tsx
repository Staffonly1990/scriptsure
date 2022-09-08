import React from 'react';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Select from 'shared/ui/select';

import DrugSearchBenefits from './drug.search.benefits';

export default {
  title: 'Features/Drug.Search/Drug.Search.Benefits',
  component: DrugSearchBenefits,
  args: {
    selectValue: '',
  },
  parameters: { docs: { source: { type: 'code' } } },
} as ComponentMeta<typeof DrugSearchBenefits>;

const Template: ComponentStory<typeof DrugSearchBenefits> = ({ ...args }) => {
  const [{ selectValue }, updateArgs] = useArgs();

  return (
    <Select
      {...args}
      label={<label className="form-label">Benefits</label>}
      className="form-control"
      options={[]}
      // onChange={() => updateArgs({ selectValue: value })}
    />
  );
};
export const Default = Template.bind({});
