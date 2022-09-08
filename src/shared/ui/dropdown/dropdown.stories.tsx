import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import Dropdown from './dropdown';

export default {
  title: 'Shared/Dropdown',
  component: Dropdown,
  args: {
    list: [<Dropdown.Item>Option item</Dropdown.Item>, <Dropdown.Item>Option item</Dropdown.Item>],
    placement: 'bottom-end',
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    list: { control: false },
    placement: {
      options: ['bottom-start', 'bottom', 'bottom-end', 'top-start', 'top', 'top-end'],
      control: { type: 'radio' },
    },
  },
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="flex items-center justify-center w-full h-screen">
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args}>
    <Button variant="outlined" shape="smooth" color="gray">
      Trigger
    </Button>
  </Dropdown>
);

export const Default = Template.bind({});
