import React, { Fragment } from 'react';
import { FocusScope } from '@react-aria/focus';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import Popper from './popper';

export default {
  title: 'Shared/Popper',
  component: Popper,
  args: {
    placement: 'bottom-end',
    open: false,
    keyboard: true,
    closeOnOutsideClick: true,
    onOpen: action('onOpen'),
    onClose: action('onClose'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
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
    open: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    closeOnOutsideClick: { control: 'boolean' },
  },
  parameters: { layout: 'centered', docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Popper>;

const Template: ComponentStory<typeof Popper> = ({ onOpen, onClose, ...args }) => {
  const [{ open }, updateArgs] = useArgs();

  const handleOpen = () => {
    updateArgs({ open: true });
    if (onOpen) onOpen();
  };

  const handleClose = () => {
    updateArgs({ open: false });
    if (onClose) onClose();
  };

  return (
    <Popper
      {...args}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      title={<Popper.Title>Title</Popper.Title>}
      content={
        <>
          <Popper.Content>
            <div className="flex items-center justify-between space-x-2">
              <span>Popper element</span>
              <Button tabIndex={0} variant="flat" shape="smooth" color="blue" size="xs" onClick={() => updateArgs({ open: false })}>
                Close
              </Button>
            </div>
          </Popper.Content>
          <FocusScope contain autoFocus>
            <Popper.Listbox>
              <>
                <Popper.ListboxItem as="label">
                  <input className="form-checkbox m-0 mr-4" type="checkbox" tabIndex={-1} aria-hidden />
                  Option item
                </Popper.ListboxItem>
              </>
              <>
                <Popper.ListboxItem as="label">
                  <input className="form-checkbox m-0 mr-4" type="checkbox" tabIndex={-1} aria-hidden />
                  Option item
                </Popper.ListboxItem>
                <Popper.ListboxItem as="label" disabled>
                  <input className="form-checkbox m-0 mr-4" type="checkbox" tabIndex={-1} aria-hidden />
                  Option item
                </Popper.ListboxItem>
              </>
            </Popper.Listbox>
          </FocusScope>
        </>
      }
    >
      <Button variant="outlined" shape="smooth" color="gray">
        Trigger
      </Button>
    </Popper>
  );
};

export const Default = Template.bind({});
