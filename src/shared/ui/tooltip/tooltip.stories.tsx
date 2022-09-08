import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Tooltip from './tooltip';

export default {
  title: 'Shared/Tooltip',
  component: Tooltip,
  args: {
    placement: 'top',
    arrow: true,
    interactive: false,
    followCursor: false,
    onVisibleChange: action('onVisibleChange'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    content: { control: false },
    placement: {
      options: [
        'auto',
        'auto-start',
        'auto-end',
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
      control: { type: 'radio' },
    },
    arrow: { control: 'boolean' },
    interactive: { control: 'boolean' },
    followCursor: { control: 'boolean' },
  },
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = ({ ...args }) => {
  return (
    <Tooltip {...args} content="Tooltip element">
      <button className="dark:text-gray-50">Text here...</button>
    </Tooltip>
  );
};

export const Default = Template.bind({});
