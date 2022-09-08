import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Accordion from './accordion';
import Label from './label';

export default {
  title: 'Shared/Accordion',
  component: Accordion,
  subcomponents: { Label },
  args: {
    time: 'Today - Dec 15, 2021',
    userName: 'userName',
  },
  argTypes: {
    color: {
      options: ['black', 'white', 'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'],
      control: { type: 'radio' },
    },
  },
} as ComponentMeta<typeof Accordion>;

const Template: ComponentStory<typeof Accordion> = (args) => {
  return (
    <div className="form-group __row">
      <Accordion {...args} label={<Accordion.Label {...args} />}>
        <div>
          <div>content</div>
        </div>
      </Accordion>
    </div>
  );
};

export const Default = Template.bind({});
