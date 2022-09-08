/** This file represents the variants of Alert in the storybook */
import React from 'react';
import { AnnotationIcon } from '@heroicons/react/solid';
import { action } from '@storybook/addon-actions';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import Alert from './alert';

/** the default export  defines the metadata about the component. 
 Component - component itself, title - its name in the storybook hierarchy, 
 args a set of arguments that define how the component is to be rendered,
 argTypes specify the behavior of args. If control isn't false, the user can change the component view.
 In this storybook the user may change closable props in the Docs dynamically )

*/
export default {
  title: 'Shared/Alert',
  component: Alert,
  args: {
    closable: false,
    onClose: action('onClose'),
  },
  argTypes: {
    type: { control: false },
    color: { control: false },
    closable: { control: 'boolean' },
  },
} as ComponentMeta<typeof Alert>;

/** There are different variants of the alert component below according to the props it gets */
const Template: ComponentStory<typeof Alert> = (args) => <Alert {...args} />;

export const Warn = (args) => (
  <Alert {...args} type="warn" color="yellow" shape="round" title="Attention needed">
    <p className="mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.</p>
  </Alert>
);

export const WithList = (args) => (
  <Alert {...args} type="error" color="red" shape="round" title="There were 2 errors with your submission">
    <ul className="list-disc pl-5 mt-2 space-y-1">
      <li>Your password must be at least 8 characters</li>
      <li>Your password must include at least one pro wrestling finishing move</li>
    </ul>
  </Alert>
);

export const WithActions = (args) => (
  <Alert
    {...args}
    type="success"
    color="green"
    shape="round"
    title="Order completed"
    actions={
      <>
        <Button variant="flat" color="green" className="text-green-800 font-medium">
          View status
        </Button>
        <Button variant="flat" color="green" className="text-green-800 font-medium">
          Dismiss
        </Button>
      </>
    }
  >
    <div className="mt-2">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.</p>
    </div>
  </Alert>
);

export const WithLinkOnTheRight = (args) => (
  <Alert {...args} type="info" color="blue" shape="round">
    <div className="flex-1 md:flex md:justify-between">
      <p>A new software update is available. See what’s new in version 2.0.4.</p>
      <p className="mt-3 md:mt-0 md:ml-6">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" className="whitespace-nowrap font-medium hover:text-blue-600">
          Details <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  </Alert>
);

export const WithAccentBorder = (args) => (
  <Alert {...args} type="warn" color="yellow" border iconMapping={{ warn: <AnnotationIcon /> }}>
    <div>
      <p>
        You have no credits left.
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#" className=" pl-2 font-medium underline hover:text-yellow-600">
          Upgrade your account to add more credits.
        </a>
      </p>
    </div>
  </Alert>
);

export const WithDismissButton = Template.bind({});
WithDismissButton.args = {
  type: 'success',
  color: 'green',
  title: 'Successfully uploaded',
  closable: true,
};

export const Colored = (args) => (
  <Alert
    {...args}
    color="purple"
    icon={<AnnotationIcon />}
    title="Annotation"
    className="mr-40"
    actions={
      <>
        <Button variant="flat" shape="smooth" color="purple">
          View status
        </Button>
        <Button variant="flat" shape="smooth" color="purple">
          Dismiss
        </Button>
      </>
    }
  >
    <div className="flex">
      <div className="ml-3">
        <div className="mt-2 text-sm ">
          <ul className="list-disc pl-5 space-y-1">
            <li>Your password must be at least 8 characters</li>
            <li>Your password must include at least one pro wrestling finishing move</li>
          </ul>
        </div>
      </div>
    </div>
  </Alert>
);
