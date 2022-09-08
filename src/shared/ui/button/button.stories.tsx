import React from 'react';
import { HomeIcon } from '@heroicons/react/solid';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FormattedMessage } from 'react-intl';

import Icon from '../icon';
import Button from './button';

export default {
  title: 'Shared/Button',
  component: Button,
  args: {
    size: 'md',
    color: 'blue',
    checked: false,
    disabled: false,
    onClick: action('onClick'),
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
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => (
  <FormattedMessage id="defaultText" defaultMessage="Text here...">
    {(text) => <Button {...args}>{text}</Button>}
  </FormattedMessage>
);

export const Default = Template.bind({});

export const Block: ComponentStory<typeof Button> = (args) => (
  <FormattedMessage id="defaultText" defaultMessage="Text here...">
    {(text) => (
      <Button {...args} className="!flex justify-center w-full" variant="filled" shape="smooth">
        {text}
      </Button>
    )}
  </FormattedMessage>
);

export const BlockWithIcon: ComponentStory<typeof Button> = (args) => (
  <FormattedMessage id="defaultText" defaultMessage="Text here...">
    {(text) => (
      <Button {...args} className="group relative !flex justify-center w-full" variant="outlined" shape="smooth">
        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          <Icon
            as={HomeIcon}
            className="w-4 h-4 !text-gray-600 !text-opacity-60 group-hover:!text-opacity-90 dark:!text-gray-100 dark:group-hover:!text-gray-600"
          />
        </span>
        {text}
      </Button>
    )}
  </FormattedMessage>
);

export const Filled: ComponentStory<typeof Button> = (args) => (
  <div {...args}>
    <FormattedMessage id="filled" defaultMessage="filled">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="blue" defaultMessage="blue">
      {(text) => (
        <Button {...args} variant="filled" color="blue" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="gray" defaultMessage="gray">
      {(text) => (
        <Button {...args} variant="filled" color="gray" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="green" defaultMessage="green">
      {(text) => (
        <Button {...args} variant="filled" color="green" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="red" defaultMessage="red">
      {(text) => (
        <Button {...args} variant="filled" color="red" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="yellow" defaultMessage="yellow">
      {(text) => (
        <Button {...args} variant="filled" color="yellow" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="purple" defaultMessage="purple">
      {(text) => (
        <Button {...args} variant="filled" color="purple" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="black" defaultMessage="black">
      {(text) => (
        <Button {...args} variant="filled" color="black" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
  </div>
);
Filled.argTypes = { color: { control: false } };

export const Outlined: ComponentStory<typeof Button> = (args) => (
  <div {...args}>
    <FormattedMessage id="outlined" defaultMessage="outlined">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="blue" defaultMessage="blue">
      {(text) => (
        <Button {...args} variant="outlined" color="blue" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="gray" defaultMessage="gray">
      {(text) => (
        <Button {...args} variant="outlined" color="gray" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="green" defaultMessage="green">
      {(text) => (
        <Button {...args} variant="outlined" color="green" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="red" defaultMessage="red">
      {(text) => (
        <Button {...args} variant="outlined" color="red" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="yellow" defaultMessage="yellow">
      {(text) => (
        <Button {...args} variant="outlined" color="yellow" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="purple" defaultMessage="purple">
      {(text) => (
        <Button {...args} variant="outlined" color="purple" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="black" defaultMessage="black">
      {(text) => (
        <Button {...args} variant="outlined" color="black" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
  </div>
);
Outlined.argTypes = { color: { control: false } };

export const Flat: ComponentStory<typeof Button> = (args) => (
  <div {...args}>
    <FormattedMessage id="flat" defaultMessage="flat">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="blue" defaultMessage="blue">
      {(text) => (
        <Button {...args} variant="flat" color="blue" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="gray" defaultMessage="gray">
      {(text) => (
        <Button {...args} variant="flat" color="gray" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="green" defaultMessage="green">
      {(text) => (
        <Button {...args} variant="flat" color="green" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="red" defaultMessage="red">
      {(text) => (
        <Button {...args} variant="flat" color="red" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="yellow" defaultMessage="yellow">
      {(text) => (
        <Button {...args} variant="flat" color="yellow" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="purple" defaultMessage="purple">
      {(text) => (
        <Button {...args} variant="flat" color="purple" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="black" defaultMessage="black">
      {(text) => (
        <Button {...args} variant="flat" color="black" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
  </div>
);
Flat.argTypes = { color: { control: false } };

export const Disabled: ComponentStory<typeof Button> = (args) => (
  <div {...args}>
    <FormattedMessage id="disabled" defaultMessage="disabled">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="blue" defaultMessage="blue">
      {(text) => (
        <Button {...args} color="blue" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="gray" defaultMessage="gray">
      {(text) => (
        <Button {...args} color="gray" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="green" defaultMessage="green">
      {(text) => (
        <Button {...args} color="green" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="red" defaultMessage="red">
      {(text) => (
        <Button {...args} color="red" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="yellow" defaultMessage="yellow">
      {(text) => (
        <Button {...args} color="yellow" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="purple" defaultMessage="purple">
      {(text) => (
        <Button {...args} color="purple" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="black" defaultMessage="black">
      {(text) => (
        <Button {...args} color="black" disabled className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
  </div>
);
Disabled.argTypes = { color: { control: false } };

export const Circle: ComponentStory<typeof Button> = (args) => (
  <div>
    <FormattedMessage id="circle" defaultMessage="circle">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <Button {...args} shape="circle" color="blue" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="gray" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="green" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="red" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="yellow" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="purple" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
    <Button {...args} shape="circle" color="black" className="m-2">
      <Icon as={HomeIcon} className="w-4 h-4" />
    </Button>
  </div>
);
Circle.argTypes = { color: { control: false } };

export const Sizes: ComponentStory<typeof Button> = (args) => (
  <div>
    <FormattedMessage id="sizes" defaultMessage="sizes">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="extraSmall" defaultMessage="extra small">
      {(text) => (
        <Button {...args} size="xs" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="small" defaultMessage="small">
      {(text) => (
        <Button {...args} size="sm" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="medium" defaultMessage="medium">
      {(text) => (
        <Button {...args} size="md" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="large" defaultMessage="large">
      {(text) => (
        <Button {...args} size="lg" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
    <FormattedMessage id="extraLarge" defaultMessage="extra large">
      {(text) => (
        <Button {...args} size="xl" className="m-2">
          {text}
        </Button>
      )}
    </FormattedMessage>
  </div>
);
Sizes.argTypes = { size: { control: false } };

// TODO
export const Group = (args) => (
  <div>
    <FormattedMessage id="group" defaultMessage="group">
      {(text) => <p className="text-primary">{text}</p>}
    </FormattedMessage>
    <FormattedMessage id="left" defaultMessage="left">
      {(text) => <Button {...args}>{text}</Button>}
    </FormattedMessage>
    <FormattedMessage id="middle" defaultMessage="middle">
      {(text) => <Button {...args}>{text}</Button>}
    </FormattedMessage>
    <FormattedMessage id="right" defaultMessage="right">
      {(text) => <Button {...args}>{text}</Button>}
    </FormattedMessage>
  </div>
);
