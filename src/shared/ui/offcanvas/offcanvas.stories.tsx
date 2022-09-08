import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { action } from '@storybook/addon-actions';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from 'shared/ui/button';
import Offcanvas from './offcanvas';

export default {
  title: 'Shared/Offcanvas',
  component: Offcanvas,
  // subcomponents: { Header: Offcanvas.Header, Body: Offcanvas.Body, Button },
  args: {
    open: false,
    scroll: false,
    keyboard: true,
    hideBackdrop: false,
    placement: 'right',
    onOpen: action('onOpen'),
    onClose: action('onClose'),
  },
  argTypes: {
    ref: { control: false },
    key: { control: false },
    open: { control: 'boolean' },
    scroll: { control: 'boolean' },
    keyboard: { control: 'boolean' },
    hideBackdrop: { control: 'boolean' },
    placement: {
      options: ['top', 'bottom', 'right', 'left'],
      control: { type: 'radio' },
    },
  },
  parameters: { docs: { source: { type: 'code' } } },
  decorators: [(Story) => <div className="flex items-center justify-center w-full h-screen">{Story()}</div>],
} as ComponentMeta<typeof Offcanvas>;

const Template: ComponentStory<typeof Offcanvas> = ({ onOpen, onClose, ...args }) => {
  const [{ open }, updateArgs] = useArgs();

  const handleClose = () => {
    updateArgs({ open: false });
    if (onClose) onClose();
  };

  return (
    <>
      <Button variant="outlined" shape="smooth" color="black" onClick={() => updateArgs({ open: !open })}>
        Trigger
      </Button>

      <Offcanvas
        {...args}
        id="offcanvas"
        classes={{ right: 'w-80', left: 'w-80', bottom: 'h-40', top: 'h-40' }}
        open={open}
        onOpen={onOpen}
        onClose={handleClose}
        aria-labelledby="offcanvas_label"
        aria-describedby="offcanvas_desc"
      >
        <Offcanvas.Header>
          <h5 id="offcanvas_label" className="title text-black">
            Title
          </h5>
          <Button variant="flat" shape="circle" color="black" size="xs" onClick={() => updateArgs({ open: false })}>
            <XIcon className="w-5 h-5" />
          </Button>
        </Offcanvas.Header>
        <Offcanvas.Body id="offcanvas_desc">Text here...</Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const Default = Template.bind({});
