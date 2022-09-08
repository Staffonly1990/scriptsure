/** This file represents the variants of Alert Notification in the storybook */
import React from 'react';
import { useNotifier } from 'react-headless-notifier';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { NotifierProvider } from 'app/providers';
import Button from 'shared/ui/button';
import Alert from './alert';

/** the default export  defines the metadata about the component. 
Component - component itself, title - its name in the storybook hierarchy, 
args a set of arguments that define how the component is to be rendered,
argTypes specify the behavior of args. If control isn't false, the user can change the component view.
(in this storybook the user may change border and closable in the Docs dynamically )
decorators wrap a storybook in the additional functionality. 
In this case the component NotifierProvider adds where and how the alert will appear.
*/
export default {
  title: 'Shared/Alert.Notification',
  component: Alert.Notification,
  args: {
    shape: 'smooth',
    border: true,
    closable: true,
    onClose: action('onClose'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    type: { control: false },
    shape: { control: false },
    color: { control: false },
    dismiss: { control: false },
    border: { control: 'boolean' },
    closable: { control: 'boolean' },
  },
  decorators: [
    (Story) => {
      return (
        <NotifierProvider>
          <div className="flex items-start w-full h-screen">
            <Story />
          </div>
        </NotifierProvider>
      );
    },
  ],
  parameters: {
    docs: { source: { type: 'code' } },
  },
} as ComponentMeta<typeof Alert.Notification>;

/** There are different variants of the alert component below according to the props it gets */
const Template: ComponentStory<typeof Alert.Notification> = ({ ...args }) => {
  const { notify, dismissAll } = useNotifier();
  return (
    <div className="flex space-x-4">
      <Button
        variant="filled"
        shape="smooth"
        color="blue"
        onClick={() =>
          notify(
            <Alert.Notification
              {...args}
              actions={(close) => (
                <Button variant="flat" color={args?.color} onClick={() => close()}>
                  Dismiss
                </Button>
              )}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo totam eius aperiam dolorum.
            </Alert.Notification>
          )
        }
      >
        Notify
      </Button>
      <Button variant="filled" shape="smooth" color="red" onClick={() => dismissAll()}>
        Dismiss All
      </Button>
    </div>
  );
};

export const Info = Template.bind({});
Info.args = {
  type: 'info',
  color: 'blue',
};

export const Warn = Template.bind({});
Warn.args = {
  type: 'warn',
  color: 'yellow',
};

export const Error = Template.bind({});
Error.args = {
  type: 'error',
  color: 'red',
};

export const Success = Template.bind({});
Success.args = {
  type: 'success',
  color: 'green',
};
