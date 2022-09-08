import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import MaskFormat from './mask.format';

export default {
  title: 'Shared/MaskFormat',
  component: MaskFormat,
  args: {},
  argTypes: {
    ref: { control: false },
    key: { control: false },
  },
  parameters: { docs: { source: { type: 'code' } }, controls: { hideNoControlsWarning: true } },
} as ComponentMeta<typeof MaskFormat>;

const Template: ComponentStory<typeof MaskFormat> = ({ ...args }) => <MaskFormat textContent="9006422021" options={{ mask: '(999) 999-9999' }} {...args} />;

export const Default = Template.bind({});
