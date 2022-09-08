import React, { useMemo } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';

import Toggle from './toggle';
import { useIntl } from 'react-intl';

export default {
  title: 'Shared/Toggle',
  component: Toggle,
  subcomponents: { 'Toggle.Label': Toggle.Label },
  args: {
    size: 'md',
    color: 'blue',
    checked: false,
    disabled: false,
    onChange: action('onChange'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'radio' },
    },
    color: {
      options: ['black', 'white', 'gray', 'red', 'yellow', 'green', 'blue', 'indigo', 'purple', 'pink'],
      control: { type: 'radio' },
    },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = ({ onChange, ...args }) => {
  const [{ checked }, updateArgs] = useArgs();
  const handleChange = (value) => {
    updateArgs({ checked: value });
    if (onChange) onChange(value);
  };
  return <Toggle {...args} placeholder="placeholder" checked={checked} onChange={handleChange} />;
};

const TemplateWithLabel: ComponentStory<typeof Toggle> = ({ onChange, ...args }) => {
  const { formatMessage } = useIntl();
  const { disabled } = args;
  const [{ checked }, updateArgs] = useArgs();
  const handleChange = (value) => {
    updateArgs({ checked: value });
    if (onChange) onChange(value);
  };
  return (
    <Toggle.Group as="div" className="flex items-center">
      <Toggle {...args} checked={checked} onChange={handleChange} />
      <Toggle.Label as="span" className="ml-3" passive={disabled}>
        <span className="text-sm font-medium text-primary">{formatMessage({ id: 'toggle.annualBilling' })} </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">({formatMessage({ id: 'toggle.save' }, { value: '10%' })})</span>
      </Toggle.Label>
    </Toggle.Group>
  );
};

export const Default = Template.bind({});

export const WithLabel = TemplateWithLabel.bind({});

export const WithCustomClasses = () => {
  const classes = { root: 'w-28 h-14 !bg-[#00bcd4]', handle: 'w-11 h-11 translate-x-1' };
  return <Toggle classes={classes} size={null} color="green" checked />;
};
